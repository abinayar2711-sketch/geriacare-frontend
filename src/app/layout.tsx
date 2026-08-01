import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { auth, signOut } from "@/auth";
import { HelixRails } from "@/components/HelixRails";
import SiteNav from "@/components/SiteNav";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://geriacare.in"),
  title: {
    default: "Geriacare — Observations and Opinions",
    template: "%s — Geriacare",
  },
  description:
    "Non-clinical guidance for living well. Connect with caregivers. A gentle approach to ease the living of seniors. Insights that are thoughtfully blended and aligned to work well.",
  applicationName: "Geriacare",
  category: "elder care",
  openGraph: {
    type: "website",
    siteName: "Geriacare",
    title: "Geriacare — Observations and Opinions",
    description:
      "Non-clinical guidance for living well. Connect with caregivers. A gentle approach to ease the living of seniors.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-dvh">
        {gaId && <GoogleAnalytics gaId={gaId} />}
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
