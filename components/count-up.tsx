"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls } from "motion/react";
import { DUR, EASE_OUT, useReducedMotion } from "@/lib/motion";
import { useMounted } from "@/lib/use-mounted";

/**
 * A whole figure counting up to itself when it enters the viewport.
 *
 * **The server renders the real number.** `useMounted` is false on the server
 * and through hydration, so the HTML says `30`, not `0`. A visitor with no
 * JavaScript — and every crawler — reads the figure rather than a zero that
 * was only ever an animation's first frame. On a site whose whole spec is
 * about not printing numbers it cannot stand behind, shipping `0 ratings` into
 * the static HTML would be the worst kind of decoration.
 *
 * **Reduced motion renders the final frame.** Not a faster count — no count.
 * The value, rendered, with no `motion` element at all. This is checked here
 * rather than left to globals.css because the count is a `motion` animation
 * (the Web Animations API), which that block cannot reach.
 *
 * Nothing reflows as it runs: `tnum` is on at the `html` level (globals.css),
 * so every digit is the same width and a figure passing through 8 is exactly
 * as wide as the 30 it lands on.
 *
 * `data-count-up` carries the settled value on the element in every branch.
 * The rendered text is mid-animation by definition and so is not a thing a
 * test — or a person reading the DOM — can assert against; the number it is
 * travelling to is.
 *
 * The trigger is `onViewportEnter` with `once`, motion's own
 * IntersectionObserver, the same machinery `Reveal` uses rather than a second
 * scroll listener of this component's own.
 */
export function CountUp({ value, className = "" }: { value: number; className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const count = useMotionValue(0);
  const shown = useTransform(count, (v) => String(Math.round(v)));
  const controls = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => () => controls.current?.stop(), []);

  if (reduced || !mounted) {
    return (
      <span data-count-up={value} className={className}>
        {value}
      </span>
    );
  }

  return (
    <motion.span
      data-count-up={value}
      className={className}
      viewport={{ once: true, amount: 0.6 }}
      onViewportEnter={() => {
        controls.current?.stop();
        controls.current = animate(count, value, { duration: DUR.staged, ease: EASE_OUT });
      }}
    >
      {shown}
    </motion.span>
  );
}
