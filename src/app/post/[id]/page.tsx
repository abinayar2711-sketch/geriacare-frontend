import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { and, asc, countDistinct, desc, eq, sql } from "drizzle-orm";
import { db, posts, users, endorsements, votes } from "@/db";
import { auth } from "@/auth";
import { Body } from "@/components/Body";
import { Byline } from "@/components/Byline";
import { NameField } from "@/components/NameField";
import { CrisisBanner } from "@/components/CrisisBanner";
import {
  createAnswer,
  createComment,
  toggleVote,
  endorse,
  flagPost,
} from "@/lib/actions";
import {
  btnPrimary,
  card,
  hint,
  input,
  label as labelClass,
  pill,
} from "@/lib/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [row] = await db
    .select({ title: posts.title, body: posts.body })
    .from(posts)
    .where(eq(posts.id, id));
  if (!row) return { title: "Geriacare" };
  return {
    title: row.title?.trim()
      ? row.title.trim().slice(0, 60)
      : "Geriacare",
    description: row.body
      ?.replace(/\*\*/g, "")
      .replace(/\n+/g, " ")
      .slice(0, 160),
  };
}

const URGENCY_LABELS: Record<string, string> = {
  low: "Low urgency",
  normal: "",
  high: "Urgent",
  emergency: "Emergency",
};

