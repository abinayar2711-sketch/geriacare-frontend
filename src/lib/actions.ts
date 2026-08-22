"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { and, eq, sql, count } from "drizzle-orm";
import {
  db,
  posts,
  votes,
  flags,
  endorsements,
  users,
  tags,
  postTags,
  feedback,
  caregivers,
} from "@/db";
import { auth } from "@/auth";
import { detectCrisis } from "./crisis";
import { nameFrom, slugify, statusForNewPost } from "./utils";

const AUTO_HIDE_FLAGS = 2;
const MIN_CONTEXT = 150;

async function currentUser() {
  const session = await auth();
  return session?.user ?? null;
}

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");
  return session.user;
}

async function reporterKeyFor(userId?: string) {
  if (userId) return userId;
  const jar = await cookies();
  const existing = jar.get(ANON_COOKIE)?.value;
  if (existing) return existing;
  const fresh = crypto.randomUUID();
  jar.set(ANON_COOKIE, fresh, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return fresh;
}

const ANON_COOKIE = "geriacare_anon";

/* ------------------------------------------------------------------ *
 * Compose
 * ------------------------------------------------------------------ */

export type QuestionFormState = {
  error: string;
  values: {
    title: string;
    situation: string;
    tried: string;
    patientAge: string;
    patientGender: string;
    condition: string;
    medications: string;
    city: string;
    urgency: string;
    careSetting: string;
    relation: string;
    authorName: string;
    tags: string[];
  };
} | null;

export async function createQuestion(
  _prev: QuestionFormState,
  formData: FormData,
): Promise<QuestionFormState> {
  const user = await currentUser();

  const title = String(formData.get("title") ?? "").trim();
  const situation = String(formData.get("situation") ?? "").trim();
  const tried = String(formData.get("tried") ?? "").trim();
  const patientAge = String(formData.get("patientAge") ?? "").trim();
  const patientGender = String(formData.get("patientGender") ?? "").trim();
  const condition = String(formData.get("condition") ?? "").trim();
  const medications = String(formData.get("medications") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const urgency = String(formData.get("urgency") ?? "normal").trim();
  const careSetting = String(formData.get("careSetting") ?? "").trim();
  const relation = String(formData.get("relation") ?? "").trim();
  const tagSlugs = formData.getAll("tags").map(String).filter(Boolean);

  const body = [
    situation && `**Situation**\n\n${situation}`,
    tried && `**What I've tried**\n\n${tried}`,
    condition && `**Condition/Diagnosis**\n\n${condition}`,
    medications && `**Current Medications**\n\n${medications}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const authorName = nameFrom(formData);
  const values = {
    title,
    situation,
    tried,
    patientAge,
    patientGender,
    condition,
    medications,
    city,
    urgency,
    careSetting,
    relation,
    authorName: authorName ?? "",
    tags: tagSlugs,
  };

  if (title.length < 15)
    return { error: "Give your question a real title (15+ characters).", values };
  if (situation.length < MIN_CONTEXT)
    return {
      error: `Add more context — at least ${MIN_CONTEXT} characters describing the situation. You have ${situation.length}.`,
      values,
    };

  const status = statusForNewPost(body || title);
  const slug = slugify(title);

  const [post] = await db
    .insert(posts)
    .values({
      type: "question",
      authorId: user?.id ?? null,
      authorName: user ? null : authorName,
      title,
      body: body || title,
      slug,
      status,
      crisisFlagged: detectCrisis(body || title) ? new Date() : null,
      patientAge: patientAge ? parseInt(patientAge) : null,
      patientGender: patientGender || null,
      condition: condition || null,
      medications: medications || null,
      city: city || null,
      urgency: (urgency as "low" | "normal" | "high" | "emergency") || "normal",
      careSetting: careSetting || null,
      relation: relation || null,
    })
    .returning();

  if (tagSlugs.length) {
    const rows = await db.select().from(tags);
    const ids = rows.filter((t) => tagSlugs.includes(t.slug)).map((t) => t.id);
    if (ids.length)
      await db
        .insert(postTags)
        .values(ids.map((tagId) => ({ postId: post.id, tagId })));
  }

  revalidatePath("/");
  redirect(status === "needs_review" && !user ? "/held" : `/post/${post.id}`);
}

export async function createArticle(formData: FormData) {
  const user = await requireUser();
  if (user.role !== "expert" && user.role !== "moderator")
    throw new Error("Only verified experts can publish articles.");

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const tagSlugs = formData.getAll("tags").map(String).filter(Boolean);

  if (title.length < 10) throw new Error("Give your article a title (10+ characters).");
  if (body.length < 200) throw new Error("Articles need at least 200 characters.");

  const [post] = await db
    .insert(posts)
    .values({
      type: "article",
      authorId: user.id,
      authorName: null,
      title,
      body,
      slug: slugify(title),
      status: "live",
    })
    .returning();

  if (tagSlugs.length) {
    const rows = await db.select().from(tags);
    const ids = rows.filter((t) => tagSlugs.includes(t.slug)).map((t) => t.id);
    if (ids.length)
      await db
        .insert(postTags)
        .values(ids.map((tagId) => ({ postId: post.id, tagId })));
  }

  revalidatePath("/");
  revalidatePath("/articles");
  redirect(`/post/${post.id}`);
}

export async function createAnswer(formData: FormData) {
  const user = await currentUser();
  const authorName = nameFrom(formData);
  const parentId = String(formData.get("parentId"));
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 80)
    throw new Error("Answers need at least 80 characters. Say why, not just what.");

  const [parent] = await db.select().from(posts).where(eq(posts.id, parentId));
  if (!parent) throw new Error("Question not found.");
  if (parent.status === "closed") throw new Error("This question is closed to new answers.");

  const status = statusForNewPost(body);
  await db.insert(posts).values({
    type: "answer",
    authorId: user?.id ?? null,
    authorName: user ? null : authorName,
    body,
    parentId,
    status,
  });

  if (status === "live")
    await db
      .update(posts)
      .set({ answerCount: sql`${posts.answerCount} + 1` })
      .where(eq(posts.id, parentId));

  revalidatePath(`/post/${parentId}`);
  if (status === "needs_review" && !user) redirect("/held");
}

export async function createComment(formData: FormData) {
  const user = await currentUser();
  const authorName = nameFrom(formData);
  const parentId = String(formData.get("parentId"));
  const rootId = String(formData.get("rootId") ?? parentId);
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  if (body.length > 600)
    throw new Error("Comments are for clarification. Post an answer instead.");

  await db.insert(posts).values({
    type: "comment",
    authorId: user?.id ?? null,
    authorName: user ? null : authorName,
    body,
    parentId,
    status: "live",
  });
  revalidatePath(`/post/${rootId}`);
}

/* ------------------------------------------------------------------ *
 * Signals
 * ------------------------------------------------------------------ */

export async function toggleVote(
  postId: string,
  kind: "helpful" | "unclear",
  rootId: string,
) {
  const user = await requireUser();
  const [existing] = await db
    .select()
    .from(votes)
    .where(and(eq(votes.userId, user.id), eq(votes.postId, postId)));

  if (existing?.kind === kind) {
    await db
      .delete(votes)
      .where(and(eq(votes.userId, user.id), eq(votes.postId, postId)));
    if (kind === "helpful")
      await db
        .update(posts)
        .set({ helpfulCount: sql`${posts.helpfulCount} - 1` })
        .where(eq(posts.id, postId));
  } else {
    if (existing) {
      await db
        .update(votes)
        .set({ kind })
        .where(and(eq(votes.userId, user.id), eq(votes.postId, postId)));
      await db
        .update(posts)
        .set({
          helpfulCount: sql`${posts.helpfulCount} + ${kind === "helpful" ? 1 : -1}`,
        })
        .where(eq(posts.id, postId));
    } else {
      await db.insert(votes).values({ userId: user.id, postId, kind });
      if (kind === "helpful")
        await db
          .update(posts)
          .set({ helpfulCount: sql`${posts.helpfulCount} + 1` })
          .where(eq(posts.id, postId));
    }
  }
  revalidatePath(`/post/${rootId}`);
}

export async function endorse(postId: string, rootId: string, note?: string) {
  const user = await requireUser();
  if (user.role !== "expert" && user.role !== "moderator")
    throw new Error("Only verified contributors can endorse an answer.");

  const [existing] = await db
    .select()
    .from(endorsements)
    .where(
      and(eq(endorsements.postId, postId), eq(endorsements.expertId, user.id)),
    );

  if (existing) {
    await db
      .delete(endorsements)
      .where(
        and(eq(endorsements.postId, postId), eq(endorsements.expertId, user.id)),
      );
  } else {
    await db.insert(endorsements).values({ postId, expertId: user.id, note });
  }
  revalidatePath(`/post/${rootId}`);
}

export async function flagPost(postId: string, reason: string, rootId: string) {
  const user = await currentUser();
  const reporterKey = await reporterKeyFor(user?.id);
  await db
    .insert(flags)
    .values({ postId, reporterId: user?.id ?? null, reporterKey, reason })
    .onConflictDoNothing();

  const [{ value }] = await db
    .select({ value: count() })
    .from(flags)
    .where(and(eq(flags.postId, postId), sql`${flags.resolvedAt} is null`));

  await db.update(posts).set({ flagCount: value }).where(eq(posts.id, postId));
  if (value >= AUTO_HIDE_FLAGS)
    await db.update(posts).set({ status: "hidden" }).where(eq(posts.id, postId));

  revalidatePath(`/post/${rootId}`);
}

/* ------------------------------------------------------------------ *
 * Moderation
 * ------------------------------------------------------------------ */

async function requireModerator() {
  const user = await requireUser();
  if (user.role !== "moderator") throw new Error("Moderators only.");
  return user;
}

export async function moderate(
  postId: string,
  action: "approve" | "hide" | "close",
) {
  await requireModerator();
  const [post] = await db.select().from(posts).where(eq(posts.id, postId));
  if (!post) return;

  const status = action === "approve" ? "live" : action === "hide" ? "hidden" : "closed";
  await db.update(posts).set({ status }).where(eq(posts.id, postId));

  if (
    action === "approve" &&
    post.type === "answer" &&
    post.parentId &&
    post.status !== "live"
  )
    await db
      .update(posts)
      .set({ answerCount: sql`${posts.answerCount} + 1` })
      .where(eq(posts.id, post.parentId));

  if (action !== "approve" || post.flagCount > 0)
    await db
      .update(flags)
      .set({ resolvedAt: new Date() })
      .where(eq(flags.postId, postId));

  revalidatePath("/mod");
  revalidatePath(`/post/${post.parentId ?? postId}`);
}

export async function setRole(
  userId: string,
  role: "family" | "expert" | "moderator",
  specialization?: string,
) {
  await requireModerator();
  await db
    .update(users)
    .set({ role, specialization: specialization || null })
    .where(eq(users.id, userId));
  revalidatePath("/mod");
}

/* ------------------------------------------------------------------ *
 * Feedback
 * ------------------------------------------------------------------ */

export async function submitFeedback(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message)
    throw new Error("All fields are required.");
  if (message.length < 20)
    throw new Error("Please provide a more detailed message (20+ characters).");

  await db.insert(feedback).values({ name, email, subject, message });
}

/* ------------------------------------------------------------------ *
 * Caregivers (admin-managed)
 * ------------------------------------------------------------------ */

export async function createCaregiver(formData: FormData) {
  await requireModerator();

  const name = String(formData.get("name") ?? "").trim();
  const specialization = String(formData.get("specialization") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const available = String(formData.get("available") ?? "yes").trim();

  if (!name || !specialization || !city)
    throw new Error("Name, specialization, and city are required.");

  await db.insert(caregivers).values({
    name,
    specialization,
    city,
    experience,
    bio,
    phone,
    email,
    available: available as "yes" | "no" | "waitlist",
  });

  revalidatePath("/caregivers");
  revalidatePath("/mod");
}

export async function updateCaregiver(
  id: string,
  formData: FormData,
) {
  await requireModerator();

  const name = String(formData.get("name") ?? "").trim();
  const specialization = String(formData.get("specialization") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;
  const available = String(formData.get("available") ?? "yes").trim();

  await db
    .update(caregivers)
    .set({
      name,
      specialization,
      city,
      experience,
      bio,
      phone,
      email,
      available: available as "yes" | "no" | "waitlist",
    })
    .where(eq(caregivers.id, id));

  revalidatePath("/caregivers");
  revalidatePath("/mod");
}

export async function deleteCaregiver(id: string) {
  await requireModerator();
  await db.delete(caregivers).where(eq(caregivers.id, id));
  revalidatePath("/caregivers");
  revalidatePath("/mod");
}
