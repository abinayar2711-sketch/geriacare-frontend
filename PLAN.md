# Geriacare - Project Recovery Plan

## What We Built So Far
Full Next.js Q&A platform for geriatric care (Reddit-like) at `/home/abinaya/vime/gcare/gcare/`
- Tech: Next.js 15 + Drizzle ORM + Neon PostgreSQL + Tailwind CSS v4 + NextAuth (Google OAuth)
- Adapted from `/home/abinaya/Transfer/Workspace/saturdayHustle/sangha` (spiritual Q&A forum)
- DB shares sangha's Neon PostgreSQL — both schemas coexist

### Completed Pages & Features
- `/` — Combined landing + feed (hero, stats, featured questions/articles, "How It Works", latest feed)
- `/ask` — Structured question form (patientAge, gender, condition, medications, city, urgency, careSetting, relation)
- `/post/[id]` — Thread view with patient info + answers + comments + endorsements + crisis detection
- `/articles` — Expert articles listing
- `/about` — Mission, team, guidelines, medical disclaimer
- `/caregivers` — Searchable caregiver listings with city/spec filters
- `/contact` — Feedback form, WhatsApp link, medical disclaimer
- `/mod` — Moderator panel (review queue, flagged posts, users, feedback messages, caregiver management)
- `/held` — Crisis post held page
- `/signin` — Google sign-in
- Loading skeleton on home page for instant perceived load
- 12 DB tables (10 original + caregivers + feedback), 18 geriatric care tags seeded, sample data seeded
- Server actions: createQuestion, createArticle, createAnswer, createComment, toggleVote, endorse, flagPost, moderate, setRole, submitFeedback, createCaregiver, updateCaregiver, deleteCaregiver
- Crisis detection with 12 elder care patterns + Indian helplines

### Performance Fix Applied
- ISR with `revalidate = 30` on home page (page regenerates every 30s, not on every request)
- Parallelized all home page queries (Promise.all for posts, counts, tags)
- Added `idle_timeout: 20` and `connect_timeout: 10` to postgres connection
- Loading skeleton (`src/app/loading.tsx`) for instant page render while DB responds

## What's Been Done
- [x] Fix the Performance Issue — ISR + loading skeleton
- [x] Landing Page Redesign — hero, stats bar, featured questions, featured articles, "How It Works"
- [x] Build `/about` page — mission, guidelines, medical disclaimer
- [x] Build `/caregivers` page — searchable listings with filters + DB table
- [x] Build `/contact` page — feedback form + WhatsApp link + DB table
- [x] Admin caregiver management in `/mod` — add/remove caregivers, view feedback
- [x] Nav updated with new links, footer updated with links

## What Needs To Be Done Next

### 1. Run Migration (HIGH PRIORITY)
Migration script is ready but needs DB credentials:
```bash
npx tsx scripts/migrate.ts
```
This creates:
- `caregiver` table
- `feedback` table
- Seeds 4 sample caregivers

### 2. Polish & Future Enhancements
- `/caregivers` page could benefit from pagination if listings grow
- Contact page WhatsApp number needs updating (currently placeholder: 919999999999)
- Consider adding email notifications for feedback submissions
- Consider adding search to the home feed
- Consider adding user profiles at `/profile/[id]`

## Full Route Map (current)
```
/               → Combined landing + feed (redesigned with ISR + loading skeleton)
/ask            → Ask question (structured form)
/post/[id]      → Thread view
/articles       → Expert articles
/about          → About page (mission, guidelines, disclaimer)
/caregivers     → Searchable caregiver listings (with filters)
/contact        → Contact / feedback (form + WhatsApp)
/mod            → Moderator panel (review, users, feedback, caregivers)
/signin         → Google sign-in
/held           → Crisis post held page
```

## Key Files
- `src/db/schema.ts` — Drizzle schema (12 tables)
- `src/lib/actions.ts` — all server actions
- `src/lib/crisis.ts` — elder care crisis detection
- `src/lib/tags.ts` — 18 geriatric care tag definitions
- `src/lib/ui.ts` — shared Tailwind class strings
- `src/auth.ts` — NextAuth config
- `src/db/index.ts` — DB connection (idle_timeout, connect_timeout)
- `src/app/page.tsx` — home feed (ISR, parallelized queries, landing redesign)
- `src/app/loading.tsx` — loading skeleton
- `src/app/globals.css` — warm & caring theme
- `src/app/mod/page.tsx` — moderator dashboard (with caregiver mgmt)
- `scripts/migrate.ts` — DB migration script
- `.env` — Neon DB + auth secrets

## Commands
- Dev server: `setsid bash -c 'cd /home/abinaya/vime/gcare/gcare && npx next dev -p 3000 > /tmp/nextdev.log 2>&1' &`
- Build check: `npx next build` (passing)
- Seed: `npx tsx scripts/seed.ts`
- Migrate: `npx tsx scripts/migrate.ts`

## Dev Server Note
- `setsid` needed to keep `next dev` alive (bash tool kills background processes on timeout)
- Server runs on `http://localhost:3000`
- SWC version mismatch warning (15.5.21 vs 15.5.22) is harmless
