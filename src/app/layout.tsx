import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { auth, signOut } from "@/auth";
import { HelixRails } from "@/components/HelixRails";

export const metadata: Metadata = {
  title: "Geriacare — Observations and Opinions",
  description:
    "Authentic, non-clinical guidance for living well, every day. Connect with genuine, sincere caregivers, and insights that are thoughtfully blended, merged and aligned to work well.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen">
        <HelixRails />
        <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-[var(--color-paper)]/85 backdrop-blur-sm">
          <nav className="mx-auto flex max-w-3xl items-center gap-5 px-5 py-3.5 text-sm">
            <Link href="/landing" className="text-lg font-semibold tracking-tight">
              Geriacare
            </Link>
            <Link
              href="/feed"
              className="text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
            >
              Forum
            </Link>
            <Link
              href="/ask"
              className="text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
            >
              Ask
            </Link>
            <Link
              href="/articles"
              className="text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
            >
              Articles
            </Link>
            {session?.user?.role === "moderator" && (
              <Link
                href="/caregivers"
                className="text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
              >
                Caregivers
              </Link>
            )}
            <Link
              href="/about"
              className="text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
            >
              Contact
            </Link>
            <div className="ml-auto flex items-center gap-3">
              {session?.user?.role === "moderator" && (
                <Link
                  href="/mod"
                  className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs text-[var(--color-accent)] transition hover:opacity-80"
                >
                  Queue
                </Link>
              )}
              {session?.user ? (
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button className="text-[var(--color-muted)]">
                    Sign out ({session.user.name?.split(" ")[0]})
                  </button>
                </form>
              ) : (
                <Link
                  href="/signin"
                  className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="relative z-10 mx-auto max-w-3xl px-5 py-10">
          {children}
        </main>
        <footer className="relative z-10 mt-16 border-t border-[var(--color-line)] bg-[var(--color-paper)]/80">
          <div className="mx-auto max-w-3xl px-5 py-8 text-xs leading-relaxed text-[var(--color-muted)]">
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
              <Link href="/about" className="hover:text-[var(--color-ink)]">
                About
              </Link>
              <Link href="/caregivers" className="hover:text-[var(--color-ink)]">
                Caregivers
              </Link>
              <Link href="/contact" className="hover:text-[var(--color-ink)]">
                Contact
              </Link>
              <Link href="/articles" className="hover:text-[var(--color-ink)]">
                Articles
              </Link>
              <Link href="/feed" className="hover:text-[var(--color-ink)]">
                Forum
              </Link>
            </div>
            The information shared here is not medical advice, diagnosis, or
            treatment. Always consult a qualified healthcare professional for
            medical concerns.
          </div>
        </footer>
      </body>
    </html>
  );
}
