import { useMediaQuery } from "./use-media-query";

/**
 * Every duration and curve on this site.
 *
 * The primary curve is not invented. dejiajetomobi.com transitions its nav
 * pill with `width .42s cubic-bezier(.22,.61,.36,1)`, and that number is
 * borrowed intact rather than eyeballed into something close. Everything else
 * is spaced around it.
 *
 * Seconds here because `motion` takes seconds; the same four are mirrored into
 * CSS as milliseconds in app/globals.css, and lib/motion.test.ts holds the two
 * in agreement. A component that needs a timing reaches for one of these —
 * there is no fifth duration and no second curve.
 */
export const EASE_OUT = [0.22, 0.61, 0.36, 1] as const satisfies readonly [number, number, number, number];
export const EASE_INOUT = [0.65, 0, 0.35, 1] as const satisfies readonly [number, number, number, number];

export const DUR = {
  /** Hover, press, focus. Fast enough to read as feedback rather than motion. */
  micro: 0.18,
  /** The default. Deji's nav figure. */
  base: 0.42,
  /** A staged reveal, where the stagger needs room to be legible. */
  staged: 0.72,
  /** Entrance and the boot screen. The only budget this long. */
  entrance: 1.2,
} as const;

/**
 * Whether this visitor has asked for less motion.
 *
 * `false` on the server so the prerendered shell matches the common case, and
 * corrected on hydration before anything has had time to animate. Read through
 * matchMedia rather than an effect, like everything else here.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}
