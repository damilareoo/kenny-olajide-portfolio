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

  /* The one place a snap target is turned into motion. Both the drag-end
     handler and the keyboard path funnel through this, so there is exactly
     one clamp and one animation call for the whole component rather than two
     copies that could drift apart. */
  const goTo = (target: number) =>
    animate(x, Math.max(bounds.left, Math.min(bounds.right, target)), {
      duration: DUR.base,
      ease: EASE_OUT,
    });

  /* Reused by both the arrow buttons and Left/Right on the keyboard: the
     current position is snapped to the nearest point first (a drag may have
     left `x` between two of them), then moved one point over. Home/End skip
     straight to either end rather than stepping through every point. */
  const step = (direction: 1 | -1) => {
    const here = points.indexOf(nearestSnap(x.get(), points));
    const to = direction === 1 ? Math.min(here + 1, points.length - 1) : Math.max(here - 1, 0);
    goTo(points[to]);
  };

  return (
    <div>
      <div ref={viewport} className="overflow-hidden">
        <motion.div
          drag="x"
          style={{ x, gap: GAP }}
          className="flex cursor-grab active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-1"
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
            goTo(nearestSnap(projectedOffset(x.get(), info.velocity.x), points));
          }}
          /* The keyboard path the pointer-only drag never had. Every decision
             still comes from lib/carousel.ts — this is the same arithmetic
             the drag uses (points, bounds), reached a second way. */
          tabIndex={0}
          role="group"
          aria-label={`${card.name} screenshots, ${card.shots.length} of them. Use the left and right arrow keys.`}
          onKeyDown={(e) => {
            const to =
              e.key === "ArrowRight" ? "next"
              : e.key === "ArrowLeft" ? "prev"
              : e.key === "Home" ? "home"
              : e.key === "End" ? "end"
              : null;
            if (to === null) return;
            e.preventDefault();
            if (to === "home") goTo(points[0]);
            else if (to === "end") goTo(points[points.length - 1]);
            else step(to === "next" ? 1 : -1);
          }}
        >
          {shots}
        </motion.div>
      </div>

      {/* Visible previous/next for pointer users who never think to drag.
          Not rendered under reduced motion — that branch above is a plain
          native scroller and needs no buttons of its own. */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={`Previous ${card.name} screenshot`}
          className="border-border text-text-2 hover:text-text-1 hover:border-text-4 flex size-9 items-center justify-center rounded-full border transition-colors"
        >
          <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 2.5 3 6l4.5 3.5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={`Next ${card.name} screenshot`}
          className="border-border text-text-2 hover:text-text-1 hover:border-text-4 flex size-9 items-center justify-center rounded-full border transition-colors"
        >
          <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 2.5 9 6l-4.5 3.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
