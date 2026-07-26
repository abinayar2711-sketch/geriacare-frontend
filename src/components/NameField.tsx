"use client";

export function NameField({ defaultValue }: { defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">Your name (optional)</span>
      <input
        name="authorName"
        placeholder="Anonymous"
        maxLength={60}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-3 text-[0.98rem] transition placeholder:text-[var(--color-muted)]/70 focus:border-[var(--color-accent)] focus:outline-none"
      />
    </label>
  );
}
