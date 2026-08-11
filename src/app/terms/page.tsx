import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms of using Geriacare — a respectful community for elder care questions, articles, and conversation.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--color-line-40)] bg-[var(--color-surface)] p-5 space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="-my-10">
      <section className="fullbleed theme-golden min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <div className="space-y-10">
            <section>
              <h1 className="text-3xl font-semibold tracking-tight">Terms of Use</h1>
              <p className="mt-3 max-w-xl text-[var(--color-muted)]">
                By using Geriacare, you agree to these terms. Please read them —
                they&apos;re short and written in plain language.
              </p>
            </section>

            <Section title="It&apos;s a community">
              <p className="leading-relaxed text-[var(--color-muted)]">
                Geriacare is a space for families, caregivers, and experts to ask
                questions and share what they&apos;ve learned. Posts reflect the
                individual experiences and opinions of their authors — not the
                views of Geriacare.
              </p>
            </Section>

            <Section title="Not medical advice">
              <p className="leading-relaxed text-[var(--color-muted)]">
                Nothing on this site is medical advice, diagnosis, or treatment.
                Always consult a qualified healthcare professional for medical
                concerns. If someone is in immediate danger or a medical
                emergency, call your local emergency number right away.
              </p>
            </Section>

            <Section title="Your posts">
              <p className="leading-relaxed text-[var(--color-muted)]">
                You&apos;re responsible for what you write. Keep conversations
                respectful, kind, and on-topic. Don&apos;t post anything harmful,
                abusive, misleading, or that shares someone&apos;s private details
                without permission. Content that suggests abuse, neglect, or
                self-harm is held for review and may trigger helpline resources.
              </p>
            </Section>

            <Section title="Moderation">
              <p className="leading-relaxed text-[var(--color-muted)]">
                We keep Geriacare safe by reviewing content. We may remove,
                edit, or hide posts that break these terms, and we can suspend
                accounts that repeatedly misuse the community.
              </p>
            </Section>

            <Section title="Accounts">
              <p className="leading-relaxed text-[var(--color-muted)]">
                Signing in is optional and uses Google. You may post without an
                account. If you sign in, you&apos;re responsible for keeping your
                account secure.
              </p>
            </Section>

            <Section title="Your content rights">
              <p className="leading-relaxed text-[var(--color-muted)]">
                You keep ownership of everything you post. By posting, you give
                Geriacare permission to display and share your content on the
                site and in its communications, so the community can benefit
                from it.
              </p>
            </Section>

            <Section title="No warranty, no liability">
              <p className="leading-relaxed text-[var(--color-muted)]">
                We work hard to keep Geriacare helpful and reliable, but we
                can&apos;t guarantee that content is always accurate or that the
                service will never be interrupted. Use the site as-is and rely
                on your own judgment.
              </p>
            </Section>

            <Section title="Questions?">
              <p className="leading-relaxed text-[var(--color-muted)]">
                If something here is unclear, reach us at{" "}
                <a href="mailto:support@geriacare.in" className="text-[var(--color-accent)] hover:underline">
                  support@geriacare.in
                </a>{" "}
                or visit the{" "}
                <Link href="/contact" className="text-[var(--color-accent)] hover:underline">
                  contact page
                </Link>
                .
              </p>
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
}
