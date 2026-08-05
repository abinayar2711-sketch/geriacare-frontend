import { db, tags } from "@/db";
import type { Metadata } from "next";
import { auth } from "@/auth";
import AskForm from "./AskForm";

export const metadata: Metadata = {
  title: "Ask a Question",
  description:
    "Ask an elder care question. Describe the situation, what you've tried, and what you're asking about — the community and experts will help.",
};

export const dynamic = "force-dynamic";

export default async function Ask() {
  const session = await auth();
  const allTags = await db.select().from(tags).orderBy(tags.name);

  return (
    <div className="-my-10">
      <section className="fullbleed theme-golden min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <AskForm
            allTags={allTags.map((t) => ({
              id: t.id,
              slug: t.slug,
              name: t.name,
            }))}
            signedIn={!!session?.user}
          />
        </div>
      </section>
    </div>
  );
}
