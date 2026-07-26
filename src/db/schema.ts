import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey,
  uniqueIndex,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/* ------------------------------------------------------------------ *
 * Enums
 * ------------------------------------------------------------------ */

export const roleEnum = pgEnum("role", [
  "family", // default: family members asking about their elder
  "expert", // verified doctor/caregiver; answers render distinctly
  "moderator", // can hide/restore/close, works the review queue
]);

export const postTypeEnum = pgEnum("post_type", [
  "question",
  "article", // published care tips/guides from experts
  "answer",
  "comment", // secondary: clarification only, no voting
]);

export const postStatusEnum = pgEnum("post_status", [
  "live",
  "needs_review", // crisis language or new account first posts
  "hidden", // 2 flags, or moderator action
  "closed", // question closed to new answers
]);

export const voteKindEnum = pgEnum("vote_kind", ["helpful", "unclear"]);

export const urgencyEnum = pgEnum("urgency", [
  "low",
  "normal",
  "high",
  "emergency",
]);

/* ------------------------------------------------------------------ *
 * Users
 * ------------------------------------------------------------------ */

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),

  role: roleEnum("role").notNull().default("family"),
  bio: text("bio"),
  // For experts: their medical specialization (e.g. "Geriatric Medicine")
  specialization: text("specialization"),
  city: text("city"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

export const posts = pgTable(
  "post",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: postTypeEnum("type").notNull(),
    authorId: text("author_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    authorName: text("author_name"),

    title: text("title"),
    body: text("body").notNull(),
    slug: text("slug"),

    // Answers/comments point at their parent
    parentId: text("parent_id"),

    status: postStatusEnum("status").notNull().default("live"),
    crisisFlagged: timestamp("crisis_flagged_at"),

    helpfulCount: integer("helpful_count").notNull().default(0),
    answerCount: integer("answer_count").notNull().default(0),
    flagCount: integer("flag_count").notNull().default(0),

    // Geriatric care specific fields (questions only)
    patientAge: integer("patient_age"),
    patientGender: text("patient_gender"), // 'male' | 'female' | 'other'
    condition: text("condition"), // diagnosis/condition
    medications: text("medications"), // current meds
    city: text("city"), // patient location
    urgency: urgencyEnum("urgency").notNull().default("normal"),
    careSetting: text("care_setting"), // home|hospital|assisted_living|rehab
    relation: text("relation"), // son|daughter|spouse|self|other

    createdAt: timestamp("created_at").notNull().defaultNow(),
    editedAt: timestamp("edited_at"),
  },
  (t) => [
    index("post_parent_idx").on(t.parentId),
    index("post_feed_idx").on(t.type, t.status, t.createdAt),
    uniqueIndex("post_slug_idx").on(t.slug),
  ],
);

/* ------------------------------------------------------------------ *
 * Signals
 * ------------------------------------------------------------------ */

export const votes = pgTable(
  "vote",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    kind: voteKindEnum("kind").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.postId] })],
);

export const endorsements = pgTable(
  "endorsement",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    expertId: text("expert_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    note: text("note"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.expertId] })],
);

export const flags = pgTable(
  "flag",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    reporterId: text("reporter_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    reporterKey: text("reporter_key").notNull(),
    reason: text("reason").notNull(),
    resolvedAt: timestamp("resolved_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("flag_once_idx").on(t.postId, t.reporterKey)],
);

/* ------------------------------------------------------------------ *
 * Tags
 * ------------------------------------------------------------------ */

export const tags = pgTable("tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
});

export const postTags = pgTable(
  "post_tag",
  {
    postId: text("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
);

/* ------------------------------------------------------------------ *
 * Auth.js tables
 * ------------------------------------------------------------------ */

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

/* ------------------------------------------------------------------ *
 * Caregivers (admin-managed listings)
 * ------------------------------------------------------------------ */

export const caregivers = pgTable("caregiver", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  city: text("city").notNull(),
  experience: text("experience"), // e.g. "10+ years"
  bio: text("bio"),
  phone: text("phone"),
  email: text("email"),
  available: text("available").notNull().default("yes"), // yes | no | waitlist
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ *
 * Feedback (contact form submissions)
 * ------------------------------------------------------------------ */

export const feedback = pgTable("feedback", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type User = typeof users.$inferSelect;
