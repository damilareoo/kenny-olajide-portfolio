"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE_OUT, STAGGER, useReducedMotion } from "@/lib/motion";

/**
 * One block arriving.
 *
 * This is a `motion` (Web Animations API) animation, not a CSS transition, so
 * the reduced-motion block in globals.css cannot reach it — it would still
 * play the full opacity/translate move for a visitor who asked for less
 * motion. useReducedMotion() is checked here instead, and under reduced
 * motion this returns the final frame with no `motion.div` and no transition
 * at all — not the same move played quickly. Someone who asked for less
 * motion asked for the end state.
 */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: DUR.staged, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Type arriving line by line from behind its own edge.
 *
 * Each line needs its own `overflow-hidden` frame — one frame around the
 * whole block would clip the stack rather than each line, and the lines
 * would slide as one object instead of arriving in sequence. `STAGGER`
 * (60ms, from lib/motion.ts) between lines is enough to read as sequence and
 * short enough that the last line is not still waiting when the eye has
 * moved on.
 *
 * Same JS-animation caveat as `Reveal`: globals.css cannot reach this, so
 * useReducedMotion() gates it directly. Under reduced motion every line still
 * renders inside its frame (the clipping wrapper itself has no motion, so it
 * costs nothing to keep), but the inner `motion.span` is swapped for a plain
 * `span` sitting at its resting position — no animation runs.
 */
export function RevealLines({ lines, className = "" }: { lines: string[]; className?: string }) {
  const reduced = useReducedMotion();

  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          {reduced ? (
            <span className="block">{line}</span>
          ) : (
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: DUR.staged, ease: EASE_OUT, delay: i * STAGGER }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  );
}
