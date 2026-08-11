import type { Metadata } from "next";
import { Nurse, Doctor, Physiotherapist } from "@/components/Characters";

export const metadata: Metadata = {
  title: "Props",
  description: "Geriacare care team character props — preview only.",
};

const cast = [
  { name: "Nurse", role: "Female nurse in a nurse dress", C: Nurse },
  { name: "Doctor", role: "Male doctor with stethoscope", C: Doctor },
  { name: "Physiotherapist", role: "Male physiotherapist", C: Physiotherapist },
];

export default function PropsPage() {
  return (
    <div className="-my-10">
      <section className="fullbleed theme-golden min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h1 className="text-3xl font-semibold tracking-tight">
            Care Team — Props Preview
          </h1>
          <p className="mt-3 max-w-xl text-[var(--color-muted)]">
            Anime-style characters for future use. Temporary page — it will be
            removed once they find a home.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {cast.map(({ name, role, C }) => (
              <div
                key={name}
                className="rounded-xl border border-[var(--color-line-40)] bg-[var(--color-surface)] p-6 text-center"
              >
                <C size={170} className="mx-auto" />
                <h2 className="mt-4 text-lg font-semibold">{name}</h2>
                <p className="mt-1 text-xs text-[var(--color-muted)]">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
