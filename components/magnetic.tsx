"use client";

import { useRef, type ReactNode } from "react";
import { animate, motion, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import { DUR, EASE_INOUT, useReducedMotion } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * How far the child leans, and how hard.
 *
 * Distances, not timings, so they are literals here rather than tokens —
 * lib/motion.ts owns durations and curves and nothing else. Six pixels is the
 * ceiling because the effect has to read as a lean rather than a move: a nav
 * item that travels further than its own padding stops looking attached to
 * the row it sits in.
 */
export const MAGNET_MAX = 6;
export const MAGNET_STRENGTH = 0.35;

/**
 * The lean, as pure arithmetic: pointer offset from the element's centre,
 * scaled down and clamped.
 *
 * Extracted because it is the only part of a magnet that can be wrong in a way
 * a test can see. jsdom has no layout — every rect it reports is zero — so the
 * component's rendered transform is not something a test can meaningfully
 * assert; the sum that produces it is.
 */
export function magnetOffset(
  rect: { left: number; top: number; width: number; height: number },
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  const clamp = (v: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v));
  return {
    x: clamp((clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH),
    y: clamp((clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH),
  };
}

/**
 * A child that leans toward the pointer and settles back when it leaves.
 *
 * Two gates, and both return the child completely untouched rather than a
 * weaker magnet:
 *
 * - `(hover: hover) and (pointer: fine)`. A magnet needs a pointer that
 *   hovers. On a touch screen there is no hover state to lean into, and the
 *   wrapper would only add a span and a pair of listeners that never fire.
 * - Reduced motion. A visitor who asked for less motion asked for the end
 *   state, and the end state of a magnet is the element where it already was.
 *   Not a shorter lean — no lean.
 *
 * Both are read through `useMediaQuery` (useSyncExternalStore) rather than an
 * effect, so there is no state write after paint. The server snapshot for the
 * pointer query is `false`: the prerendered shell renders the untouched child,
 * which is the correct output for every visitor who is not on a fine pointer
 * and the harmless one for those who are, corrected on hydration before
 * anything can be hovered.
 *
 * The lean itself is set directly from the pointer — it is not an animation,
 * it is the pointer, and easing it would make it lag. The RELEASE is the
 * animation, and it runs on `EASE_INOUT`: this is the site's curve for
 * anything that returns to where it started, so a release that eased out
 * would be a different move than the one that got there.
 *
 * Not wrapped around the nav pill. The pill is a `layoutId` element whose
 * position motion measures against the viewport; translating an ancestor
 * while it is mid-flight would have it projecting from a moving frame. The
 * link inside the pill leans; the pill stays put.
 */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)", false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const release = useRef<AnimationPlaybackControls[]>([]);

  const settle = () => {
    for (const controls of release.current) controls.stop();
    release.current = [];
  };

  if (reduced || !fine) return <>{children}</>;

  return (
    <motion.span
      data-magnetic="true"
      className={className || "inline-block"}
      style={{ x, y }}
      onPointerMove={(event) => {
        settle();
        const offset = magnetOffset(event.currentTarget.getBoundingClientRect(), event.clientX, event.clientY);
        x.set(offset.x);
        y.set(offset.y);
      }}
      onPointerLeave={() => {
        settle();
        const options = { duration: DUR.base, ease: EASE_INOUT } as const;
        release.current = [animate(x, 0, options), animate(y, 0, options)];
      }}
    >
      {children}
    </motion.span>
  );
}