const URGENCY_COLORS: Record<string, string> = {
  high: "bg-orange-100 text-orange-700",
  emergency: "bg-red-100 text-red-700",
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const me = session?.user;

  const [root] = await db
    .select({ post: posts, author: users })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, id));

  if (!root) notFound();
  const visible =
    root.post.status === "live" ||
    root.post.status === "closed" ||
    me?.role === "moderator" ||
    me?.id === root.post.authorId;
  if (!visible) notFound();

  const answers = await db
    .select({
      post: posts,
      author: users,
      endorsementCount: countDistinct(endorsements.expertId),
      unclearCount: sql<number>`count(distinct ${votes.userId}) filter (where ${votes.kind} = 'unclear')`,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .leftJoin(endorsements, eq(endorsements.postId, posts.id))
    .leftJoin(votes, eq(votes.postId, posts.id))
    .where(
      and(
        eq(posts.parentId, id),
        eq(posts.type, "answer"),
        eq(posts.status, "live"),
      ),
    )
    .groupBy(posts.id, users.id)
    .orderBy(
      desc(countDistinct(endorsements.expertId)),
      desc(posts.helpfulCount),
      asc(posts.createdAt),
    );

  const commentRows = await db
    .select({ post: posts, author: users })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(
      and(
        eq(posts.type, "comment"),
        eq(posts.status, "live"),
        sql`${posts.parentId} in (${sql.join(
          [id, ...answers.map((a) => a.post.id)].map((x) => sql`${x}`),
          sql`, `,
        )})`,
      ),
    )
    .orderBy(asc(posts.createdAt));

  const commentsFor = (parentId: string) =>
    commentRows.filter((c) => c.post.parentId === parentId);
  const canEndorse = me?.role === "expert" || me?.role === "moderator";

  const isArticle = root.post.type === "article";
  const isQuestion = root.post.type === "question";

  return (
    <article>
      {root.post.crisisFlagged && <CrisisBanner />}

      {root.post.status === "needs_review" && (
        <p className={`mb-6 text-sm text-[var(--color-muted)] ${card}`}>
          Held for review. Only you and moderators can see this — a person reads
          posts that mention crisis before they go public.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`${pill} ${
            isArticle
              ? "bg-[var(--color-warm-soft)] text-[var(--color-warm)]"
              : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
          }`}
        >
          {isArticle ? "Article" : "Question"}
        </span>
        {isQuestion &&
          root.post.urgency &&
          root.post.urgency !== "normal" && (
            <span
              className={`${pill} ${URGENCY_COLORS[root.post.urgency] || ""}`}
            >
              {URGENCY_LABELS[root.post.urgency]}
            </span>
          )}
      </div>

      <h1 className="mt-3 text-3xl leading-[1.2] font-semibold tracking-tight sm:text-4xl">
        {root.post.title}
      </h1>

      <div className="mt-3">
        <Byline
          name={root.author?.name ?? root.post.authorName}
          role={root.author?.role}
          specialization={root.author?.specialization}
          at={root.post.createdAt}
        />
      </div>

      {/* Patient info for questions */}
      {isQuestion && (
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
          {root.post.patientAge && (
            <span>Age: {root.post.patientAge}</span>
          )}
          {root.post.patientGender && (
            <span className="capitalize">
              {root.post.patientGender}
            </span>
          )}
          {root.post.condition && <span>{root.post.condition}</span>}
          {root.post.medications && (
            <span>Meds: {root.post.medications}</span>
          )}
          {root.post.city && <span>{root.post.city}</span>}
          {root.post.careSetting && (
            <span className="capitalize">
              {root.post.careSetting.replace("_", " ")}
            </span>
          )}
          {root.post.relation && (
            <span className="capitalize">
              Asked by: {root.post.relation}
            </span>
          )}
        </div>
      )}

      <div className="mt-6 border-t border-[var(--color-line)] pt-6">
        <Body text={root.post.body} />
      </div>

      <PostControls
        postId={root.post.id}
        rootId={id}
        signedIn={!!me}
      />
      <Comments
        rows={commentsFor(root.post.id)}
        parentId={root.post.id}
        rootId={id}
        signedIn={!!me}
      />

      {isQuestion && (
        <section className="mt-12">
          <h2 className="flex items-baseline gap-2 border-b border-[var(--color-line)] pb-3 text-lg font-semibold">
            {answers.length}{" "}
            {answers.length === 1 ? "answer" : "answers"}
            {answers.length > 1 && (
              <span className="text-xs font-normal text-[var(--color-muted)]">
                endorsed first, then most helpful
              </span>
            )}
          </h2>

          <ul className="mt-6 space-y-5">
            {answers.map((a) => {
              const isExpert = a.author?.role === "expert";
              return (
                <li
                  key={a.post.id}
                  className={`rounded-lg border p-5 ${
                    isExpert
                      ? "border-[var(--color-accent)]/35 border-l-[3px] border-l-[var(--color-accent)] bg-[var(--color-accent-soft)]/25"
                      : "border-[var(--color-line)] bg-[var(--color-surface)]"
                  }`}
                >
                  <Byline
                    name={a.author?.name ?? a.post.authorName}
                    role={a.author?.role}
                    specialization={a.author?.specialization}
                    at={a.post.createdAt}
                  />
                  {a.endorsementCount > 0 && (
                    <p className="mt-2">
                      <span
                        className={`${pill} bg-[var(--color-accent)] text-white`}
                      >
                        ✓ sound · {a.endorsementCount} verified{" "}
                        {a.endorsementCount === 1 ? "expert" : "experts"}
                      </span>
                    </p>
                  )}
                  <div className="mt-4">
                    <Body text={a.post.body} />
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-[var(--color-muted)]">
                    <PostControls
                      postId={a.post.id}
                      rootId={id}
                      signedIn={!!me}
                      helpful={a.post.helpfulCount}
                      unclear={Number(a.unclearCount)}
                    />
                    {canEndorse && (
                      <form
                        action={async () => {
                          "use server";
                          await endorse(a.post.id, id);
                        }}
                      >
                        <button className="rounded-full border border-[var(--color-accent)]/40 px-3 py-1 text-[var(--color-accent)] transition hover:bg-[var(--color-accent-soft)]">
                          Endorse as sound
                        </button>
                      </form>
                    )}
                  </div>
                  <Comments
                    rows={commentsFor(a.post.id)}
                    parentId={a.post.id}
                    rootId={id}
                    signedIn={!!me}
                  />
                </li>
              );
            })}
          </ul>

          {root.post.status === "closed" ? (
            <p className={`mt-10 text-sm text-[var(--color-muted)] ${card}`}>
              This question is closed to new answers.
            </p>
          ) : (
            <form action={createAnswer} className={`mt-10 ${card}`}>
              <input type="hidden" name="parentId" value={id} />
              <span className={labelClass}>Your answer</span>
              <span className={hint}>
                Say why, not just what. If you&apos;re a medical professional,
                mention your specialization. At least 80 characters.
              </span>
              <textarea
                name="body"
                rows={8}
                required
                minLength={80}
                className={input}
              />
              {!me && <NameField />}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button className={btnPrimary}>Post answer</button>
                {!me && (
                  <span className="text-xs text-[var(--color-muted)]">
                    Posting as{" "}
                    <span className="italic">Anonymous</span> unless you add a
                    name
                  </span>
                )}
              </div>
            </form>
          )}
        </section>
      )}
    </article>
  );
}

function PostControls({
  postId,
  rootId,
  signedIn,
  helpful,
  unclear,
}: {
  postId: string;
  rootId: string;
  signedIn: boolean;
  helpful?: number;
  unclear?: number;
}) {
  return (
    <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-muted)]">
      {signedIn ? (
        <>
          <form
            action={async () => {
              "use server";
              await toggleVote(postId, "helpful", rootId);
            }}
          >
            <button className="transition hover:text-[var(--color-accent)]">
              Helpful{helpful !== undefined ? ` · ${helpful}` : ""}
            </button>
          </form>
          <form
            action={async () => {
              "use server";
              await toggleVote(postId, "unclear", rootId);
            }}
          >
            <button
              className="transition hover:text-[var(--color-ink)]"
              title="Asks the author to make this clearer. Not a downvote."
            >
              Unclear{unclear ? ` · ${unclear}` : ""}
            </button>
          </form>
        </>
      ) : (
        helpful !== undefined && <span>Helpful · {helpful}</span>
      )}
      <details>
        <summary className="cursor-pointer list-none transition hover:text-[var(--color-ink)]">
          Flag
        </summary>
        <form
          action={async (fd: FormData) => {
            "use server";
            await flagPost(
              postId,
              String(fd.get("reason") || "unspecified"),
              rootId,
            );
          }}
          className="mt-2 flex items-center gap-2"
        >
          <input
            name="reason"
            placeholder="why is this a problem?"
            className="w-48 border-b border-[var(--color-line)] bg-transparent"
          />
          <button className="rounded border border-[var(--color-line)] px-2 py-0.5">
            Report
          </button>
        </form>
      </details>
    </div>
  );
}

