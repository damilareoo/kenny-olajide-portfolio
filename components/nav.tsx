"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { DUR, EASE_OUT, useReducedMotion } from "@/lib/motion";
import { ThemeToggle } from "./theme-toggle";
import { site } from "@/data/site";

const SECTIONS = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
];

/** "Kenny Olajide" -> "KO". The condensed header's wordmark. */
function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

/**
 * The active pill morphs between items rather than fading in under each.
 *
 * `layoutId` is what makes it one object moving: motion measures the pill in
 * its old position and its new one and interpolates, so the width animates
 * along with the position. That is the behaviour borrowed from Deji's nav, on
 * the same curve and the same 420ms. No LayoutGroup or AnimatePresence
 * wrapper is needed — there is exactly one Nav on the page, so there is no
 * layoutId collision to scope, and the pill only ever moves between mounted
 * siblings rather than animating out an unmounted one.
 *
 * Section match is by prefix with a boundary: pathname === href, or pathname
 * starting with `${href}/`. A bare `pathname.startsWith(href)` would also
 * light "Work" for a hypothetical `/workshop` route; the boundary keeps the
 * match to real sub-paths. Home ("/") matches none of the three, which is
 * correct — there is no "Home" item to light.
 *
 * The pill's move is a `motion` layoutId animation — driven by the Web
 * Animations API under the hood, not a CSS transition — so it sits outside
 * the reduced-motion block in globals.css and needs its own guard here. Under
 * reduced motion the transition duration drops to 0, so the pill still marks
 * the active item but jumps to it instantly rather than sliding.
 *
 * `condensed` is `components/site-header.tsx`'s scroll state, threaded
 * through rather than read here a second time — Nav has no opinion of its own
 * on scroll position, only on how to render one. It shrinks the row's padding
 * and swaps the wordmark to initials; the full name is kept as an
 * `aria-label` so the link's accessible name does not shrink along with it.
 */
export function Nav({ condensed = false }: { condensed?: boolean }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <nav
      className={`mx-auto flex w-full max-w-[1240px] items-center justify-between px-6 ${
        reduced ? "" : "transition-[padding] duration-[var(--dur-base)] ease-[var(--ease-out)]"
      } ${condensed ? "py-3" : "py-5"}`}
    >
      <Link
        href="/"
        aria-label={condensed ? site.name : undefined}
        className="text-text-1 text-[length:var(--text-sm)] font-medium"
      >
        {condensed ? initials(site.name) : site.name}
      </Link>

      <ul className="flex items-center gap-1">
        {SECTIONS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="relative">
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="bg-surface-2 absolute inset-0 rounded-full"
                  transition={{ duration: reduced ? 0 : DUR.base, ease: EASE_OUT }}
                />
              )}
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative block rounded-full px-3 py-1.5 text-[length:var(--text-sm)] transition-colors ${
                  active ? "text-text-1" : "text-text-3 hover:text-text-1"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
        <li className="pl-3">
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
