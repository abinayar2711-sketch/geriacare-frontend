/**
 * Migration script: Adapt sangha schema for geriacare.
 * Run once: npx tsx scripts/migrate.ts
 */
import postgres from "postgres";

const conn = postgres(process.env.DATABASE_URL!, { prepare: false, max: 5 });

async function migrate() {
  console.log("Migrating database for geriacare...");

  // 1. Update role enum — add 'family', keep existing values
  await conn.unsafe(`DO $$ BEGIN
    ALTER TYPE role ADD VALUE IF NOT EXISTS 'family';
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;`);

  // 2. Rename lineage → specialization on user table
  await conn.unsafe(`DO $$ BEGIN
    ALTER TABLE "user" RENAME COLUMN lineage TO specialization;
  EXCEPTION WHEN undefined_column THEN null;
  END $$;`);

  // 3. Add new columns to post table
  const postColumns = [
    { name: "patient_age", type: "integer" },
    { name: "patient_gender", type: "text" },
    { name: "condition", type: "text" },
    { name: "medications", type: "text" },
    { name: "urgency", type: "text" },
    { name: "care_setting", type: "text" },
    { name: "relation", type: "text" },
  ];

  for (const col of postColumns) {
    await conn.unsafe(`DO $$ BEGIN
      ALTER TABLE post ADD COLUMN "${col.name}" ${col.type};
    EXCEPTION WHEN duplicate_column THEN null;
    END $$;`);
  }

  // 4. Add default value for urgency
  await conn.unsafe(`DO $$ BEGIN
    ALTER TABLE post ALTER COLUMN urgency SET DEFAULT 'normal';
  EXCEPTION WHEN undefined_column THEN null;
  END $$;`);

  // 5. Add city column to user table
  await conn.unsafe(`DO $$ BEGIN
    ALTER TABLE "user" ADD COLUMN city text;
  EXCEPTION WHEN duplicate_column THEN null;
  END $$;`);

  // 6. Create geriacare-specific tags
  await conn.unsafe(`
    INSERT INTO tag (id, slug, name, description) VALUES
      (gen_random_uuid()::text, 'nutrition', 'Nutrition', 'Diet, feeding, supplements, hydration'),
      (gen_random_uuid()::text, 'mobility', 'Mobility', 'Walking, balance, falls prevention, physiotherapy'),
      (gen_random_uuid()::text, 'dementia', 'Dementia & Memory', 'Alzheimers, cognitive decline, memory loss'),
      (gen_random_uuid()::text, 'medication', 'Medication', 'Drug management, interactions, side effects'),
      (gen_random_uuid()::text, 'mental-health', 'Mental Health', 'Depression, anxiety, loneliness in elders'),
      (gen_random_uuid()::text, 'post-surgery', 'Post-Surgery', 'Recovery after surgery, rehabilitation'),
      (gen_random_uuid()::text, 'daily-care', 'Daily Care', 'Bathing, dressing, grooming, toileting'),
      (gen_random_uuid()::text, 'sleep', 'Sleep', 'Insomnia, sleep patterns, nighttime care'),
      (gen_random_uuid()::text, 'pain-management', 'Pain Management', 'Chronic pain, comfort care, palliative'),
      (gen_random_uuid()::text, 'bathing-hygiene', 'Bathing & Hygiene', 'Personal hygiene, skin care, oral care'),
      (gen_random_uuid()::text, 'emergency', 'Emergency', 'Acute situations, when to call for help'),
      (gen_random_uuid()::text, 'caregiver-stress', 'Caregiver Stress', 'Burnout, self-care for family caregivers'),
      (gen_random_uuid()::text, 'legal-financial', 'Legal & Financial', 'Power of attorney, insurance, planning'),
      (gen_random_uuid()::text, 'grief', 'Grief & Loss', 'Coping with decline, anticipatory grief'),
      (gen_random_uuid()::text, 'rehabilitation', 'Rehabilitation', 'Physical therapy, occupational therapy'),
      (gen_random_uuid()::text, 'communication', 'Communication', 'Talking to elders, hearing loss, dementia communication'),
      (gen_random_uuid()::text, 'safety', 'Safety', 'Fall-proofing, wandering prevention, home safety'),
      (gen_random_uuid()::text, 'general', 'General Care', 'General questions about elder care')
    ON CONFLICT (slug) DO NOTHING;
  `);

  // 7. Create caregivers table
  await conn.unsafe(`
    CREATE TABLE IF NOT EXISTS "caregiver" (
      "id" text PRIMARY KEY,
      "name" text NOT NULL,
      "specialization" text NOT NULL,
      "city" text NOT NULL,
      "experience" text,
      "bio" text,
      "phone" text,
      "email" text,
      "available" text NOT NULL DEFAULT 'yes',
      "created_at" timestamp NOT NULL DEFAULT now()
    );
  `);

  // 8. Create feedback table
  await conn.unsafe(`
    CREATE TABLE IF NOT EXISTS "feedback" (
      "id" text PRIMARY KEY,
      "name" text NOT NULL,
      "email" text NOT NULL,
      "subject" text NOT NULL,
      "message" text NOT NULL,
      "created_at" timestamp NOT NULL DEFAULT now()
    );
  `);

  // 9. Seed sample caregivers
  await conn.unsafe(`
    INSERT INTO "caregiver" ("id", "name", "specialization", "city", "experience", "bio", "available") VALUES
      (gen_random_uuid()::text, 'Amogh Venkatanarayan', 'Verified Expert', 'Mumbai', '12 years', 'Verified expert with experience in elder care and mobility recovery.', 'yes'),
      (gen_random_uuid()::text, 'Dr. Rajesh Kumar', 'Geriatric Medicine', 'Delhi', '18 years', 'Board-certified geriatrician with expertise in polypharmacy management.', 'yes'),
      (gen_random_uuid()::text, 'Anita Desai', 'Dementia Care', 'Bangalore', '8 years', 'Certified dementia caregiver with experience in behavioral management.', 'yes'),
      (gen_random_uuid()::text, 'Vikram Patel', 'Home Nursing', 'Pune', '10 years', 'Experienced home nurse specializing in post-surgical elder care.', 'waitlist')
    ON CONFLICT DO NOTHING;
  `);

  console.log("Migration complete!");
  process.exit(0);
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
