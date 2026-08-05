import Link from "next/link";
import type { Metadata } from "next";
import { desc, eq, and, inArray, sql, count } from "drizzle-orm";
import { db, posts, users, tags, postTags } from "@/db";

export const metadata: Metadata = {
  title: "Forum",
  description:
    "Ask questions and share answers about elder care. A supportive community for caregivers and families.",
};

export const revalidate = 30;

export default async function Feed() {
  const [rows, [{ totalQuestions }], [{ totalArticles }], [{ answered }]] =
    await Promise.all([
      db
        .select({
          id: posts.id,
          type: posts.type,
          title: posts.title,
          body: posts.body,
          answerCount: posts.answerCount,
          helpfulCount: posts.helpfulCount,
          urgency: posts.urgency,
          condition: posts.condition,
          city: posts.city,
          createdAt: posts.createdAt,
          authorName: sql<string | null>`coalesce(${users.name}, ${posts.authorName})`,
          authorRole: users.role,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(
          and(
            eq(posts.status, "live"),
            inArray(posts.type, ["question", "article"]),
          ),
        )
        .orderBy(desc(posts.createdAt))
        .limit(50),
      db
        .select({ totalQuestions: count() })
        .from(posts)
        .where(and(eq(posts.type, "question"), eq(posts.status, "live"))),
      db
        .select({ totalArticles: count() })
        .from(posts)
        .where(and(eq(posts.type, "article"), eq(posts.status, "live"))),
      db
        .select({ answered: count() })
        .from(posts)
        .where(
          and(
            eq(posts.type, "question"),
            eq(posts.status, "live"),
            sql`${posts.answerCount} > 0`,
          ),
        ),
    ]);

  const tagRows = rows.length
    ? await db
        .select({ postId: postTags.postId, name: tags.name, slug: tags.slug })
        .from(postTags)
        .innerJoin(tags, eq(tags.id, postTags.tagId))
        .where(inArray(postTags.postId, rows.map((r) => r.id)))
    : [];

  const postsList = rows.slice(0, 20);

  return (
    <div>
      <section className="mb-12 text-center">
        <h1 className="text-4xl leading-[1.15] font-semibold tracking-tight sm:text-5xl">
          Care for Those<br />Who Cared for Us
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
          A place to ask, listen, learn and feel supported—through every stage of the journey.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link
            href="/ask"
            className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-white transition hover:opacity-90"
          >
            Ask a question
          </Link>
          <Link
            href="/articles"
            className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-3 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Browse articles
          </Link>
        </div>
      </section>

      <div className="mb-12 flex items-center justify-center gap-3 text-sm text-[var(--color-muted)]">
        <span>{totalQuestions} {totalQuestions === 1 ? "Question" : "Questions"}</span>
        <span aria-hidden>•</span>
        <span>{totalArticles} {totalArticles === 1 ? "Article" : "Articles"}</span>
        <span aria-hidden>•</span>
        <span>{answered} {answered === 1 ? "Answer" : "Answers"}</span>
      </div>

      {postsList.length > 0 && (
        <section>
          {rows.length === 0 && (
            <p className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-[var(--color-muted)]">
              Nothing here yet. Be the first to ask a question.
            </p>
          )}
          <ul className="space-y-3">
            {postsList.map((p) => {
              const postTagList = tagRows.filter((t) => t.postId === p.id);
              const isArticle = p.type === "article";
              const isUrgent =
                p.urgency === "high" || p.urgency === "emergency";

              return (
                <li
                  key={p.id}
                  className="group relative overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent-40)] hover:shadow-[0_2px_14px_rgba(27,26,23,0.06)]"
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-[3px] ${
                      isArticle
                        ? "bg-[var(--color-warm)]"
                        : "bg-[var(--color-accent)]"
                    } opacity-0 transition group-hover:opacity-100`}
                  />
                  <div className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-wider">
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        isArticle
                          ? "bg-[var(--color-warm-soft)] text-[var(--color-warm)]"
                          : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      }`}
                    >
                      {isArticle ? "Article" : "Question"}
                    </span>
                    {isUrgent && (
                      <span className="rounded-full bg-[var(--color-crisis-soft)] px-2 py-0.5 text-[var(--color-crisis)]">
                        {p.urgency === "emergency" ? "Emergency" : "Urgent"}
                      </span>
                    )}
                    {!isArticle && (
                      <span className="text-[var(--color-muted)]">
                        {p.answerCount}{" "}
                        {p.answerCount === 1 ? "answer" : "answers"}
                      </span>
                    )}
                    {p.condition && (
                      <span className="text-[var(--color-muted)]">
                        {p.condition}
                      </span>
                    )}
                    {p.city && (
                      <span className="text-[var(--color-muted)]">
                        {p.city}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg leading-snug font-medium">
                    <Link
                      href={`/post/${p.id}`}
                      className="transition hover:text-[var(--color-accent)]"
                    >
                      <span className="absolute inset-0" aria-hidden />
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {p.body
                      .replace(/\*\*/g, "")
                      .replace(/\n+/g, " ")
                      .slice(0, 160)}
                    …
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-muted)]">
                    <span className={p.authorName ? "" : "italic"}>
                      {p.authorName || "Anonymous"}
                    </span>
                    {p.authorRole === "expert" && (
                      <span className="text-[var(--color-accent)]">
                        verified expert
                      </span>
                    )}
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
        </section>
      )}
    </div>
  );
}
