import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { auth, signOut } from "@/auth";
import { HelixRails } from "@/components/HelixRails";

export const metadata: Metadata = {
  title: "Geriacare — Observations and Opinions",
  description:
    "Non-clinical guidance for living well. Connect with caregivers. A gentle approach to ease the living of seniors. Insights that are thoughtfully blended and aligned to work well.",
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
            <Link href="/landing" className="flex flex-col leading-none">
              <span className="brand-oc">
                Geriacare
              </span>
              <span className="mt-0.5 text-[0.55rem] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                The Next Approach
              </span>
            </Link>
            <Link
              href="/feed"
              className="nav-pill"
            >
              Forum
            </Link>
            <Link
              href="/ask"
              className="nav-pill"
            >
              Ask
            </Link>
            <Link
              href="/articles"
              className="nav-pill"
            >
              Articles
            </Link>
            {session?.user?.role === "moderator" && (
              <Link
                href="/caregivers"
                className="nav-pill"
              >
                Caregivers
              </Link>
            )}
            <Link
              href="/about"
              className="nav-pill"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="nav-pill"
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
