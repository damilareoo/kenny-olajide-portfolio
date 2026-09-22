"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GlyphText } from "@/components/glyph-text";
import { site } from "@/data/site";

/**
 * The whole navigation: a wordmark, a Menu control, and a fullscreen menu.
 *
 * Seyi-style — one mark that opens the site, rather than a bar of
 * destinations. The header is identical on every route: the name on the
 * left, one control on the right. Everything else — the three routes, the
 * way out by mail — lives in the overlay.
 *
 * Motion is CSS only (interruptible, off the main thread): the overlay fades
 * while the links rise in sequence, 60ms apart. The blanket reduced-motion
 * rule collapses both to presence. Esc closes; focus rides in to the close
 * control and back out to the Menu button, and the body stops scrolling
 * while the menu owns the screen.
 */
const ROUTES = [
  { href: "/", label: "Home" },
  { href: "/shots", label: "Shots" },
  { href: "/about", label: "About" },
] as const;

export function SiteNav({ current }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  /* Esc closes, unless the keystroke belongs to a field. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  /* The menu owns the screen while it stands: no scroll beneath it, focus
     inside it, and focus handed back to the control that opened it. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    /* Copied out: by cleanup time the ref may point elsewhere. */
    const opener = menuButton.current;
    return () => {
      document.body.style.overflow = previous;
      opener?.focus();
    };
  }, [open ]);

  return (
    <>
      <div className="sticky top-0 z-40 -mx-5 bg-bg px-5 py-3 sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-x-3">
          <Link
            href="/"
            aria-label="Kenny Olajide — home"
            {...(current === "/" ? { "aria-current": "page" } : {})}
            className="pressable text-base font-bold tracking-tight text-ink"
          >
            {site.name}
          </Link>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="pressable inline-flex items-center gap-2 rounded-[4px] px-1.5 py-1 font-mono text-2xs uppercase tracking-[0.08em] text-ink-2 hover:text-ink"
          >
            Menu
            <Plus />
          </button>
        </div>
      </div>

      {/* Kept mounted while closing so the fade has something to leave with;
          hidden from everyone once shut. */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-open={open || undefined}
        aria-hidden={!open}
        className={`menu-overlay fixed inset-0 z-50 flex flex-col bg-bg ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col px-5 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-x-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              tabIndex={open ? undefined : -1}
              className="pressable text-base font-bold tracking-tight text-ink"
              aria-label="Kenny Olajide — home"
            >
              {site.name}
            </Link>
            <button
              ref={closeButton}
              type="button"
              onClick={() => setOpen(false)}
              tabIndex={open ? undefined : -1}
              aria-label="Close menu"
              className="pressable inline-flex items-center gap-2 rounded-[4px] px-1.5 py-1 font-mono text-2xs uppercase tracking-[0.08em] text-ink-2 hover:text-ink"
            >
              Close
              <Plus open />
            </button>
          </div>

          <nav
            aria-label="Menu"
            className="flex flex-1 flex-col justify-center gap-2 py-10"
          >
            {ROUTES.map((route, i) => {
              const active = current === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? undefined : -1}
                  aria-current={active ? "page" : undefined}
                  style={{ transitionDelay: `${i * 60}ms` } as React.CSSProperties}
                  className="menu-item group flex items-baseline gap-4 py-2"
                >
                  <span className="sr-only">{route.label}</span>
                  <GlyphText
                    text={String(i + 1).padStart(2, "0")}
                    size="0.625rem"
                    className="shrink-0 text-ink-3"
                    aria-hidden
                  />
                  <span
                    aria-hidden
                    className={`text-xl font-medium tracking-tight transition-colors ${
                      active ? "text-ink" : "text-ink-2 group-hover:text-ink"
                    }`}
                  >
                    {route.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div
            style={{ transitionDelay: `${ROUTES.length * 60}ms` } as React.CSSProperties}
            className="menu-item flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-8"
          >
            <p className="max-w-[38ch] text-sm leading-relaxed text-ink-2">
              Currently open to full-time roles and collaborations.
            </p>
            <a
              href={`mailto:${site.email}`}
              tabIndex={open ? undefined : -1}
              className="pressable font-mono text-2xs uppercase tracking-wider text-ink-2 underline decoration-line underline-offset-4 hover:text-ink hover:decoration-ink-3"
            >
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * A plus that turns into a close mark.
 *
 * Two hairlines, one rotating 90 degrees — transform only, so the morph is
 * cheap and interruptible. Drawn in currentColor at the text size, so it
 * sits on the baseline of the label it accompanies.
 */
function Plus({ open = false }: { open?: boolean }) {
  return (
    <span aria-hidden className="relative inline-block size-2.5 shrink-0">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
      <span
        className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current transition-transform duration-200 ease-out ${
          open ? "rotate-0" : "rotate-90"
        }`}
      />
    </span>
  );
}
