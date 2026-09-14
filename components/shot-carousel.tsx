"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import type { AppCard } from "@/lib/app-store";
import { DUR, EASE_OUT, useReducedMotion } from "@/lib/motion";
import { dragBounds, nearestSnap, projectedOffset, snapPoints } from "@/lib/carousel";

const ITEM = 240;
const GAP = 16;

/**
 * The App Store screens, dragged.
 *
 * Every number this makes a decision with comes from lib/carousel.ts, which is
 * tested without a DOM. What is left here is only the wiring: measure the
 * viewport, hand the release velocity to the projection, animate to whatever
 * comes back.
 *
 * Under reduced motion this becomes a plain overflow-x list — still fully
 * usable with a trackpad or a scrollbar, with no drag and no inertia.
 */
export function ShotCarousel({ card }: { card: AppCard }) {
  const viewport = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);

  /* The viewport width is measured, not assumed, and re-measured when it
     changes — the drag bound is a function of it, and a bound computed once at
     mount is wrong the moment the window is resized or the phone is turned.
     A ResizeObserver rather than a window resize listener because this element
     also changes width when the case page's grid reflows at the lg breakpoint,
     which no window event reports. A ResizeObserver in an effect rather than an
     inline ref callback: a ref callback re-fires on every render and never
     re-measures on a later resize, since it is not itself watching anything. */
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const points = snapPoints(card.shots.length, ITEM, GAP);
  const bounds = dragBounds(card.shots.length, ITEM, GAP, width);

  const shots = card.shots.map((src, i) => (
    <div
      key={src}
      className="bg-surface border-border relative shrink-0 overflow-hidden rounded-xl border"
      style={{ width: ITEM, aspectRatio: card.shotRatio }}
    >
      <Image
        src={src}
        alt={`${card.name}, screen ${i + 1}`}
        fill
        sizes="240px"
        className="object-cover"
        /* The first screen of the first card is the largest thing above the
           fold on a case page. */
        priority={i === 0}
      />
    </div>
  ));

  if (reduced) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ gap: GAP }}>
        {shots}
      </div>
    );
  }

  return (
    <div ref={viewport} className="overflow-hidden">
      <motion.div
        drag="x"
        style={{ x, gap: GAP }}
        className="flex cursor-grab active:cursor-grabbing"
        dragConstraints={bounds}
        dragElastic={0.08}
        /* motion's own inertia would keep animating `x` after release using
           its own physics, racing the explicit snap animation started below.
           The snap target already accounts for release velocity (via
           projectedOffset), so motion's momentum is redundant at best and, at
           worst, both animations write to `x` in the same frame and visibly
           fight. Turning it off leaves exactly one animation owning the value
           after a drag ends. */
        dragMomentum={false}
        onDragEnd={(_, info) => {
          const target = nearestSnap(projectedOffset(x.get(), info.velocity.x), points);
          animate(x, Math.max(bounds.left, Math.min(bounds.right, target)), {
            duration: DUR.base,
            ease: EASE_OUT,
          });
        }}
      >
        {shots}
      </motion.div>
    </div>
  );
}
