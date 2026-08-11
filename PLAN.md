# Geriacare — Final Project State

## What We Built
Full Next.js elder care Q&A platform at `/home/abinaya/vime/gcare/gcare/`
- **Live at**: https://geriacare.in (via Vercel)
- **GitHub**: https://github.com/abinayar2711-sketch/geriacare-frontend
- **Tech**: Next.js 15 + Drizzle ORM + Neon PostgreSQL + Tailwind CSS v4 + NextAuth (Google OAuth)
- **Adapted from**: `/home/abinaya/Transfer/Workspace/saturdayHustle/sangha` (spiritual Q&A forum)

## Branding
- **Tagline**: "The Next Approach"
- **Sub-tagline**: "Authentic, non-clinical guidance for living well, every day."
- **Hero headline**: "The Next Approach"
- **Color palette**: Warm burgundy (#2a1520) + sage (#7a9e7e) + gold (#d4a853)
- **Accent**: #7a3b5e (burgundy for buttons, badges across all pages)
- **Contact**: WhatsApp 9446945807, Email support@geriacare.in

## Pages (Route Map)
```
/               → Redirects to /landing
/landing        → Dark hero, DNA helix rails, elder care SVG props, portrait, expert marquee, CTA
/feed           → Forum feed (moved from /)
/ask            → Ask question (structured form + loading skeleton)
/post/[id]      → Thread view with patient info, answers, comments, endorsements
/articles       → Expert articles listing
/about          → Mission, philosophy, community guidelines, medical disclaimer
/caregivers     → Searchable listings with city/spec filters (mod-only access)
/contact        → Feedback form, WhatsApp link, email link, medical disclaimer
/mod            → Moderator dashboard (review queue, flagged posts, users, feedback, caregiver mgmt, article publishing)
/signin         → Google sign-in
/held           → Crisis post held page
/inauguration.html → Ribbon-cutting page → redirects to geriacare.in
```

## Expert Marquee (Landing Page)
- Dr. Rajashekaran — Pain Management, Trivandrum
- Dr. Pranav Jain — M.B.B.S, MD
- Amogh Venkatanarayan — Verified Expert
- Srinivasan — Technical Advisor
- George Varghese — Business Strategist, Geriacare
- Gangaluru — Advisory Board
- Prakash George — Physiotherapist

## DB Schema (12 tables)
`user`, `post`, `tag`, `postTag`, `vote`, `endorsement`, `flag`, `comment` (sangha) + `caregiver`, `feedback` (geriacare)

## Content in DB
### Questions (3)
1. "How this forum works, and what it isn't for" — curated for Geriacare
2. "How to prevent falls for an 85-year-old mother at home?"
3. "Father with dementia refusing to eat — what can we try?"

### Article (1)
- "10 Signs Your Elderly Parent Needs Professional Care" (memory gaps updated: train/plane, familiar places)

### Tags (20 geriacare-relevant)
About this forum, Bathing & Hygiene, Body & health, Caregiver Stress, Communication, Community, Daily Care, Dementia & Memory, Emergency, General Care, Legal & Financial, Medication, Mental Health, Mobility, Nutrition, Pain Management, Post-Surgery, Rehabilitation, Safety, Sleep

## DB Users
- Expert (email: priya@example.com) — name shows as "Expert"
- Rajesh Kumar (email: rajesh@example.com) — family role
- Abinaya Radhakrishnan (abinayar2711@gmail.com) — moderator
- Admin (admin@geriacare.in) — moderator
- Sangha placeholder users (seed-teacher, seed-seeker, seed-host)

## Performance
- ISR with `revalidate = 30` on home page
- Loading skeletons on `/` and `/ask` (wheelchair SVG)
- Parallelized DB queries (Promise.all)
- `idle_timeout: 20`, `connect_timeout: 10` on postgres connection

## Vercel Deployment
- **Framework**: Next.js (set in vercel.json)
- **Env vars needed**: DATABASE_URL, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
- Auto-deploys on push to main

## Key Files
- `src/app/landing/page.tsx` — Landing page (hero, props, marquee, CTA)
- `src/app/globals.css` — Full theme (burgundy/sage palette, .theme-golden, helix CSS, prop-float, marquee)
- `src/components/HelixRails.tsx` — DNA helix rails
- `src/app/layout.tsx` — Root layout (nav, footer, HelixRails)
- `src/app/mod/page.tsx` — Moderator dashboard (article publishing added)
- `src/app/contact/page.tsx` — Contact (WhatsApp + email + form)
- `src/app/about/page.tsx` — About page (philosophy, guidelines)
- `src/app/caregivers/page.tsx` — Caregiver listings (mod-only)
- `src/app/ask/AskForm.tsx` — Ask question form
- `src/app/ask/loading.tsx` — Loading skeleton with wheelchair SVG
- `src/app/loading.tsx` — Global loading skeleton
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth API route
- `src/auth.ts` — NextAuth config (Google provider, DrizzleAdapter)
- `src/db/schema.ts` — Drizzle schema (12 tables)
- `src/lib/actions.ts` — All server actions (14 actions)
- `src/lib/ui.ts` — Shared Tailwind class strings
- `scripts/migrate.ts` — DB migration script
- `scripts/seed.ts` — DB seed script
- `scripts/cleanup.ts` — Cleanup script
- `inauguration.html` — Ribbon-cutting page → redirects to geriacare.in
- `vercel.json` — Vercel config (Next.js framework)
- `.env.example` — Env var template
- `PLAN.md` — This file

## Commands
- Dev server: `setsid bash -c 'cd /home/abinaya/vime/gcare/gcare && npx next dev -p 3000 > /tmp/nextdev.log 2>&1' &`
- Build: `npx next build`
- Seed: `npx tsx --require dotenv/config scripts/seed.ts`
- Migrate: `npx tsx --require dotenv/config scripts/migrate.ts`

## Git
- **Repo**: https://github.com/abinayar2711-sketch/geriacare-frontend
- **User**: Abinaya Radhakrishnan (abinayar2711@gmail.com)
- **Branch**: main
- `.env` is gitignored (secrets protected)
