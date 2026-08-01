"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SiteNav({ session }: { session?: any }) {
  const path = usePathname() || "/";

  const links = [
    { href: "/feed", label: "Forum" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 text-sm sm:px-4">
      <Link href="/landing" className="flex flex-col leading-none">
        <span className="brand-oc">Geriacare</span>
        <span className="mt-0.5 hidden text-[0.55rem] uppercase tracking-[0.18em] text-[var(--color-muted)] sm:block">The Next Approach</span>
      </Link>

      <div className="flex flex-wrap items-center gap-x-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-pill ${path.startsWith(l.href) ? "nav-active" : ""}`}
          >
            {l.label}
          </Link>
        ))}
        {session?.user?.role === "moderator" && (
          <Link href="/caregivers" className={`nav-pill ${path.startsWith("/caregivers") ? "nav-active" : ""}`}>Caregivers</Link>
        )}
      </div>

      <Link href="/ask" className="hidden md:inline-block ml-2 rounded-full bg-[var(--color-accent)] px-3 py-1 text-sm font-medium text-[var(--color-paper)] hover:brightness-105 transition">Ask</Link>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {session?.user?.role === "moderator" && (
          <Link href="/mod" className={`rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs text-[var(--color-accent)] transition hover:opacity-80 ${path.startsWith("/mod") ? "nav-active" : ""}`}>Queue</Link>
        )}

        {session?.user ? (
          <Link href="/signout" className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[var(--color-muted)]">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[var(--color-surface)] text-sm font-medium text-[var(--color-ink)]">{session.user.name?.[0] ?? "U"}</span>
            <span className="hidden sm:inline">Sign out</span>
          </Link>
        ) : (
          <Link href="/signin" className={`ml-2 shrink-0 whitespace-nowrap rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-[var(--color-paper)] hover:brightness-95 transition ${path.startsWith("/signin") ? "nav-active" : ""}`}>Sign in</Link>
        )}
      </div>
    </nav>
  );
}
