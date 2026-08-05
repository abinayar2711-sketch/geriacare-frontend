import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { like, or, sql } from "drizzle-orm";
import { db, caregivers } from "@/db";
import { card } from "@/lib/ui";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Caregivers",
  description:
    "Search verified caregiver listings — by city and specialization — managed by the Geriacare moderation team.",
};

export const revalidate = 60;

export default async function CaregiversPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; spec?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "moderator") redirect("/");
  const params = await searchParams;
  const city = params.city?.trim() || "";
  const spec = params.spec?.trim() || "";

  let rows;

  if (city || spec) {
    const conditions = [];
    if (city) conditions.push(like(caregivers.city, `%${city}%`));
    if (spec) conditions.push(like(caregivers.specialization, `%${spec}%`));

    rows = await db
      .select()
      .from(caregivers)
      .where(or(...conditions))
      .orderBy(sql`${caregivers.name}`);
  } else {
    rows = await db
      .select()
      .from(caregivers)
      .orderBy(sql`${caregivers.name}`);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">
        Find a Caregiver
      </h1>
      <p className="mt-3 max-w-xl text-[var(--color-muted)]">
        Browse verified caregivers and geriatric specialists in your area. All
        listings are managed and verified by our moderation team.
      </p>

      {/* Search filters */}
      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          name="city"
          defaultValue={city}
          placeholder="City"
          className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 text-base transition placeholder:text-[var(--color-muted-60)] focus:border-[var(--color-accent)] focus:outline-none"
        />
        <input
          name="spec"
          defaultValue={spec}
          placeholder="Specialization"
          className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 text-base transition placeholder:text-[var(--color-muted-60)] focus:border-[var(--color-accent)] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm text-white transition hover:opacity-90"
        >
          Search
        </button>
        {(city || spec) && (
          <a
            href="/caregivers"
            className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2 text-sm transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Clear
          </a>
        )}
      </form>

      {/* Results */}
      {rows.length === 0 && (
        <div className={`mt-8 ${card}`}>
          <p className="text-[var(--color-muted)]">
            {city || spec
              ? "No caregivers found matching your filters. Try broadening your search."
              : "No caregivers listed yet. Check back soon."}
          </p>
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {rows.map((c) => (
          <li key={c.id} className={`${card}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">{c.name}</h2>
                <p className="mt-0.5 text-sm text-[var(--color-accent)]">
                  {c.specialization}
                </p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {c.city}
                  {c.experience && ` · ${c.experience}`}
                </p>
                {c.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {c.bio}
                  </p>
                )}
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  c.available === "yes"
                    ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                    : c.available === "waitlist"
                    ? "bg-[var(--color-warm-soft)] text-[var(--color-warm)]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {c.available === "yes"
                  ? "Available"
                  : c.available === "waitlist"
                  ? "Waitlist"
                  : "Unavailable"}
              </span>
            </div>
            {(c.phone || c.email) && (
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--color-muted)]">
                {c.phone && <span>Phone: {c.phone}</span>}
                {c.email && <span>Email: {c.email}</span>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
