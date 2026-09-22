"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GlyphIcon } from "@/components/glyph-icon";
import type { BareShot } from "@/components/bare-shots";

/**
 * A row of screens that scrolls, with no plate around it.
 *
 * The App Store card's rail without the card: edge-aware arrow buttons,
 * keyboard arrows / Home / End on a single tab stop, smooth scroll unless
 * the visitor asked for less motion. Nothing advances on its own.
 *
 * Each screen keeps its own aspect — a UI crop reads as a design decision —
 * and the row is sized by height (`min(26rem, 46svh)`) so tall phone screens
 * and wide plates share one line without either being cut.
 */
export function ScreenRail({
  shots,
  title,
  ratio = "9 / 19.5",
}: {
  shots: BareShot[];
  /** Whose screens these are — feeds the rail's label and every alt. */
  title: string;
  /** Slot ratio when a file carries no dimensions. */
  ratio?: string;
}) {
  const rail = useRef<HTMLUListElement>(null);
  /* Which end of the rail is showing. Server-rendered as "at the start and
     not at the end", which is where an unscrolled rail actually is, so the
     first paint and the first measurement agree. */
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    /* A pixel of slack at each end — sub-pixel layout rarely lands exactly
       on 0 or the maximum. */
    setEdge({
      start: el.scrollLeft <= 1,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const step = useCallback((direction: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    const by = first ? first.getBoundingClientRect().width + gap : el.clientWidth;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * by, behavior: still ? "auto" : "smooth" });
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const el = rail.current;
    if (!el) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      el.scrollTo({ left: 0 });
    } else if (event.key === "End") {
      event.preventDefault();
      el.scrollTo({ left: el.scrollWidth });
    }
  };

  if (shots.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center justify-end gap-2">
        <RailButton label="Previous screens" icon="arrow-left" disabled={edge.start} onClick={() => step(-1)} />
        <RailButton label="Next screens" icon="arrow-right" disabled={edge.end} onClick={() => step(1)} />
      </div>
      <ul
        ref={rail}
        tabIndex={0}
        role="group"
        aria-label={`${title} — screens`}
        onScroll={measure}
        onKeyDown={onKeyDown}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto"
      >
        {shots.map((shot, i) => {
          const aspect =
            shot.width && shot.height ? `${shot.width} / ${shot.height}` : ratio;
          return (
            <li key={shot.src} className="shrink-0 snap-start">
              <div
                style={{ aspectRatio: aspect, height: "min(26rem, 46svh)" }}
                className="frame-zoom relative overflow-hidden rounded-[var(--radius-tile)]"
              >
                <Image
                  src={shot.src}
                  alt={`${title}, screen ${i + 1} of ${shots.length}`}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * One end of the rail's control pair.
 *
 * A bounded hairline square holding a glyph, at a touch size — the shape the
 * unfold settled on for "the part you press". Only the border and the opacity
 * move; nothing lifts and nothing shadows.
 */
function RailButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: "arrow-left" | "arrow-right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="pressable flex size-7 items-center justify-center rounded-[4px] border border-line text-ink hover:border-ink-3 disabled:opacity-40 disabled:hover:border-line"
    >
      <GlyphIcon name={icon} size="0.75rem" />
    </button>
  );
}
