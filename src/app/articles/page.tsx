import Link from "next/link";
import { desc, eq, and, inArray, sql } from "drizzle-orm";
import { db, posts, users, tags, postTags } from "@/db";
import { pill } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      body: posts.body,
      slug: posts.slug,
      createdAt: posts.createdAt,
      authorName: sql<string | null>`coalesce(${users.name}, ${posts.authorName})`,
      authorRole: users.role,
      specialization: users.specialization,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(and(eq(posts.status, "live"), eq(posts.type, "article")))
    .orderBy(desc(posts.createdAt))
    .limit(50);

  const tagRows = rows.length
    ? await db
        .select({ postId: postTags.postId, name: tags.name, slug: tags.slug })
        .from(postTags)
        .innerJoin(tags, eq(tags.id, postTags.tagId))
        .where(inArray(postTags.postId, rows.map((r) => r.id)))
    : [];

  return (
    <div>
      <section className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-warm)]">
          Care Tips & Guides
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Articles from verified experts
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
          Practical guidance on elder care from doctors, caregivers, and health
          professionals.
        </p>
      </section>

      {rows.length === 0 && (
        <p className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-[var(--color-muted)]">
          No articles published yet. Experts can publish articles from the{" "}
          <Link href="/mod" className="underline">
            moderator panel
          </Link>
          .
        </p>
      )}

      <ul className="space-y-4">
        {rows.map((a) => {
          const postTagList = tagRows.filter((t) => t.postId === a.id);
          return (
            <li
              key={a.id}
              className="group relative overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-warm)]/40 hover:shadow-[0_2px_14px_rgba(27,26,23,0.06)]"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[3px] bg-[var(--color-warm)] opacity-0 transition group-hover:opacity-100"
              />
              <span
                className={`${pill} bg-[var(--color-warm-soft)] text-[var(--color-warm)]`}
              >
                Article
              </span>
              <h2 className="mt-2 text-xl leading-snug font-medium">
                <Link
                  href={`/post/${a.id}`}
                  className="transition hover:text-[var(--color-warm)]"
                >
                  <span className="absolute inset-0" aria-hidden />
                  {a.title}
                </Link>
              </h2>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {a.body.replace(/\*\*/g, "").replace(/\n+/g, " ").slice(0, 180)}
                …
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-[var(--color-muted)]">
                <span>{a.authorName || "Anonymous"}</span>
                {a.specialization && <span className="italic">{a.specialization}</span>}
                {postTagList.length > 0 && (
                  <span className="flex flex-wrap gap-1.5">
                    {postTagList.map((t) => (
                      <span
                        key={t.slug}
                        className="rounded border border-[var(--color-line)] px-1.5 py-0.5"
                      >
                        {t.name}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
