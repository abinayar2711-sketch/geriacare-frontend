import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { auth, signOut } from "@/auth";
import { HelixRails } from "@/components/HelixRails";
import SiteNav from "@/components/SiteNav";

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
          {/* SiteNav is client-side to get current pathname for active link highlighting */}
          <div>
            {/* @ts-ignore */}
            <SiteNav session={session} />
          </div>
        </header>
        <main className="relative z-10 mx-auto max-w-3xl px-5 py-10">
          {children}
        </main>

        <Link href="/ask" className="fab-ask" aria-label="Ask a question">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden sm:inline">Ask</span>
        </Link>

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
