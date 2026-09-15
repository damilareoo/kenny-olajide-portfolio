import Link from "next/link";

/**
 * Three routes, not four. `/colophon` is cut by instruction — see §1 of
 * docs/superpowers/specs/2026-09-15-v3-design-language-switch.md — and the row
 * is the list of surfaces that exist, so it loses the chip with the page.
 */
const SURFACES = [
  { href: "/", label: "Home" },
  { href: "/shots", label: "Shots" },
  { href: "/about", label: "About" },
] as const;

/**
 * Filled chips rather than outlined ones: the inactive surfaces read as raised
 * keys and the current one as the key held down. An outline would make the nav
 * a diagram of itself, which is the thing the reference does not do.
 *
 * The row is the one place on the site that cannot be allowed to set its own
 * width. Four labels plus three theme buttons came to 312px inside a 280px
 * column at 320px wide, and because the chip row could neither wrap nor shrink
 * the theme control was simply pushed 12px past the viewport — every route
 * scrolled sideways on the narrowest phone, from this row alone. So the chips
 * wrap: the keys reflow onto a second line rather than pushing the row past the
 * edge. The tighter phone spacing below keeps that second line from being
 * needed, but the wrap is what makes the row safe at any text size.
 *
 * The theme control that used to sit at the right of this row is not here.
 * `components/theme-control.tsx` is on the owner's do-not-copy list for the v3
 * port, so the site follows the operating system's skin and offers no switch.
 * If that turns out to be a miscut, the control goes back in the `shrink-0`
 * slot this docblock used to describe and nothing else about the row changes.
 */
export function SiteNav({ current }: { current?: string }) {
  return (
    <div className="flex items-center justify-between gap-x-2 sm:gap-x-4">
      <nav className="flex min-w-0 flex-wrap items-center gap-x-0.5 gap-y-1 sm:gap-x-1">
        {SURFACES.map((surface) => {
          const active = current === surface.href;
          return (
            <Link
              key={surface.href}
              href={surface.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-[4px] px-1.5 py-1 font-mono text-2xs uppercase tracking-[0.08em] transition-colors sm:px-2 ${
                active
                  ? "bg-strong text-on-strong"
                  : "bg-surface-2 text-ink-2 hover:text-ink"
              }`}
            >
              {surface.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
