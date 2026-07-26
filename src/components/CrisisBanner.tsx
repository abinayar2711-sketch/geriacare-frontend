import { HELPLINES } from "@/lib/crisis";

export function CrisisBanner() {
  return (
    <div className="mb-6 rounded-lg border-l-[3px] border-amber-600 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-medium">
        This post mentions a crisis situation. If you or someone you know needs
        immediate help, please reach out:
      </p>
      <ul className="mt-2 space-y-1">
        {HELPLINES.map((h) => (
          <li key={h.name}>
            <span className="font-medium">{h.name}</span>: {h.contact}{" "}
            <span className="text-xs text-amber-700">({h.hours})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
