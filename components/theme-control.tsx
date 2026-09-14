"use client";

import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { DUR, EASE_OUT, useReducedMotion } from "@/lib/motion";
import { useMounted } from "@/lib/use-mounted";

/* This TypeScript's lib.dom already types document.startViewTransition (it
   ships the View Transitions API as always-present), so no ambient
   declaration is needed here. The runtime guard below is still required —
   Safari and Firefox at the time of writing have no such method regardless of
   what the types claim — so it is read through a loosely-typed lookup rather
   than called as if TypeScript's non-optional signature were a guarantee. */

/* System is a real state, not the absence of a choice. A visitor who has
   never picked should be able to see that the site is following their OS
   rather than guess from which half of a toggle looks active. */
const MODES = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
] as const;

type Mode = (typeof MODES)[number]["value"];

/**
 * Each state's glyph, drawn in `currentColor` so it inherits the segment's
 * own text colour rather than carrying one of its own — active and inactive
 * segments already differ by colour (`text-text-1` vs `text-text-3`), and the
 * glyph should track that, not fight it.
 *
 * Inline SVG, not an icon font and not emoji: the Inter-only rule is about
 * typefaces, and none of these shapes are text. `aria-hidden` on all three —
 * the button's own label already names the state, so the glyph is decoration
 * that would otherwise be read twice by a screen reader.
 *
 * - Light: a filled disc with short rays — a plain sun.
 * - System: a circle split vertically, the left half filled — "follows your
 *   OS" drawn literally, since System is a real state and not an absence.
 * - Dark: a crescent, cut from a filled circle by masking out an offset
 *   circle rather than freehanding an arc path.
 */
function Glyph({ mode }: { mode: Mode }) {
  if (mode === "light") {
    return (
      <svg
        viewBox="0 0 12 12"
        width="12"
        height="12"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      >
        <circle cx="6" cy="6" r="2.25" fill="currentColor" stroke="none" />
        <line x1="6" y1="0.75" x2="6" y2="1.75" />
        <line x1="6" y1="10.25" x2="6" y2="11.25" />
        <line x1="0.75" y1="6" x2="1.75" y2="6" />
        <line x1="10.25" y1="6" x2="11.25" y2="6" />
        <line x1="2.4" y1="2.4" x2="3.1" y2="3.1" />
        <line x1="8.9" y1="8.9" x2="9.6" y2="9.6" />
        <line x1="8.9" y1="3.1" x2="9.6" y2="2.4" />
        <line x1="2.4" y1="9.6" x2="3.1" y2="8.9" />
      </svg>
    );
  }
  if (mode === "system") {
    return (
      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
        <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M6 1.5a4.5 4.5 0 0 0 0 9Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
      <mask id="theme-glyph-dark-mask">
        <rect width="12" height="12" fill="white" />
        <circle cx="7.5" cy="4.5" r="4" fill="black" />
      </mask>
      <circle cx="6" cy="6" r="4.5" fill="currentColor" mask="url(#theme-glyph-dark-mask)" />
    </svg>
  );
}

/**
 * A three-state segmented control — Light / System / Dark — replacing the
 * old two-way text toggle.
 *
 * The thumb slides between segments on `layoutId`, the same mechanism as the
 * nav pill (components/nav.tsx), at `DUR.base` on `EASE_OUT`.
 *
 * The circular View Transitions reveal, previously theme-toggle.tsx's whole
 * reason to exist, lives here now. It fires on a change of *resolved* theme
 * rather than of the raw click: picking "System" while the OS is already
 * light does not change what is on screen, and animating a reveal over no
 * visual change would be a circle drawn over nothing. What the OS is
 * currently doing is read from `systemTheme`, so the control can tell, before
 * calling `setTheme`, whether the pick actually changes the painted theme.
 */
export function ThemeControl() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const mounted = useMounted();
  const reduced = useReducedMotion();
  // Before hydration the stored choice is unknown; "system" is the default and
  // the honest thing to show rather than flickering to another segment.
  const active = mounted ? (theme ?? "system") : "system";

  function select(mode: Mode, event: React.MouseEvent<HTMLButtonElement>) {
    const run = () => setTheme(mode);
    const nextResolved = mode === "system" ? systemTheme : mode;

    /* Three ways out, and all three end at the finished theme.

       The reduced-motion check has to live HERE rather than in CSS. The
       globals.css block collapses CSS-declared animations, and this is a
       script-created Element.animate() on a ::view-transition pseudo-element —
       a bare `*` selector reaches neither. A visitor who asked for less motion
       would have got the full circle-expand anyway, which is the exact
       failure that block was written to prevent. */
    if (reduced || !document.startViewTransition || nextResolved === resolvedTheme) return run();

    const { top, left, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    document.startViewTransition(run).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          /* DUR.base and EASE_OUT, in the units the Web Animations API
             wants — milliseconds and a cubic-bezier() string — rather than a
             second, hand-rolled copy of the same numbers. */
          duration: DUR.base * 1000,
          easing: `cubic-bezier(${EASE_OUT.join(",")})`,
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  return (
    <div role="radiogroup" aria-label="Colour theme" className="bg-chip relative flex rounded-full p-0.5">
      {MODES.map((m) => {
        const on = active === m.value;
        return (
          <button
            key={m.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={(event) => select(m.value, event)}
            className={`relative z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[length:var(--text-2xs)] uppercase tracking-[var(--tracking-label)] transition-colors ${
              on ? "text-text-1" : "text-text-3 hover:text-text-2"
            }`}
          >
            {on && (
              <motion.span
                /* Withheld under reduced motion for the same reason every
                   layoutId on this site is: the id IS the animation. */
                layoutId={reduced ? undefined : "theme-thumb"}
                className="bg-surface absolute inset-0 -z-10 rounded-full"
                transition={{ duration: DUR.base, ease: EASE_OUT }}
              />
            )}
            <Glyph mode={m.value} />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
