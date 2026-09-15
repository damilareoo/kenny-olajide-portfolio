import Link from "next/link";
import { GlyphIcon } from "@/components/glyph-icon";
import { site } from "@/data/site";

/**
 * The one quiet line at the foot of the page, written once.
 *
 * In the source it sat beneath the instrument wall. The wall is cut from this
 * port — §1 of the v3 spec: the instruments report on somebody else's life and
 * a borrowed pulse is worse than no pulse — so this is simply the last line on
 * every surface that carries it, and there is one place to change it.
 *
 * What is down here is three links and a way to write.
 *
 * The networks are not here. `elsewhere` in `data/site.ts` is untouched and
 * every entry in it belongs on /about, set as a label and a handle, which is a
 * better answer to "where else is he" than bare words wrapping under a panel.
 * A reader who wants them is one link away and the link is on this line.
 *
 * Two groups rather than one wrapping row, and that is the "more intuitive"
 * half. Left is where you are and where else the site goes; right is how to
 * reach him. A single flex-wrap row put an email address and the page names in
 * one undifferentiated queue, and a queue is what a reader has to parse rather
 * than scan.
 *
 * The version pill is gone with the surface it pointed at. In the source it
 * was the one route to /changelog and it was gated on `lib/site-mode.ts` —
 * shown on the workshop deployment, hidden on the public face. This repo is
 * only ever the public face and has no changelog route, so the gate was always
 * going to resolve to "hidden": the pill, the `changelog` import and the
 * site-mode import all go together rather than a const being kept to
 * permanently answer one way. `lib/site-mode.ts` and `data/changelog.ts` are
 * both on the do-not-copy list for the v3 port.
 *
 * `text-xs` sits a step under the body, so the page is read first and this is
 * what you find when you have finished with it.
 */

/** Everywhere else on the site. /about carries the networks; this carries the site. */
const PAGES = [
  { href: "/shots", label: "Shots" },
  { href: "/about", label: "About" },
] as const;

export function FooterLine() {
  return (
    /* The `rule-t` is the wall's bottom edge — one pixel, drawn once, by
       whichever element is below it.

       `justify-between` with two groups, and both groups wrap on their own. At
       320px the line becomes two rows — the pages, then the contact — which is
       the same two ideas stacked rather than a single queue broken wherever it
       happened to run out of room. */
    <div className="rule-t flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-4 text-xs">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {/* The source prints `site.handle` — a one-word network handle. This
            repo's `data/site.ts` records no handle, and inventing one would be
            inventing a username Kenny may not hold, so the line carries his
            name instead. */}
        <span className="font-medium tracking-tight text-ink">{site.name}</span>
        {PAGES.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="text-ink-2 transition-colors hover:text-ink"
          >
            {page.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <a href={`mailto:${site.email}`} className="text-ink-2 transition-colors hover:text-ink">
          Email{" "}
          <GlyphIcon name="arrow-out" size="0.5rem" className="inline-block align-baseline" />
        </a>
      </div>
    </div>
  );
}
