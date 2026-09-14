"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { DUR, EASE_OUT, useReducedMotion } from "@/lib/motion";

/**
 * The case page's half of the WorkCard shared-element pair.
 *
 * `components/work-card.tsx` hands its icon and title `layoutId`s of the form
 * `icon-${slug}` and `title-${slug}`, and withholds them under reduced
 * motion. This is the other half: it must use the exact same id strings and
 * withhold on the exact same condition, or motion sees an unmatched id on
 * whichever side still hands one over and that side animates alone — worse
 * than no transition at all.
 *
 * The case page itself is a server component (it awaits `params` and
 * `readAppStore()`), and `useReducedMotion()` cannot run there — so this
 * header lockup is its own small client component rather than living inline
 * on the page.
 */
export function CaseHeader({
  slug,
  icon,
  title,
  summary,
}: {
  slug: string;
  icon: string;
  title: string;
  summary: string;
}) {
  const reduced = useReducedMotion();
  const layout = (name: string) => (reduced ? undefined : `${name}-${slug}`);

  return (
    <header className="flex items-center gap-5 py-16">
      <motion.div layoutId={layout("icon")} transition={{ duration: DUR.base, ease: EASE_OUT }}>
        <Image
          src={icon}
          alt=""
          width={72}
          height={72}
          className="border-border rounded-2xl border"
        />
      </motion.div>
      <div>
        <motion.h1
          layoutId={layout("title")}
          transition={{ duration: DUR.base, ease: EASE_OUT }}
          className="text-text-1 text-[length:var(--text-xl)] font-medium tracking-[var(--tracking-tight)]"
        >
          {title}
        </motion.h1>
        <p className="text-text-2 mt-2 text-[length:var(--text-base)]">{summary}</p>
      </div>
    </header>
  );
}
