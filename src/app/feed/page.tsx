import Link from "next/link";
import { desc, eq, and, inArray, sql, count } from "drizzle-orm";
import { db, posts, users, tags, postTags } from "@/db";

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

  const featuredQuestions = rows
    .filter((r) => r.type === "question")
    .slice(0, 4);
  const featuredArticles = rows
    .filter((r) => r.type === "article")
    .slice(0, 3);
  const latestPosts = rows.slice(0, 20);

  return (
    <div>
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl leading-[1.15] font-semibold tracking-tight sm:text-5xl">
          Care for Those Who Cared for Us
        </h1>
        <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-warm)]">
          The Next Approach
        </p>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
          Non-clinical guidance for living well. Connect with caregivers.
          A gentle approach to ease the living of seniors. Insights that are
          thoughtfully blended and aligned to work well.
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
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          No account needed to ask
        </p>
      </section>

      {/* Stats bar */}
      <section className="mb-12 grid grid-cols-3 gap-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-center">
        <div>
          <p className="text-2xl font-semibold text-[var(--color-accent)]">
            {totalQuestions}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Questions</p>
        </div>
        <div className="border-x border-[var(--color-line)]">
          <p className="text-2xl font-semibold text-[var(--color-warm)]">
            {totalArticles}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Articles</p>
        </div>
        <div>
          <p className="text-2xl font-semibold text-[var(--color-accent)]">
            {answered}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Answered</p>
        </div>
      </section>

      {/* Featured questions */}
      {featuredQuestions.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Recent Questions</h2>
          <ul className="space-y-3">
            {featuredQuestions.map((p) => {
              const postTagList = tagRows.filter((t) => t.postId === p.id);
              const isUrgent =
                p.urgency === "high" || p.urgency === "emergency";

              return (
                <li
                  key={p.id}
                  className="group relative overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent)]/40 hover:shadow-[0_2px_14px_rgba(27,26,23,0.06)]"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px] bg-[var(--color-accent)] opacity-0 transition group-hover:opacity-100"
                  />
                  <div className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-wider">
                    <span className="rounded-full bg-[var(--color-accent-soft)] px-2 py-0.5 text-[var(--color-accent)]">
                      Question
                    </span>
                    {isUrgent && (
                      <span className="rounded-full bg-[var(--color-crisis-soft)] px-2 py-0.5 text-[var(--color-crisis)]">
                        {p.urgency === "emergency" ? "Emergency" : "Urgent"}
                      </span>
                    )}
                    <span className="text-[var(--color-muted)]">
                      {p.answerCount}{" "}
                      {p.answerCount === 1 ? "answer" : "answers"}
                    </span>
                    {p.condition && (
                      <span className="text-[var(--color-muted)]">
                        {p.condition}
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
                    <span>{p.authorName || "Anonymous"}</span>
                    {p.city && <span>{p.city}</span>}
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
          <div className="mt-4 text-center">
            <Link
              href="/ask"
              className="text-sm text-[var(--color-accent)] transition hover:underline"
            >
              Ask your own question →
            </Link>
          </div>
        </section>
      )}

      {/* Featured articles */}
      {featuredArticles.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">Expert Articles</h2>
          <ul className="space-y-3">
            {featuredArticles.map((p) => {
              const postTagList = tagRows.filter((t) => t.postId === p.id);
              return (
                <li
                  key={p.id}
                  className="group relative overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-warm)]/40 hover:shadow-[0_2px_14px_rgba(27,26,23,0.06)]"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px] bg-[var(--color-warm)] opacity-0 transition group-hover:opacity-100"
                  />
                  <span className="rounded-full bg-[var(--color-warm-soft)] px-2 py-0.5 text-[0.7rem] uppercase tracking-wider text-[var(--color-warm)]">
                    Article
                  </span>
                  <h3 className="mt-2 text-lg leading-snug font-medium">
                    <Link
                      href={`/post/${p.id}`}
                      className="transition hover:text-[var(--color-warm)]"
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
                    <span>{p.authorName || "Expert"}</span>
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
          <div className="mt-4 text-center">
            <Link
              href="/articles"
              className="text-sm text-[var(--color-warm)] transition hover:underline"
            >
              View all articles →
            </Link>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="mb-12">
        <h2 className="mb-6 text-center text-lg font-semibold">How It Works</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-sm font-semibold text-[var(--color-accent)]">
              1
            </div>
            <h3 className="font-medium">Ask</h3>
            <p className="mt-1.5 text-sm text-[var(--color-muted)]">
              Describe your situation with as much detail as you can. No account
              needed.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-sm font-semibold text-[var(--color-accent)]">
              2
            </div>
            <h3 className="font-medium">Get answers</h3>
            <p className="mt-1.5 text-sm text-[var(--color-muted)]">
              Verified doctors and experienced caregivers respond with real,
              practical guidance.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-sm font-semibold text-[var(--color-accent)]">
              3
            </div>
            <h3 className="font-medium">Learn</h3>
            <p className="mt-1.5 text-sm text-[var(--color-muted)]">
              Browse expert articles and past questions to build your elder care
              knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Latest feed */}
      {latestPosts.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Latest</h2>
          {rows.length === 0 && (
            <p className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-[var(--color-muted)]">
              Nothing here yet. Be the first to ask a question.
            </p>
          )}
          <ul className="space-y-3">
            {latestPosts.map((p) => {
              const postTagList = tagRows.filter((t) => t.postId === p.id);
              const isArticle = p.type === "article";
              const isUrgent =
                p.urgency === "high" || p.urgency === "emergency";

              return (
                <li
                  key={p.id}
                  className="group relative overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-accent)]/40 hover:shadow-[0_2px_14px_rgba(27,26,23,0.06)]"
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
