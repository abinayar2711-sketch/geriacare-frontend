import { redirect } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import { db, posts, users, flags, feedback, caregivers, tags } from "@/db";
import { auth } from "@/auth";
import {
  moderate,
  setRole,
  createCaregiver,
  deleteCaregiver,
  createArticle,
} from "@/lib/actions";
import { card, btnPrimary, btnGhost, pill, input, label } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function ModPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "moderator") redirect("/");

  const [pending, flagged, allUsers, recentFeedback, allCaregivers, allTags] =
    await Promise.all([
      db
        .select({ post: posts, author: users })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.status, "needs_review"))
        .orderBy(desc(posts.createdAt))
        .limit(50),
      db
        .select({ post: posts, flagCount: posts.flagCount })
        .from(posts)
        .where(sql`${posts.flagCount} > 0 and ${posts.status} != 'hidden'`)
        .orderBy(desc(posts.flagCount))
        .limit(20),
      db.select().from(users).orderBy(desc(users.createdAt)).limit(50),
      db
        .select()
        .from(feedback)
        .orderBy(desc(feedback.createdAt))
        .limit(20),
      db
        .select()
        .from(caregivers)
        .orderBy(desc(caregivers.createdAt))
        .limit(50),
      db.select().from(tags).orderBy(tags.name),
    ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Moderator Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)]">
          {pending.length} posts awaiting review · {flagged.length} flagged ·{" "}
          {recentFeedback.length} feedback messages
        </p>
      </div>

      {/* Review queue */}
      <section>
        <h2 className="text-lg font-semibold">Needs Review</h2>
        {pending.length === 0 && (
          <p className={`text-sm text-[var(--color-muted)] ${card}`}>
            All clear — nothing pending.
          </p>
        )}
        <ul className="mt-4 space-y-3">
          {pending.map(({ post, author }) => (
            <li key={post.id} className={card}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`${pill} bg-[var(--color-accent-soft)] text-[var(--color-accent)]`}
                  >
                    {post.type}
                  </span>
                  <h3 className="mt-1 font-medium">
                    {post.title || post.body.slice(0, 80)}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    by {author?.name ?? post.authorName ?? "Anonymous"}
                    {post.crisisFlagged && " · crisis flagged"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await moderate(post.id, "approve");
                    }}
                  >
                    <button className={`${btnGhost} text-xs`}>Approve</button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await moderate(post.id, "hide");
                    }}
                  >
                    <button className={`${btnGhost} text-xs`}>Hide</button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Flagged posts */}
      <section>
        <h2 className="text-lg font-semibold">Flagged Posts</h2>
        <ul className="mt-4 space-y-3">
          {flagged.map(({ post }) => (
            <li key={post.id} className={card}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">
                    {post.title || post.body.slice(0, 80)}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {post.flagCount} flags · status: {post.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await moderate(post.id, "approve");
                    }}
                  >
                    <button className={`${btnGhost} text-xs`}>Restore</button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await moderate(post.id, "hide");
                    }}
                  >
                    <button className={`${btnGhost} text-xs`}>Hide</button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Users */}
      <section>
        <h2 className="text-lg font-semibold">Users</h2>
        <ul className="mt-4 space-y-3">
          {allUsers.map((u) => (
            <li key={u.id} className={card}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-medium">{u.name || "Unnamed"}</span>
                  <span className="ml-2 text-xs text-[var(--color-muted)]">
                    {u.email}
                  </span>
                  <span
                    className={`${pill} ml-2 ${
                      u.role === "expert"
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                        : u.role === "moderator"
                        ? "bg-[var(--color-warm-soft)] text-[var(--color-warm)]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
                <div className="flex gap-2">
                  <form
                    action={async (fd: FormData) => {
                      "use server";
                      await setRole(
                        u.id,
                        "expert",
                        String(fd.get("spec") || ""),
                      );
                    }}
                    className="flex items-center gap-1"
                  >
                    <input
                      name="spec"
                      placeholder="specialization"
                      className="w-32 border-b border-[var(--color-line)] bg-transparent text-xs"
                    />
                    <button className={`${btnGhost} text-xs`}>
                      → Expert
                    </button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await setRole(u.id, "moderator");
                    }}
                  >
                    <button className={`${btnGhost} text-xs`}>→ Mod</button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Feedback messages */}
      <section>
        <h2 className="text-lg font-semibold">Feedback Messages</h2>
        {recentFeedback.length === 0 && (
          <p className={`text-sm text-[var(--color-muted)] ${card}`}>
            No feedback messages yet.
          </p>
        )}
        <ul className="mt-4 space-y-3">
          {recentFeedback.map((f) => (
            <li key={f.id} className={card}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{f.subject}</h3>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {f.name} · {f.email} ·{" "}
                    {f.createdAt.toLocaleDateString("en-IN")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {f.message}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Caregiver management */}
      <section>
        <h2 className="text-lg font-semibold">Caregiver Listings</h2>

        {/* Add caregiver form */}
        <form
          action={async (fd: FormData) => {
            "use server";
            await createCaregiver(fd);
          }}
          className={`mt-4 space-y-3 ${card}`}
        >
          <h3 className="font-medium text-sm">Add New Caregiver</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={label}>Name *</label>
              <input name="name" required className={input} />
            </div>
            <div>
              <label className={label}>Specialization *</label>
              <input name="specialization" required className={input} />
            </div>
            <div>
              <label className={label}>City *</label>
              <input name="city" required className={input} />
            </div>
            <div>
              <label className={label}>Experience</label>
              <input
                name="experience"
                placeholder="e.g. 10+ years"
                className={input}
              />
            </div>
            <div>
              <label className={label}>Phone</label>
              <input name="phone" className={input} />
            </div>
            <div>
              <label className={label}>Email</label>
              <input name="email" type="email" className={input} />
            </div>
            <div>
              <label className={label}>Availability</label>
              <select name="available" className={input}>
                <option value="yes">Available</option>
                <option value="waitlist">Waitlist</option>
                <option value="no">Unavailable</option>
              </select>
            </div>
          </div>
          <div>
            <label className={label}>Bio</label>
            <textarea name="bio" rows={2} className={input} />
          </div>
          <button type="submit" className={btnPrimary}>
            Add caregiver
          </button>
        </form>

        {/* Existing caregivers */}
        <ul className="mt-4 space-y-3">
          {allCaregivers.map((c) => (
            <li key={c.id} className={card}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium">{c.name}</h3>
                  <p className="text-sm text-[var(--color-accent)]">
                    {c.specialization} · {c.city}
                  </p>
                  {c.experience && (
                    <p className="text-xs text-[var(--color-muted)]">
                      {c.experience}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <span
                    className={`${pill} ${
                      c.available === "yes"
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                        : c.available === "waitlist"
                        ? "bg-[var(--color-warm-soft)] text-[var(--color-warm)]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.available}
                  </span>
                  <form
                    action={async () => {
                      "use server";
                      await deleteCaregiver(c.id);
                    }}
                  >
                    <button
                      className={`${btnGhost} text-xs text-[var(--color-crisis)]`}
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Publish article */}
      <section>
        <h2 className="text-lg font-semibold">Publish Article</h2>
        <form
          action={async (fd: FormData) => {
            "use server";
            await createArticle(fd);
          }}
          className={`mt-4 space-y-4 ${card}`}
        >
          <div>
            <label className={label}>Title</label>
            <input name="title" required className={input} />
          </div>
          <div>
            <label className={label}>Body</label>
            <textarea
              name="body"
              rows={10}
              required
              className={input}
              placeholder="Write the article content here..."
            />
          </div>
          {allTags.length > 0 && (
            <div>
              <label className={label}>Tags</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-1 text-sm text-[var(--color-muted)]"
                  >
                    <input type="checkbox" name="tags" value={t.slug} className="accent-[var(--color-accent)]" />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          <button type="submit" className={btnPrimary}>
            Publish article
          </button>
        </form>
      </section>
    </div>
  );
}
