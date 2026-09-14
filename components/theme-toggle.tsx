"use client";

import { useTheme } from "next-themes";
import { useMounted } from "@/lib/use-mounted";
import { DUR, EASE_OUT } from "@/lib/motion";

/* This TypeScript's lib.dom already types document.startViewTransition (it
   ships the View Transitions API as always-present), so no ambient
   declaration is needed here. The runtime guard below is still required —
   Safari and Firefox at the time of writing have no such method regardless of
   what the types claim — so it is read through a loosely-typed lookup rather
   than called as if TypeScript's non-optional signature were a guarantee. */

/**
 * A circular reveal from the toggle itself, where the browser supports it.
 *
 * View Transitions animate the whole document between two paints, which is the
 * only way to cross-fade a theme without every element animating its own
 * colour and half of them arriving out of step. Where the API is missing the
 * theme simply changes — an un-animated correct result, never a JS fallback
 * reimplementing the same effect worse.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const run = () => setTheme(next);
    if (!document.startViewTransition) return run();

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
    <button
      type="button"
      onClick={toggle}
      className="label cursor-pointer transition-colors hover:text-text-1"
      /* Before hydration the resolved theme is unknown, so the label names the
         dark switch rather than flickering to the other word a frame later. */
      aria-label={mounted ? `Switch to ${next} theme` : "Switch to dark theme"}
    >
      {mounted ? next : "dark"}
    </button>
  );
}
