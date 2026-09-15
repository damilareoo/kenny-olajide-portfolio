"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { DUR, EASE_INOUT, HOLD, useReducedMotion } from "@/lib/motion";
import { useMounted } from "@/lib/use-mounted";
import { site } from "@/data/site";

/**
 * How long the confirmation stands before the address comes back.
 *
 * `HOLD` is the site's rest beat — the pause the boot screen takes at 100
 * before it leaves. Four of them is long enough to read "Copied" without
 * having to hurry, and short enough that the button is an address again
 * before anyone thinks to click it twice. A bare `800` here would be a
 * timing decision buried in a component, which is the one thing the token
 * set exists to stop.
 */
export const REVERT_AFTER = HOLD * 4;

/**
 * The address, copyable in place.
 *
 * **It is never a dead button.** `navigator.clipboard` is absent on the
 * server, absent without JavaScript, and absent in any browser serving this
 * page over plain HTTP — so the element that renders first, and the element
 * that remains anywhere the API is missing, is a plain `mailto:` anchor. The
 * button is the enhancement, not the baseline: `useMounted` is false on the
 * server and through hydration, so the anchor is what is in the HTML and what
 * a visitor with no JS keeps.
 *
 * The site footer's `Elsewhere` list still carries a `mailto:` entry, so
 * swapping the headline address for a copy control takes nothing away from a
 * visitor who wants their mail client rather than their clipboard.
 *
 * The label swap is keyed rather than cross-faded: a new key remounts the
 * span, so the incoming label fades in from its own `initial` and there is no
 * `AnimatePresence` holding a removed child. `EASE_INOUT`, because the label
 * returns to exactly what it was — the same reason the magnetic release uses
 * it. Under reduced motion the duration is zero: the final frame, instantly,
 * which for a label swap is simply the other label.
 */
export function CopyEmail({ className = "" }: { className?: string }) {
  const mounted = useMounted();
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const canCopy = mounted && typeof navigator !== "undefined" && Boolean(navigator.clipboard);

  if (!canCopy) {
    return (
      <a href={`mailto:${site.email}`} className={`link ${className}`}>
        {site.email}
      </a>
    );
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      /* A clipboard that exists and refuses — permissions, a non-secure
         context, a browser that gates it behind a user gesture it did not
         recognise. The address is still on screen to be selected by hand, so
         the honest response is to not claim a copy that did not happen. */
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), REVERT_AFTER * 1000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`text-left ${className}`}
    >
      <motion.span
        key={copied ? "copied" : "address"}
        className="block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : DUR.micro, ease: EASE_INOUT }}
      >
        {copied ? "Copied" : site.email}
      </motion.span>
    </button>
  );
}
