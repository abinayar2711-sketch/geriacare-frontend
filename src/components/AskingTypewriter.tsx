"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ *
 * A question finding its words.
 *
 * A question types itself out, stops, deletes back to its opening
 * clause, and then commits to the truer, harder version of itself. The
 * backspace is the whole point: everyone types the safe version first.
 * Anyone who has re-drafted a difficult message recognises that
 * hesitation immediately.
 *
 * It sits above the ask form, where it does real work: the form's advice
 * is "be specific", and this demonstrates the vague-to-specific move
 * rather than describing it — and shows a hesitant carer that the
 * unvarnished version is the one this room wants.
 *
 * `stem` must be a prefix of both `draft` and `final`; it is the point
 * the deletion stops at, so it should end mid-thought — the moment of
 * doubt, not a clean sentence break.
 * ------------------------------------------------------------------ */

type Question = {
  stem: string;
  draft: string;
  final: string;
  meta: string;
};

/* The questions are illustrative. Response times and answerer counts are
   the most load-bearing claims on this page — soften or wire them to real
   data before launch if that matters. */
const QUESTIONS: Question[] = [
  {
    stem: "My mother won't ",
    draft: "My mother won't eat anything.",
    final:
      "My mother won't eat since her dementia worsened — I'm scared she's giving up. What made meals work for your parent?",
    meta: "asked at 10:47pm · answered in 3 hours · by 4 people",
  },
  {
    stem: "My father ",
    draft: "My father needs round-the-clock care at home.",
    final:
      "My father needs help through the night and we can't manage alone at home anymore. How do other families arrange care around the clock?",
    meta: "asked at 1:12am · answered in 45 minutes · by 6 people",
  },
  {
    stem: "My mother ",
    draft: "My mother won't take a bath.",
    final:
      "My mother hasn't bathed in two weeks and fights us when we try to help. What helped with your parents' hygiene?",
    meta: "asked at 9:50pm · answered in 2 hours · by 4 people",
  },
  {
    stem: "How do I ",
    draft: "How do I talk to my mother about her pills?",
    final:
      "How do I tell my mother she must keep taking her pills when she says they make her drowsy and useless?",
    meta: "asked at 11:58pm · answered before morning · by 3 people",
  },
  {
    stem: "My mother ",
    draft: "My mother thinks her caregiver is a threat.",
    final:
      "My mother says her caregiver is trying to harm her and keeps asking her to leave. The caregiver is about to quit. How do we save this arrangement?",
    meta: "asked at 12:40am · answered in 3 hours · by 4 people",
  },
];

type Frame = { text: string; hold: number; committed?: boolean };

/* Uniform keystrokes read as a machine. Letting punctuation land heavily
   and spaces run light is most of what makes it read as a hand. */
function keystroke(ch: string): number {
  if (ch === "." || ch === "?") return 260;
  if (ch === "," || ch === ";") return 170;
  if (ch === " ") return 34;
  return 38;
}

function framesFor(q: Question): Frame[] {
  const frames: Frame[] = [];
  const type = (source: string, from: number) => {
    for (let i = from + 1; i <= source.length; i++) {
      frames.push({ text: source.slice(0, i), hold: keystroke(source[i - 1]) });
    }
  };

  type(q.draft, 0);
  frames.push({ text: q.draft, hold: 950 }); // reading it back

  // Deleting runs faster than typing, the way it actually does.
  for (let i = q.draft.length - 1; i >= q.stem.length; i--) {
    frames.push({ text: q.draft.slice(0, i), hold: 22 });
  }
  frames.push({ text: q.stem, hold: 1250 }); // the hard pause

  type(q.final, q.stem.length);
  frames.push({ text: q.final, hold: 700 });
  frames.push({ text: q.final, hold: 3400, committed: true });

  return frames;
}

export default function AskingTypewriter({ className = "" }: { className?: string }) {
  /* Initial state is the first question already committed, so the server
     render — and anyone without JS — gets a real question rather than an
     empty box, and hydration has something deterministic to match. The
     animation then picks up from that held frame instead of clearing it,
     which is why the cycle starts at question two. */
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(QUESTIONS[0].final);
  const [committed, setCommitted] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    /* On cleanup the pending timer is cleared, so this promise simply never
       settles and the loop below stops where it stands. */
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    (async () => {
      await wait(2600); // let the server-rendered question be read first

      for (let i = 1; !cancelled; i++) {
        const q = QUESTIONS[i % QUESTIONS.length];

        // Fade the old question out rather than backspacing it away — the
        // deletion mid-question has to stay the only one that means anything.
        setClearing(true);
        await wait(520);
        if (cancelled) return;

        setIndex(i % QUESTIONS.length);
        setCommitted(false);
        setText("");
        setClearing(false);

        for (const frame of framesFor(q)) {
          if (cancelled) return;
          setText(frame.text);
          setCommitted(Boolean(frame.committed));
          await wait(frame.hold);
        }
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={`rounded-2xl border border-[var(--color-line-40)] bg-[var(--color-sage-soft)] p-6 shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-sm sm:p-8 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span aria-hidden className="type-live-dot" />
        <span className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--color-muted)]">
          Someone is asking
        </span>
      </div>

      {/* The animation is hidden from assistive tech — text mutating every
          40ms is unusable through a screen reader. The static equivalent
          below carries the same meaning. */}
      <div
        aria-hidden
        className={`mt-5 min-h-[9rem] text-2xl leading-snug text-[var(--color-ink)] transition-opacity duration-500 sm:min-h-[8.5rem] sm:text-[1.75rem] ${
          clearing ? "opacity-0" : "opacity-100"
        }`}
      >
        {text}
        <span className="type-caret" />
      </div>

      {/* Reserved height, so committing an answer never nudges the buttons
          below it down the page. */}
      <div aria-hidden className="mt-5 min-h-[2.25rem]">
        <span
          className={`type-rule block h-px origin-left bg-gradient-to-r from-[var(--color-accent)] to-transparent transition-transform duration-700 ${
            committed && !clearing ? "scale-x-100" : "scale-x-0"
          }`}
        />
        <p
          className={`mt-3 text-xs text-[var(--color-muted)] transition-opacity duration-700 ${
            committed && !clearing ? "opacity-100" : "opacity-0"
          }`}
        >
          {QUESTIONS[index].meta}
        </p>
      </div>

      <p className="sr-only">
        Questions people have asked this room, shown one at a time. For example:
        “{QUESTIONS[0].final}” — {QUESTIONS[0].meta}.
      </p>
    </div>
  );
}
