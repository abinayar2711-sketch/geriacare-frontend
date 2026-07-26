import Link from "next/link";
import { card } from "@/lib/ui";
import { auth } from "@/auth";

export const metadata = {
  title: "About — Geriacare",
};

export default async function AboutPage() {
  const session = await auth();
  const isMod = session?.user?.role === "moderator";

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">About Geriacare</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
          Geriacare is a community where families, caregivers, and people
          with lived experience come together to share knowledge about elder
          care — whether in an aged care facility or at home.
        </p>
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="text-xl font-semibold">Our Mission</h2>
        <p className="leading-relaxed text-[var(--color-muted)]">
          Caring for aging parents and loved ones is one of the hardest things
          any family faces. Yet good, practical information is scattered,
          contradictory, or locked behind paywalls. Geriacare exists to change
          that.
        </p>
        <p className="leading-relaxed text-[var(--color-muted)]">
          We believe in quality life for every elder — not just medical
          outcomes, but the daily experience of living with dignity, comfort,
          and joy. Our community brings together quality people who have
          walked this path, offering observations and opinions rooted in real
          experience.
        </p>
      </section>

      <section className={`${card} space-y-4`}>
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

      <section className={`${card} space-y-4`}>
        <h2 className="text-xl font-semibold">Our Philosophy</h2>
        <p className="leading-relaxed text-[var(--color-muted)]">
          Geriacare is built on the belief that elder care needs a human
          touch. Too often, the aged care system treats people as consumers
          to be processed rather than individuals to be cared for. We believe
          the right mindset starts with listening — truly hearing what
          families need, what elders want, and what caregivers face every
          day.
        </p>
        <p className="leading-relaxed text-[var(--color-muted)]">
          Good customer service in aged care means genuine subservience to the
          consumer — putting the elder&apos;s needs, comfort, and dignity above
          everything else. That is what good care looks like. Every
          interaction should reflect the quality of life we want for our own
          loved ones.
        </p>
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="text-xl font-semibold">Community Guidelines</h2>
        <ul className="list-disc space-y-2 pl-5 text-[var(--color-muted)]">
          <li>Be kind. Everyone here is doing their best in a hard situation.</li>
          <li>Be specific. The more detail you provide, the better the answers.</li>
          <li>Respect privacy. Never share identifying information about patients.</li>
          <li>Come with the right mindset — to help, not to sell or judge.</li>
          <li>Report content that seems harmful or inaccurate.</li>
          <li>This is not a substitute for emergency medical care. If someone is in immediate danger, call your local emergency number.</li>
        </ul>
      </section>

      <section className={`${card} space-y-4`}>
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

      {isMod && (
      <section className={`${card} space-y-4`}>
        <h2 className="text-xl font-semibold">Growing Sustainably</h2>
        <p className="leading-relaxed text-[var(--color-muted)]">
          Geriacare is committed to growing in a way that serves the
          community first. As we expand, we plan to incorporate training and
          education into our operations — including budgeting for paid
          trainers and content creators who bring real expertise to the
          platform. Quality guidance deserves quality investment.
        </p>
      </section>
      )}

      <section className={`${card} space-y-4`}>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p className="text-[var(--color-muted)]">
          Have questions, suggestions, or want to get involved? Visit our{" "}
          <Link href="/contact" className="text-[var(--color-accent)] underline">
            contact page
          </Link>{" "}
          to reach us.
        </p>
      </section>
    </div>
  );
}
