export function Byline({
  name,
  role,
  specialization,
  at,
}: {
  name: string | null;
  role?: "family" | "expert" | "moderator" | null;
  specialization?: string | null;
  at: Date;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
      <span className={name ? "font-medium text-[var(--color-ink)]" : "italic"}>
        {name || "Anonymous"}
      </span>
      {role === "expert" && (
        <span className="rounded-full border border-[var(--color-accent)] px-2 py-0.5 text-xs text-[var(--color-accent)]">
          verified expert
        </span>
      )}
      {role === "moderator" && (
        <span className="rounded-full border border-[var(--color-line)] px-2 py-0.5 text-xs">
          moderator
        </span>
      )}
      {specialization && <span className="text-xs italic">{specialization}</span>}
      <span className="text-xs">
        {at.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    </div>
  );
}