function Comments({
  rows,
  parentId,
  rootId,
  signedIn,
}: {
  rows: {
    post: typeof posts.$inferSelect;
    author: typeof users.$inferSelect | null;
  }[];
  parentId: string;
  rootId: string;
  signedIn: boolean;
}) {
  const shown = rows.slice(0, 3);
  return (
    <div className="mt-4 space-y-1.5 border-t border-[var(--color-line)] pt-3 text-xs leading-relaxed text-[var(--color-muted)]">
      {shown.map((c) => (
        <p key={c.post.id} className="border-l-2 border-[var(--color-line)] pl-3">
          <span className="font-medium text-[var(--color-ink)]">
            {c.author?.name ?? c.post.authorName ?? "Anonymous"}
          </span>
          : {c.post.body}
        </p>
      ))}
      {rows.length > 3 && (
        <p className="pl-3 italic">+ {rows.length - 3} more comments</p>
      )}
      <form action={createComment} className="flex flex-wrap items-center gap-2 pt-1.5">
        <input type="hidden" name="parentId" value={parentId} />
        <input type="hidden" name="rootId" value={rootId} />
        <input
          name="body"
          placeholder="Add a clarification…"
          maxLength={600}
          className="flex-1 border-b border-[var(--color-line)] bg-transparent py-1"
        />
        {!signedIn && (
          <input
            name="authorName"
            placeholder="your name (optional)"
            maxLength={60}
            className="w-40 border-b border-[var(--color-line)] bg-transparent py-1"
          />
        )}
        <button className="rounded-full border border-[var(--color-line)] px-3 py-1 transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
          Add
        </button>
      </form>
    </div>
  );
}
