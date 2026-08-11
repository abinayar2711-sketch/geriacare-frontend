import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Reveal from "../../components/Reveal";

export const metadata: Metadata = {
  title: { absolute: "Geriacare — The Next Approach" },
  description:
    "Welcome to a cozy corner of care conversations — ask freely, learn kindly, and share the journey of care, together.",
};

/* ------------------------------------------------------------------ *
 * Elder care SVG props — line icons set adrift in the hero
 * ------------------------------------------------------------------ */

const iconBase = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Stethoscope({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" {...iconBase} aria-hidden>
      <path d="M16 8v16a6 6 0 0 0 12 0V8" />
      <circle cx="22" cy="30" r="3" fill="currentColor" fillOpacity={0.2} />
      <path d="M10 8h6M28 8h6" />
      <circle cx="10" cy="8" r="2" />
      <circle cx="34" cy="8" r="2" />
    </svg>
  );
}

function Heart({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" {...iconBase} aria-hidden>
      <path
        d="M22 38s-14-8.4-14-18.6A7.4 7.4 0 0 1 15.4 12 7.4 7.4 0 0 1 22 15.2 7.4 7.4 0 0 1 28.6 12 7.4 7.4 0 0 1 36 19.4C36 29.6 22 38 22 38Z"
        fill="currentColor"
        fillOpacity={0.18}
      />
    </svg>
  );
}

function Pill({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" {...iconBase} aria-hidden>
      <rect x="14" y="6" width="16" height="32" rx="8" transform="rotate(-30 22 22)" fill="currentColor" fillOpacity={0.15} />
      <line x1="12" y1="22" x2="32" y2="22" transform="rotate(-30 22 22)" />
    </svg>
  );
}

function WalkingCane({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" {...iconBase} aria-hidden>
      <path d="M28 6 C28 6 26 10 26 14 L26 34" />
      <path d="M26 34 Q26 38 22 38 Q18 38 18 34" />
      <path d="M28 6 Q34 6 34 12 Q34 16 28 16" />
    </svg>
  );
}

function ReadingGlasses({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" {...iconBase} aria-hidden>
      <circle cx="14" cy="24" r="7" />
      <circle cx="30" cy="24" r="7" />
      <path d="M21 23c1.6-1.4 4.4-1.4 6 0" />
      <path d="M7 21l-3-8M37 21l3-8" />
    </svg>
  );
}

