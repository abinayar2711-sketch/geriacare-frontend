import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import postgres from "postgres";
import {
  users,
  posts,
  tags,
  postTags,
  endorsements,
} from "../src/db/schema";
import { SEED_TAGS } from "../src/lib/tags";

const conn = postgres(process.env.DATABASE_URL!, { prepare: false, max: 5 });
const db = drizzle(conn);

async function seed() {
  console.log("Seeding geriacare database...");

  // Tags
  const insertedTags = await db
    .insert(tags)
    .values(SEED_TAGS)
    .onConflictDoNothing()
    .returning();
  console.log(`Inserted ${insertedTags.length} tags`);

  // Expert user
  let [expert] = await db
    .insert(users)
    .values({
      name: "Amogh Venkatanarayan",
      email: "amogh@example.com",
      role: "expert",
      specialization: "Verified Expert",
      bio: "Verified expert with experience in elder care.",
      city: "Mumbai",
    })
    .onConflictDoNothing()
    .returning();

  // Family user
  let [family] = await db
    .insert(users)
    .values({
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      role: "family",
      city: "Chennai",
    })
    .onConflictDoNothing()
    .returning();

  // Moderator
  const [mod] = await db
    .insert(users)
    .values({
      name: "Admin",
      email: "admin@geriacare.in",
      role: "moderator",
    })
    .onConflictDoNothing()
    .returning();

  console.log("Inserted users");

  // If users didn't get returned (conflict), fetch them
  if (!expert) {
    const [row] = await db.select().from(users).where(eq(users.email, "amogh@example.com")).limit(1);
    expert = row;
  }
  if (!family) {
    const [row] = await db.select().from(users).where(eq(users.email, "rajesh@example.com")).limit(1);
    family = row;
  }

  if (!expert || !family) {
    console.log("Could not find seed users, skipping posts");
    return;
  }

  // Check if geriacare posts already exist
  const [existingPost] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, "father-dementia-refusing-eat-abc12")).limit(1);
  if (existingPost) {
    console.log("Geriacare seed posts already exist, skipping");
    process.exit(0);
  }

  // Questions
  const [q1] = await db
    .insert(posts)
    .values({
      type: "question",
      authorId: family.id,
      title: "Father with dementia refusing to eat — what can we try?",
      body: `**Situation**

My father (82) was diagnosed with moderate Alzheimer's 6 months ago. In the last two weeks he's been refusing meals, especially solid food. He seems confused at mealtimes and sometimes forgets how to chew.

**What I've tried**

We've tried soft foods, smoothies, and feeding at different times. Sometimes he eats a little, but most meals are refused.

**Condition/Diagnosis**

Moderate Alzheimer's disease

**Current Medications**

Donepezil 10mg daily`,
      slug: "father-dementia-refusing-eat-abc12",
      status: "live",
      patientAge: 82,
      patientGender: "male",
      condition: "Alzheimer's disease",
      medications: "Donepezil 10mg",
      city: "Chennai",
      urgency: "high",
      careSetting: "home",
      relation: "son",
    })
    .returning();

  const [q2] = await db
    .insert(posts)
    .values({
      type: "question",
      authorId: family.id,
      title: "How to prevent falls for an 85-year-old mother at home?",
      body: `**Situation**

My mother (85) has been falling frequently at home. She uses a walker but still manages to stumble. Her balance has gotten worse over the past few months.

**What I've tried**

We've removed loose rugs and installed grab bars in the bathroom. She does some light exercises.

**Condition/Diagnosis**

General weakness, mild osteoporosis

**Current Medications**

Calcium supplements, Vitamin D`,
      slug: "prevent-falls-85-year-old-mother-def45",
      status: "live",
      patientAge: 85,
      patientGender: "female",
      condition: "Osteoporosis, general weakness",
      medications: "Calcium, Vitamin D",
      city: "Bangalore",
      urgency: "normal",
      careSetting: "home",
      relation: "daughter",
    })
    .returning();

  const [q3] = await db
    .insert(posts)
    .values({
      type: "question",
      authorId: null,
      authorName: "Sunita",
      title: "Post-stroke recovery — when should we expect improvement?",
      body: `**Situation**

My father-in-law (70) had a stroke 3 weeks ago. He's in a rehab center now. He can move his left side but his right arm and leg are very weak. The doctors say it's too early to tell.

**Condition/Diagnosis**

Ischemic stroke, right side affected

**Current Medications**

Aspirin, Atorvastatin, Amlodipine`,
      slug: "post-stroke-recovery-when-improvement-ghi78",
      status: "live",
      patientAge: 70,
      patientGender: "male",
      condition: "Ischemic stroke",
      medications: "Aspirin, Atorvastatin, Amlodipine",
      city: "Delhi",
      urgency: "normal",
      careSetting: "rehab",
      relation: "other",
    })
    .returning();

  console.log("Inserted 3 questions");

  // Answers
  await db.insert(posts).values({
    type: "answer",
    authorId: expert.id,
    body: `This is a very common challenge in Alzheimer's care. Here are several approaches that often help:

**Environmental cues**: Keep mealtimes consistent — same time, same place, same routine. The predictability helps reduce confusion.

**Food texture**: Progress to softer textures gradually. Pureed foods that look like regular food (using molds) can help. Nutrient-dense smoothies with protein powder are a good supplement.

**Hand-over-hand**: Sometimes gently guiding the spoon to their mouth can trigger the eating reflex. Don't force it — if he refuses after 2-3 attempts, try again in 30 minutes.

**Distraction-free**: Turn off TV, reduce noise. Alzheimer's patients can't filter stimuli well.

**Consult his neurologist**: The Donepezil might need adjustment, and sometimes appetite loss signals a UTI or other infection in elderly patients. Get a basic blood workup done.`,
    parentId: q1.id,
    status: "live",
  });

  await db.insert(posts).values({
    type: "answer",
    authorId: expert.id,
    body: `Falls in the elderly are serious but preventable. Here's a comprehensive approach:

**Physical therapy**: This is the most important intervention. A physiotherapist can design a balance and strength program specific to her needs. Many rehab centers offer home visits.

**Home modifications**: You've done the basics (grab bars, rug removal). Consider:
- Non-slip flooring in kitchen and bathroom
- Night lights in bedroom and bathroom paths
- Raised toilet seats
- Removing low furniture she might trip over

**Medication review**: Some medications cause dizziness or low blood pressure. Ask her doctor to review all medications for fall risk.

**Vision check**: Poor vision increases fall risk significantly. Get her eyes checked.

**Footwear**: Supportive, non-slip shoes indoors. No walking in socks or loose slippers.

**Vitamin D**: At 85, she likely needs supplementation beyond calcium. Get her levels checked.`,
    parentId: q2.id,
    status: "live",
  });

  console.log("Inserted 2 answers");

  // Article
  const [article] = await db
    .insert(posts)
    .values({
      type: "article",
      authorId: expert.id,
      title: "10 Signs Your Elderly Parent Needs Professional Care",
      body: `Caring for aging parents is one of the hardest things many of us will face. How do you know when home care isn't enough?

**1. Frequent falls or near-falls**
If your parent has fallen more than once in six months, or you notice unexplained bruises, it's time for a professional assessment.

**2. Medication confusion**
Missing doses, taking double doses, or confusion about which medications to take — this is a red flag that can lead to dangerous complications.

**3. Hygiene decline**
Not bathing, wearing the same clothes for days, or a messy bathroom can indicate physical limitations or cognitive decline.

**4. Weight loss**
Unexplained weight loss of more than 5% in a month. This could be depression, difficulty eating, or an underlying illness.
**5. Memory gaps beyond normal aging**

Going back to a place they lived or knew well for a long time, or on a train or plane asking if the next stop has arrived — these go beyond normal age-related forgetfulness.

**6. Social withdrawal**
Stopping activities they used to enjoy, not calling friends, staying in bed — depression in the elderly often looks like withdrawal rather than sadness.

**7. Home disorganization**
Piles of unopened mail, spoiled food in the fridge, or a home that's increasingly cluttered.

**8. Balance and mobility issues**
Difficulty getting up from chairs, shuffling when walking, or holding onto furniture for support.

**9. Confusion about time or place**
Not knowing what day it is, what season it is, or where they are.

**10. Caregiver burnout**
Perhaps the most important sign — if YOU are exhausted, stressed, or resentful, it's time to get help. You can't pour from an empty cup.

Seek help early. A geriatric assessment can identify problems before they become crises.`,
      slug: "10-signs-elderly-parent-needs-care-jkl01",
      status: "live",
    })
    .returning();

  // Tag associations
  if (q1 && insertedTags.length) {
    const dementiaTag = insertedTags.find((t) => t.slug === "dementia");
    const nutritionTag = insertedTags.find((t) => t.slug === "nutrition");
    if (dementiaTag)
      await db
        .insert(postTags)
        .values({ postId: q1.id, tagId: dementiaTag.id })
        .onConflictDoNothing();
    if (nutritionTag)
      await db
        .insert(postTags)
        .values({ postId: q1.id, tagId: nutritionTag.id })
        .onConflictDoNothing();
  }
  if (q2 && insertedTags.length) {
    const mobilityTag = insertedTags.find((t) => t.slug === "mobility");
    const safetyTag = insertedTags.find((t) => t.slug === "safety");
    if (mobilityTag)
      await db
        .insert(postTags)
        .values({ postId: q2.id, tagId: mobilityTag.id })
        .onConflictDoNothing();
    if (safetyTag)
      await db
        .insert(postTags)
        .values({ postId: q2.id, tagId: safetyTag.id })
        .onConflictDoNothing();
  }
  if (q3 && insertedTags.length) {
    const rehabTag = insertedTags.find((t) => t.slug === "rehabilitation");
    if (rehabTag)
      await db
        .insert(postTags)
        .values({ postId: q3.id, tagId: rehabTag.id })
        .onConflictDoNothing();
  }
  if (article && insertedTags.length) {
    const dailyTag = insertedTags.find((t) => t.slug === "daily-care");
    const generalTag = insertedTags.find((t) => t.slug === "general");
    if (dailyTag)
      await db
        .insert(postTags)
        .values({ postId: article.id, tagId: dailyTag.id })
        .onConflictDoNothing();
    if (generalTag)
      await db
        .insert(postTags)
        .values({ postId: article.id, tagId: generalTag.id })
        .onConflictDoNothing();
  }

  // Endorse the expert's answer on q1
  if (expert && q1) {
    const [answer] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(and(eq(posts.parentId, q1.id), eq(posts.type, "answer")))
      .limit(1);
    if (answer) {
      await db
        .insert(endorsements)
        .values({ postId: answer.id, expertId: expert.id })
        .onConflictDoNothing();
    }
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
