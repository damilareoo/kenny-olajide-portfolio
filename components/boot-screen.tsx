"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "motion/react";
import { DUR, EASE_OUT, useReducedMotion } from "@/lib/motion";
import { useMounted } from "@/lib/use-mounted";
import { site } from "@/data/site";

/** One spelling, exported so the test and the component cannot drift. */
export const BOOT_KEY = "ko:booted";

/**
 * The entrance, once per session.
 *
 * Once per *session* rather than once per load: replaying a 1.2s screen on
 * every internal navigation would turn the site's best moment into its most
 * annoying one. sessionStorage rather than localStorage so a visitor returning
 * tomorrow sees it again.
 *
 * It carries no information — the name behind it is already in the DOM — so it
 * is aria-hidden and never traps focus.
 *
 * Reduced motion is checked here, not left to globals.css: the count and the
 * exit are both driven by `motion` (the Web Animations API under the hood),
 * and the CSS block only reaches CSS-declared animations. A visitor who asked
 * for less motion gets the session marked seen and nothing rendered at all —
 * the final frame (the screen gone) rather than a faster boot.
 */
export function BootScreen() {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const [done, setDone] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(BOOT_KEY) === "1";
  });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(2, "0"));

  /* `skip` folds `done` (already seen this session, from the state
     initializer above) and `reduced` (asked for less motion, so it never
     plays at all) into one gate. Deriving it here rather than calling
     `setDone(true)` synchronously inside the effect for the `reduced` case
     avoids a same-tick setState-in-effect — the effect only writes to
     sessionStorage (an external system) up front, and only calls `setDone`
     later, from inside the timer callback, once the count has actually
     finished. */
  const skip = done || reduced;

  useEffect(() => {
    if (skip) {
      sessionStorage.setItem(BOOT_KEY, "1");
      return;
    }
    const controls = animate(count, 100, { duration: DUR.entrance, ease: EASE_OUT });
    const timer = setTimeout(
      () => {
        sessionStorage.setItem(BOOT_KEY, "1");
        setDone(true);
      },
      DUR.entrance * 1000 + 200,
    );
    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, [count, skip]);

  if (!mounted || skip) return null;

  return (
    <AnimatePresence>
      <motion.div
        data-testid="boot"
        aria-hidden="true"
        className="bg-bg fixed inset-0 z-50 flex items-end justify-between px-6 py-5"
        exit={{ y: "-100%" }}
        transition={{ duration: DUR.base, ease: EASE_OUT }}
      >
        <span className="text-text-1 text-[length:var(--text-xl)] font-medium tracking-[var(--tracking-tight)]">
          {site.name}
        </span>
        {/* tnum is already on at html level, so this figure does not reflow as
            it counts. */}
        <motion.span className="text-text-3 text-[length:var(--text-sm)]">{rounded}</motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
