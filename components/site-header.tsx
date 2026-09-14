"use client";

import { useSyncExternalStore } from "react";
import { Nav } from "./nav";
import { useReducedMotion } from "@/lib/motion";

/** Scroll distance, in pixels, past which the header condenses. */
const CONDENSE_AT = 24;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function isCondensed() {
  return window.scrollY > CONDENSE_AT;
}

/**
 * Wraps `<Nav />` in a sticky header that condenses on scroll: full padding
 * at the top of a page, a shorter bar with the wordmark reduced to initials
 * once the page has scrolled past `CONDENSE_AT`. Keeps the nav reachable
 * without spending a sixth of a short screen on it permanently.
 *
 * Scroll position is read through `useSyncExternalStore` rather than a
 * `useState` + scroll-listener `useEffect` — this repo's other browser-state
 * reads (lib/use-mounted.ts, lib/use-media-query.ts) both go through that
 * hook rather than a mounted-flag effect, and a `useState` write on every
 * scroll event is exactly the render-storm that pattern exists to avoid.
 * `getSnapshot` only returns a new value when the boolean actually flips, so
 * React does not re-render on every pixel scrolled. The server snapshot is
 * `false` — full header — matching scroll position 0 on every fresh
 * navigation, so hydration has nothing to correct.
 *
 * At the top of a page the header sits flush against the content — no
 * background, no border — and only gains its backdrop and rule once
 * condensed, so a visit that never scrolls never pays for a bar it does not
 * need. Both that background/border swap and `Nav`'s own padding change are
 * plain CSS transitions, which app/globals.css's reduced-motion block already
 * collapses to 0.01ms — but `useReducedMotion()` is read here regardless, and
 * `Nav` reads it again for its own padding transition, so neither relies on
 * that block alone: no transition classes are emitted at all when motion is
 * reduced, so the condensed state simply renders, statically, with nothing to
 * collapse.
 */
export function SiteHeader() {
  const condensed = useSyncExternalStore(subscribe, isCondensed, () => false);
  const reduced = useReducedMotion();

  return (
    <header
      data-condensed={condensed}
      className={`sticky top-0 z-40 ${
        condensed ? "border-border bg-bg/90 border-b backdrop-blur" : "border-b border-transparent"
      } ${reduced ? "" : "transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]"}`}
    >
      <Nav condensed={condensed} />
    </header>
  );
}
