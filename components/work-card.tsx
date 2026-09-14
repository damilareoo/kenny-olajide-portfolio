"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { AppCard } from "@/lib/app-store";
import type { WorkItem } from "@/data/work";
import { DUR, EASE_OUT, useReducedMotion } from "@/lib/motion";
import { Label } from "./ui";

/**
 * A selected piece on the home.
 *
 * The icon and the title carry `layoutId`s that the case page reuses, so
 * navigation moves these two elements into the case header rather than
 * cross-fading two pages that happen to contain similar things.
 */
export function WorkCard({ item, card }: { item: WorkItem; card: AppCard }) {
  /* Withholding the layoutId is how this honours reduced motion. A `layoutId`
     IS the animation — motion measures the element here and again on the case
     page and interpolates between them — so there is no duration to shorten
     and nothing for the globals.css block to reach. Handing it `undefined`
     means the case page simply renders its header, which is the final frame.
     The case page must withhold its matching id on the same condition, or one
     half of the pair animates alone. */
  const reduced = useReducedMotion();
  const layout = (name: string) => (reduced ? undefined : `${name}-${item.slug}`);

  return (
    <Link href={`/work/${item.slug}`} className="group block">
      <article className="border-border bg-surface rounded-2xl border p-6 transition-colors duration-[var(--dur-micro)] hover:border-text-4">
        <header className="flex items-center gap-4">
          <motion.div layoutId={layout("icon")} transition={{ duration: DUR.base, ease: EASE_OUT }}>
            <Image
              src={card.icon}
              alt=""
              width={56}
              height={56}
              className="border-border rounded-xl border"
            />
          </motion.div>
          <div>
            <motion.h2
              layoutId={layout("title")}
              transition={{ duration: DUR.base, ease: EASE_OUT }}
              className="text-text-1 text-[length:var(--text-lg)] font-medium tracking-[var(--tracking-tight)]"
            >
              {item.title}
            </motion.h2>
            <div className="mt-1 flex gap-3">
              <Label>{item.year}</Label>
              {item.role && <Label>{item.role}</Label>}
            </div>
          </div>
        </header>

        <p className="text-text-2 mt-4 text-[length:var(--text-base)]">{item.summary}</p>

        {/* The screens fan on hover: each leans a little more than the last,
            which reads as a stack being spread rather than four things
            twitching in place.

            Done in CSS off the group's hover rather than with four motion
            components. Four independent springs reacting to the same pointer
            event can desynchronise by a frame or two, which is exactly the
            wobble this effect must not have; one transition on one custom
            property cannot. It also costs no JS on a card that is already
            rendering eight images.

            `-mr-6 lg:-mr-10` pulls the row past the card's own right edge —
            first cancelling the article's p-6 padding, then running on past
            its border — so the composition reads as shots layered over the
            page rather than shots boxed inside a card. The card was never
            given its own overflow-hidden, so nothing has to be removed to let
            this bleed; a page that lays two of these out asymmetrically (see
            app/page.tsx) is what keeps the bleed from causing a horizontal
            scrollbar, not a clip here. */}
        <div className="fan -mr-6 mt-6 flex gap-3 lg:-mr-10">
          {card.shots.slice(0, 4).map((src, i) => (
            <div
              key={src}
              className="border-border relative w-1/4 overflow-hidden rounded-lg border"
              style={{ aspectRatio: card.shotRatio, "--i": i } as React.CSSProperties}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </div>
          ))}
        </div>
      </article>
    </Link>
  );
}
