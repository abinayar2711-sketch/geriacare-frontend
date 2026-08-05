import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Geriacare — our mission, philosophy, community guidelines, and the people behind the elder care community.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">About GeriaCare</h1>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Care begins with people.</h2>
        <p className="leading-relaxed text-[var(--color-muted)]">
          We believe every older adult needs dignity,
          every caregiver needs support,
          and every family needs guidance.
        </p>
      </section>

      <section className="rounded-lg border border-[var(--color-line-40)] bg-[var(--color-surface)] p-5 space-y-4">
        <h2 className="text-xl font-semibold">Mission</h2>
        <p className="leading-relaxed text-[var(--color-muted)]">
          Caring for ageing parents is one of life&apos;s hardest journeys.
        </p>
        <p className="leading-relaxed text-[var(--color-muted)]">
          Too often, practical guidance is scattered,
          contradictory or difficult to access. A cozy corner for families, caregivers and experts to come together.
        </p>
      </section>

      <section className="rounded-lg border border-[var(--color-line-40)] bg-[var(--color-surface)] p-5 space-y-4">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <ul className="space-y-3 text-[var(--color-muted)]">
          <li>
            <strong className="text-[var(--color-ink)]">Ask a question</strong> —
            Describe your situation in as much detail as you can. Include the
            patient&apos;s age, condition, medications, and what you&apos;ve already
            tried. You don&apos;t need an account.
          </li>
          <li>
            <strong className="text-[var(--color-ink)]">Get answers</strong> —
            People with real experience respond with practical guidance rooted
            in what they&apos;ve seen work, not generic advice.
          </li>
          <li>
            <strong className="text-[var(--color-ink)]">Learn from articles</strong> —
            Community members publish articles on common elder care topics —
            from fall prevention to managing caregiver burnout to navigating
            aged care facilities.
          </li>
        </ul>
      </section>

      <section className="rounded-lg border border-[var(--color-line-40)] bg-[var(--color-surface)] p-5 space-y-4">
        <h2 className="text-xl font-semibold">Medical Disclaimer</h2>
        <p className="leading-relaxed text-[var(--color-muted)]">
          The information shared on Geriacare is provided by community members
          and is not medical advice, diagnosis, or treatment. The content
          posted reflects individual experience and opinion but does not
          constitute a doctor-patient relationship. Always consult a
          qualified healthcare professional for medical concerns about your
          loved one.
        </p>
      </section>

      <section className="rounded-lg border border-[var(--color-line-40)] bg-[var(--color-surface)] p-8 text-center">
        <h2 className="text-xl font-semibold">Still have questions?</h2>
        <p className="mt-2 text-[var(--color-muted)]">
          We&rsquo;re here to help.
        </p>
        <Link
          href="/contact"
          className="mt-5 inline-block rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm text-white transition hover:opacity-90"
        >
          Contact Us →
        </Link>
      </section>
    </div>
  );
}
