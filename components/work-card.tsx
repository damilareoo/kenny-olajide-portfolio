"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { AppCard } from "@/lib/app-store";
import type { WorkItem } from "@/data/work";
import { DUR, EASE_OUT } from "@/lib/motion";
import { Label } from "./ui";

/**
 * A selected piece on the home.
 *
 * The icon and the title carry `layoutId`s that the case page reuses, so
 * navigation moves these two elements into the case header rather than
 * cross-fading two pages that happen to contain similar things.
 */
export function WorkCard({ item, card }: { item: WorkItem; card: AppCard }) {
  return (
    <Link href={`/work/${item.slug}`} className="group block">
      <article className="border-border bg-surface rounded-2xl border p-6 transition-colors duration-[var(--dur-micro)] hover:border-text-4">
        <header className="flex items-center gap-4">
          <motion.div layoutId={`icon-${item.slug}`} transition={{ duration: DUR.base, ease: EASE_OUT }}>
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
              layoutId={`title-${item.slug}`}
              transition={{ duration: DUR.base, ease: EASE_OUT }}
              className="text-text-1 text-[length:var(--text-lg)] font-medium tracking-[var(--tracking-tight)]"
            >
              {item.title}
            </motion.h2>
            <div className="mt-1 flex gap-3">
              <Label>{item.year}</Label>
              <Label>{item.role}</Label>
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
            rendering eight images. */}
        <div className="fan mt-6 flex gap-3">
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
