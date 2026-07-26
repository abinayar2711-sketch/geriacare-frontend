import { db, tags } from "@/db";
import { auth } from "@/auth";
import AskForm from "./AskForm";

export const dynamic = "force-dynamic";

export default async function Ask() {
  const session = await auth();
  const allTags = await db.select().from(tags).orderBy(tags.name);

  return (
    <div>
      <div className="max-w-2xl space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Ask
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Ask a care question
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            The more specific you are, the better the answers. Include your
            elder&apos;s condition, what you&apos;ve tried, and what you&apos;re
            actually asking about.
          </p>
        </div>

        <AskForm
          allTags={allTags.map((t) => ({
            id: t.id,
            slug: t.slug,
            name: t.name,
          }))}
          signedIn={!!session?.user}
        />
      </div>
    </div>
  );
}
