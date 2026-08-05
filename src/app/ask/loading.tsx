export default function AskLoading() {
  return (
    <div className="-my-10">
      <section className="fullbleed theme-golden min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-2xl animate-pulse space-y-5">
          <div className="flex justify-center py-2">
            <span
              aria-hidden
              className="text-[3.5rem] font-semibold leading-none text-[var(--color-accent)]"
            >
              ?
            </span>
          </div>

          <div>
            <div className="h-3 w-10 rounded bg-[var(--color-line)]" />
            <div className="mt-3 h-8 w-64 rounded bg-[var(--color-line)]" />
            <div className="mt-2 h-4 w-96 rounded bg-[var(--color-line)]" />
          </div>

          <div className="rounded-2xl border border-[var(--color-line-40)] bg-[var(--color-sage-soft)] p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <span className="h-[7px] w-[7px] rounded-full bg-[var(--color-accent)]" />
              <div className="h-3 w-28 rounded bg-[var(--color-line)]" />
            </div>
            <div className="mt-5 space-y-2">
              <div className="h-6 w-full rounded bg-[var(--color-line)]" />
              <div className="h-6 w-3/4 rounded bg-[var(--color-line)]" />
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-[var(--color-line)]" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
