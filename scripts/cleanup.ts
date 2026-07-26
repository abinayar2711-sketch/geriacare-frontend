import postgres from "postgres";

const conn = postgres(process.env.DATABASE_URL!, { prepare: false, max: 5 });

// Tags to KEEP — relevant to geriacare
const keepSlugs = [
  "bathing-hygiene",
  "health",
  "caregiver-stress",
  "communication",
  "daily-care",
  "dementia",
  "emergency",
  "general",
  "legal-financial",
  "medication",
  "mental-health",
  "mobility",
  "nutrition",
  "pain-management",
  "post-surgery",
  "rehabilitation",
  "safety",
  "sleep",
  "meta",
  "community",
];

async function run() {
  // Delete post-tag associations for tags we will remove
  const deletedAssoc = await conn.unsafe(`
    DELETE FROM post_tag
    WHERE tag_id IN (SELECT id FROM tag WHERE slug != ALL($1))
    RETURNING tag_id
  `, [keepSlugs]);
  console.log("Deleted post-tag associations:", deletedAssoc.length);

  // Delete tags not in keep list
  const deletedTags = await conn.unsafe(`
    DELETE FROM tag WHERE slug != ALL($1)
    RETURNING id, name, slug
  `, [keepSlugs]);
  console.log("\nDeleted tags:", deletedTags.length);
  deletedTags.forEach((t: any) => console.log(`  - ${t.name} (${t.slug})`));

  // Show remaining
  const remaining = await conn.unsafe(`SELECT name, slug FROM tag ORDER BY name`);
  console.log("\nRemaining tags:", remaining.length);
  remaining.forEach((t: any) => console.log(`  - ${t.name}`));

  process.exit(0);
}

run();
