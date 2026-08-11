import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Geriacare collects, uses, and protects your data — in plain language.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[var(--color-line-40)] bg-[var(--color-surface)] p-5 space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="-my-10">
      <section className="fullbleed theme-golden min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <div className="space-y-10">
            <section>
              <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
              <p className="mt-3 max-w-xl text-[var(--color-muted)]">
                We keep things simple: we collect as little as possible, we
                never sell your data, and you can ask us to delete it anytime.
              </p>
            </section>

            <Section title="What we collect">
              <ul className="list-disc space-y-2 pl-5 leading-relaxed text-[var(--color-muted)]">
                <li>
                  <strong className="text-[var(--color-ink)]">Sign-in details</strong> — your
                  name and email, only if you choose to sign in with Google.
                </li>
                <li>
                  <strong className="text-[var(--color-ink)]">Your posts</strong> — questions,
                  answers, and articles you publish on the community.
                </li>
                <li>
                  <strong className="text-[var(--color-ink)]">Contact messages</strong> — the
                  name, email, and message you send through the contact form.
                </li>
                <li>
                  <strong className="text-[var(--color-ink)]">Anonymous visit stats</strong> —
                  basic analytics (like pages visited) through Google Analytics.
                </li>
              </ul>
            </Section>

            <Section title="How we use it">
              <ul className="list-disc space-y-2 pl-5 leading-relaxed text-[var(--color-muted)]">
                <li>To show your name beside the posts you write.</li>
                <li>To reply to your messages and questions.</li>
                <li>To review and moderate community content.</li>
                <li>To understand how the site is used and improve it.</li>
              </ul>
            </Section>

            <Section title="What we don&apos;t do">
              <p className="leading-relaxed text-[var(--color-muted)]">
                We never sell or rent your personal data to anyone. We don&apos;t
                use it for advertising.
              </p>
            </Section>

            <Section title="Cookies">
              <p className="leading-relaxed text-[var(--color-muted)]">
                We use a small session cookie when you sign in, and Google
                Analytics cookies to understand site usage. Nothing is used to
                track you across other websites.
              </p>
            </Section>

            <Section title="Who we share with">
              <p className="leading-relaxed text-[var(--color-muted)]">
                Only the tools that power the site: Google (for sign-in and
                analytics). The posts you publish on the community are public by
                design — that&apos;s what makes Geriacare helpful to others.
              </p>
            </Section>

            <Section title="Your choices">
              <p className="leading-relaxed text-[var(--color-muted)]">
                You can ask us to delete your account, your posts, or any data
                we hold about you at any time — just contact us and we&apos;ll
                take care of it.
              </p>
            </Section>

            <Section title="Changes">
              <p className="leading-relaxed text-[var(--color-muted)]">
                If we change how we handle data, we&apos;ll update this page and
                note the change here.
              </p>
            </Section>

            <Section title="Contact us">
              <p className="leading-relaxed text-[var(--color-muted)]">
                Questions about privacy? Reach us at{" "}
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
