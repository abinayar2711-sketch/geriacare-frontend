export default function AskLoading() {
  return (
    <div className="max-w-2xl animate-pulse space-y-5">
      <div>
        <div className="h-3 w-10 rounded bg-[var(--color-line)]" />
        <div className="mt-3 h-8 w-64 rounded bg-[var(--color-line)]" />
        <div className="mt-2 h-4 w-96 rounded bg-[var(--color-line)]" />
      </div>

      <div className="flex flex-col items-center justify-center py-16">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-accent)] opacity-40"
          aria-hidden
        >
          <circle cx="36" cy="52" r="16" />
          <circle cx="36" cy="52" r="3.5" />
          <path d="M26 24h10l2 16h14l-5 14" />
          <circle cx="38" cy="17" r="4" />
          <path d="M52 44h8" />
          <path d="M28 68a2 2 0 0 1-2-2" />
          <path d="M44 68a2 2 0 0 0 2-2" />
        </svg>
        <p className="mt-4 text-sm text-[var(--color-muted)]">Loading...</p>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-[var(--color-line)]" />
        ))}
      </div>
    </div>
  );
}
