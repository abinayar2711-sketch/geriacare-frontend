/**
 * Two DNA rails pinned to the page margins, each with a ball falling through
 * it — the strand reconfiguring as the ball passes.
 *
 * Pure CSS: every rung carries its index as a custom property, and the
 * stylesheet turns that index into two delays — one that sets the helix pitch,
 * one that fires the flash exactly when the ball arrives. No JS, no client
 * component, no scroll listeners.
 *
 * Purely decorative, so `aria-hidden` and `pointer-events: none`. It hides
 * itself under 1200px and for anyone who asked for reduced motion.
 */

const RUNGS = 30;

/** Slightly different periods per rail so the two never lock into step. */
const RAILS = [
  { side: "left", spin: "7.5s", drop: "19s" },
  { side: "right", spin: "8.6s", drop: "23s" },
] as const;

export function HelixRails() {
  return (
    <>
      {RAILS.map(({ side, spin, drop }) => (
        <div
          key={side}
          aria-hidden="true"
          className={`helix-rail helix-rail--${side}`}
          style={{ ["--spin" as string]: spin, ["--drop" as string]: drop }}
        >
          <div className="helix-strand">
            {Array.from({ length: RUNGS }, (_, i) => (
              <div
                key={i}
                className="helix-rung"
                style={{ ["--i" as string]: i, ["--n" as string]: RUNGS }}
              >
                <span className="helix-dot helix-dot--a" />
                <span className="helix-dot helix-dot--b" />
              </div>
            ))}
          </div>
          <div className="helix-ball" />
        </div>
      ))}
    </>
  );
}
