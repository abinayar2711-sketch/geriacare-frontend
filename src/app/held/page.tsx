import { CrisisBanner } from "@/components/CrisisBanner";

export default function HeldPage() {
  return (
    <div className="max-w-lg space-y-6">
      <CrisisBanner />
      <div>
        <h1 className="text-2xl font-semibold">Post held for review</h1>
        <p className="mt-3 text-[var(--color-muted)]">
          Your post mentioned a situation that our team wants to review before
          publishing. This is to make sure everyone gets the right support.
        </p>
        <p className="mt-3 text-[var(--color-muted)]">
          A moderator will review it shortly. In the meantime, if you or someone
          you know needs immediate help, please reach out to the helplines above.
        </p>
      </div>
      <a
        href="/"
        className="inline-block rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
      >
        Back to home
      </a>
    </div>
  );
}
