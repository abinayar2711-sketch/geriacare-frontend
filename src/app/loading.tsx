export default function RootLoading() {
  return (
    <div className="-my-10">
      <section className="fullbleed theme-golden min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-3xl animate-pulse px-5 py-16">
          <div className="flex flex-col items-center justify-center py-24">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--color-accent)]"
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
        </div>
      </section>
    </div>
  );
}