function Wheelchair({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" {...iconBase} aria-hidden>
      <circle cx="20" cy="28" r="9" />
      <circle cx="20" cy="28" r="2" />
      <path d="M15 13h6l1 9h7l-3 8" />
      <circle cx="21" cy="9" r="2.5" />
      <path d="M28 22h5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Portrait — a warm, dignified elder
 * ------------------------------------------------------------------ */
function Portrait({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label="An illustrated portrait of a warm, distinguished elder"
    >
      <defs>
        <clipPath id="pClip">
          <circle cx="160" cy="160" r="146" />
        </clipPath>
      </defs>
      {/* outer ring */}
      <circle cx="160" cy="160" r="154" fill="none" stroke="#d4a853" strokeWidth="1.5" opacity="0.3" />
      <circle cx="160" cy="160" r="150" fill="none" stroke="#d4a853" strokeWidth="2" opacity="0.6" />
      {/* bg fill */}
      <circle cx="160" cy="160" r="146" fill="#2a1520" stroke="#d4a853" strokeWidth="2.5" />
      <g clipPath="url(#pClip)">
        <circle cx="160" cy="120" r="150" fill="#351e28" />
        {/* shoulders */}
        <path d="M58 320 C58 256 112 230 160 230 C208 230 262 256 262 320 Z" fill="#3d2430" />
        <path d="M160 234 L132 302 M160 234 L188 302" fill="none" stroke="#2a1520" strokeWidth="2.5" />
        {/* collar */}
        <path d="M146 234 L160 264 L174 234 Z" fill="#c9a87a" />
        {/* neck */}
        <path d="M143 194 h34 v24 q-17 12 -34 0 Z" fill="#deb89a" />
        {/* silver hair */}
        <path
          d="M98 158 C98 100 130 70 160 70 C190 70 222 100 222 158 C222 132 206 118 186 114 C170 111 150 111 134 114 C114 118 98 132 98 158 Z"
          fill="#e0dcd0"
        />
        <path d="M160 74 v18" stroke="#ccc6b4" strokeWidth="2" opacity="0.5" />
        {/* face */}
        <ellipse cx="160" cy="150" rx="54" ry="62" fill="#e5c4a0" />
        <ellipse cx="107" cy="152" rx="10" ry="14" fill="#e5c4a0" />
        <ellipse cx="213" cy="152" rx="10" ry="14" fill="#e5c4a0" />
        {/* cheeks */}
        <ellipse cx="128" cy="170" rx="12" ry="8" fill="#d4917a" opacity="0.3" />
        <ellipse cx="192" cy="170" rx="12" ry="8" fill="#d4917a" opacity="0.3" />
        {/* brows */}
        <path d="M122 132 q14 -7 28 0 M170 132 q14 -7 28 0" fill="none" stroke="#b0a898" strokeWidth="2.5" strokeLinecap="round" />
        {/* eyes */}
        <path d="M127 151 q9 7 18 0 M175 151 q9 7 18 0" fill="none" stroke="#5b4a38" strokeWidth="2.5" strokeLinecap="round" />
        {/* glasses */}
        <g fill="none" stroke="#d4a853" strokeWidth="2.5">
          <rect x="118" y="140" width="34" height="26" rx="10" />
          <rect x="168" y="140" width="34" height="26" rx="10" />
          <path d="M152 150 h16" />
          <path d="M118 147 l-14 -2 M202 147 l14 -2" />
        </g>
        {/* nose */}
        <path d="M160 155 v14 q-6 4 -11 0" fill="none" stroke="#c99e75" strokeWidth="2.5" strokeLinecap="round" />
        {/* smile */}
        <path d="M138 187 q22 20 44 0" fill="none" stroke="#a05a3c" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Helix watermark — mobile hero background
 * ------------------------------------------------------------------ */
function HelixWatermark() {
  const rungs = 24;
  return (
    <div className="helix-watermark md:hidden" aria-hidden>
      <div className="helix-strand">
        {Array.from({ length: rungs }, (_, i) => (
          <div
            key={i}
            className="helix-rung"
            style={{ ["--i" as string]: i, ["--n" as string]: rungs } as CSSProperties}
          >
            <span className="helix-dot helix-dot--a" />
            <span className="helix-dot helix-dot--b" />
          </div>
        ))}
      </div>
      <div className="helix-ball" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Floating props — elder care icons adrift in the hero
 * ------------------------------------------------------------------ */
type Float = {
  el: ReactNode;
  style: CSSProperties;
};

const floats: Float[] = [
  {
    el: <Stethoscope size={72} />,
    style: { top: "12%", left: "3%", color: "#d4a853", opacity: 0.4, "--dur": "17s", "--rise": "28px", "--rot0": "-8deg", "--rot1": "4deg" } as CSSProperties,
  },
  {
    el: <WalkingCane size={60} />,
    style: { top: "40%", left: "1%", color: "#d4a853", opacity: 0.32, "--dur": "21s", "--delay": "-7s", "--rise": "24px", "--rot0": "6deg", "--rot1": "-4deg" } as CSSProperties,
  },
  {
    el: <Wheelchair size={80} />,
    style: { top: "62%", left: "5%", color: "#b8c4a8", opacity: 0.3, "--dur": "23s", "--delay": "-4s", "--rise": "30px", "--rot0": "5deg", "--rot1": "-5deg" } as CSSProperties,
  },
  {
    el: <Heart size={60} />,
    style: { top: "15%", right: "3%", color: "#d4917a", opacity: 0.55, "--dur": "16s", "--delay": "-2s", "--rise": "20px", "--rot0": "-5deg", "--rot1": "7deg" } as CSSProperties,
  },
  {
    el: <Pill size={56} />,
    style: { top: "44%", right: "3%", color: "#e8d5c0", opacity: 0.7, "--dur": "20s", "--delay": "-5s", "--rise": "26px", "--rot0": "7deg", "--rot1": "-5deg" } as CSSProperties,
  },
  {
    el: <ReadingGlasses size={54} />,
    style: { top: "68%", right: "5%", color: "#f0e8dc", opacity: 0.65, "--dur": "24s", "--delay": "-11s", "--rise": "32px", "--rot0": "4deg", "--rot1": "-7deg" } as CSSProperties,
  },
];

const mobileFloats: Float[] = [
  {
    el: <Stethoscope size={44} />,
    style: { top: "5%", left: "2%", color: "#d4a853", opacity: 0.35, "--dur": "18s", "--rise": "18px", "--rot0": "-6deg", "--rot1": "5deg" } as CSSProperties,
  },
  {
    el: <Heart size={42} />,
    style: { top: "5%", right: "2%", color: "#d4917a", opacity: 0.5, "--dur": "16s", "--delay": "-3s", "--rise": "16px", "--rot0": "5deg", "--rot1": "-6deg" } as CSSProperties,
  },
  {
    el: <ReadingGlasses size={44} />,
    style: { top: "22%", left: "0%", color: "#d4a853", opacity: 0.35, "--dur": "20s", "--delay": "-4s", "--rise": "20px", "--rot0": "-8deg", "--rot1": "4deg" } as CSSProperties,
  },
  {
    el: <Pill size={40} />,
    style: { top: "24%", right: "0%", color: "#e8d5c0", opacity: 0.6, "--dur": "22s", "--delay": "-6s", "--rise": "18px", "--rot0": "-5deg", "--rot1": "6deg" } as CSSProperties,
  },
];

/* ------------------------------------------------------------------ *
 * Expert heroes for the marquee
 * ------------------------------------------------------------------ */
const experts = [
  { initials: "R", name: "Dr. Rajashekaran", role: "Pain Management, Trivandrum" },
  { initials: "PJ", name: "Dr. Pranav Jain", role: "M.B.B.S, MD" },
  { initials: "S", name: "Srinivasan", role: "Technical Advisor" },
  { initials: "GV", name: "George Varghese", role: "Business Strategist, Geriacare" },
  { initials: "PG", name: "Prakash George", role: "Physiotherapist" },
];

export default function Landing() {
  return (
    <div data-landing className="-my-10">
      {/* ---------------------------------------------------------------- *
       * Hero — deep burgundy gradient, gold accents, portrait, props adrift
       * ---------------------------------------------------------------- */}
      <section
        className="fullbleed relative flex min-h-[30rem] items-center overflow-hidden md:min-h-[46rem]"
        style={{
          background:
            "radial-gradient(70rem 38rem at 50% -8%, #3a2030 0%, rgba(58,32,48,0) 62%)," +
            "linear-gradient(168deg, #1e0e18 0%, #2a1520 46%, #1a1512 100%)",
        }}
      >
        <div className="prop-field hidden md:block" aria-hidden>
          {floats.map((f, i) => (
            <div key={i} className="prop-float" style={f.style}>
              {f.el}
            </div>
          ))}
        </div>
        <div className="prop-field md:hidden" aria-hidden>
          {mobileFloats.map((f, i) => (
            <div key={i} className="prop-float" style={f.style}>
              {f.el}
            </div>
          ))}
        </div>
        <HelixWatermark />

        <div className="relative mx-auto grid w-full max-w-2xl grid-cols-1 items-center gap-8 px-5 py-12 md:grid-cols-[1fr_14rem] md:gap-12 md:py-24">
          <Reveal className="order-2 text-center md:order-1 md:text-left">
            <p className="text-[0.7rem] uppercase tracking-[0.35em] text-[#d4a853]">
              Care Begins with the Right Mindset
            </p>
            <h1 className="mt-5 text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl md:text-7xl">
              <span className="text-[#d4a853]">GERIA</span><span className="text-[#f4ecdb]">CARE</span>
            </h1>
            <p className="tagline-float mt-6 max-w-md text-lg leading-relaxed text-[#c8b89f]">
              Real Questions <span className="mx-2 opacity-40">.</span> Gentle Guidance<br />
              We've been there <span className="mx-2 opacity-40">.</span> We're here to help
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 text-sm md:flex-row md:justify-start md:items-center">
              <Link
                href="/ask"
                className="hero-cta cta-pulse rounded-full bg-[#d4a853] px-6 py-3 sm:px-8 sm:py-4 font-medium text-[#1e0e18] shadow-[0_8px_28px_rgba(212,168,83,0.28)] transition hover:bg-[#e0bc6a] focus-visible:shadow-[0_0_0_4px_rgba(212,168,83,0.18)]"
              >
                Ask a question
              </Link>
              <Link
                href="/feed"
                className="rounded-full other bg-[rgba(212,168,83,0.06)] border border-[rgba(212,168,83,0.16)] px-6 py-3 sm:px-8 sm:py-4 text-[#d4a853] transition hover:bg-[rgba(212,168,83,0.10)] hover:border-[rgba(212,168,83,0.28)] md:ml-2"
              >
                Explore conversations
              </Link>
            </div>
            <p className="mt-4 text-xs text-[#8a7a6a]">
              No account required.<br />
              Anonymous questions welcome.
            </p>
          </Reveal>

          <div className="order-1 flex justify-center md:order-2 md:justify-end">
            <Reveal className="w-44 sm:w-56 md:w-64">
              <Portrait className="w-full portrait-interact" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
        * Values cards
        * ---------------------------------------------------------------- */}
      <section className="py-24">
        <span aria-hidden className="block h-px w-12 bg-[#d4a853]/40" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[
            { icon: "🌿", title: "Living Well", desc: "Beyond medical care." },
            { icon: "🤝", title: "Non-Clinical Guidance", desc: "Support for everyday living." },
            { icon: "🕊", title: "Human Touch", desc: "Compassionate, gentle approach." },
            { icon: "💛", title: "Thoughtful Insights", desc: "Helping seniors and families make informed decisions." },
          ].map((card) => (
            <div
              key={card.title}
              className="group rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition hover:border-[#d4a853]/40 hover:shadow-[0_4px_20px_rgba(212,168,83,0.06)]"
            >
              <span className="block text-2xl">{card.icon}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                {card.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
       * Expert marquee — dark burgundy band
       * ---------------------------------------------------------------- */}
      <section className="fullbleed border-y border-[#3a2828] bg-[#2a1520] py-16">
        <div className="mx-auto mb-10 max-w-3xl px-5">
          <p className="text-[0.7rem] uppercase tracking-[0.35em] text-[#d4a853]">
            In good hands
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#f4ecdb]">
            A Diverse Community of Experts
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#a89888]">
            Bringing together healthcare professionals, caregivers, researchers, entrepreneurs, community leaders and people with lived experience.
          </p>
        </div>

        <div className="marquee">
          <div className="marquee__track">
            {[...experts, ...experts].map((h, i) => (
              <figure
                key={i}
                className="flex w-52 shrink-0 flex-col items-center rounded-xl border border-[#4a2838] bg-[#351e28] px-5 py-7 text-center"
              >
                <figcaption>
                  <span className="block text-sm font-medium text-[#f4ecdb]">
                    {h.name}
                  </span>
                  <span className="mt-1 block text-[0.7rem] leading-relaxed text-[#a89888]">
                    {h.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- *
       * Closing CTA — dark card, floating prop
       * ---------------------------------------------------------------- */}
      <section className="py-20">
        <div className="relative overflow-hidden rounded-2xl border border-[#4a2838] bg-[#2a1520] p-8 sm:p-12">
          <div className="prop-field opacity-60" aria-hidden>
            <div
              className="prop-float text-[#d4a853]"
              style={{ top: "-8%", right: "5%", opacity: 0.22, "--dur": "18s", "--rise": "18px" } as CSSProperties}
            >
              <Stethoscope size={110} />
            </div>
          </div>
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight text-[#f4ecdb]">
              Ask the community.
            </h2>
            <p className="mt-3 max-w-lg text-[#a89888]">
              Where experience meets compassion, every conversation has a human touch.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm">
              <Link
                href="/ask"
                className="rounded-full bg-[#d4a853] px-6 py-3 font-medium text-[#1e0e18] transition hover:bg-[#e0bc6a]"
              >
                Ask a question
              </Link>
              <Link
                href="/signin"
                className="nav-pill ml-2 rounded-full bg-[rgba(212,168,83,0.08)] px-3 py-1 text-xs font-semibold text-[#f4ecdb] transition hover:bg-[rgba(212,168,83,0.12)]"
              >
                Expert / moderator sign-in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
