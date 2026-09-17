import { Fragment } from "react";
import { CompanyMark } from "@/components/company-marks";
import { FooterLine } from "@/components/footer-line";
import { GlyphIcon } from "@/components/glyph-icon";
import { GlyphText } from "@/components/glyph-text";
import { Product } from "@/components/product";
import { SiteNav } from "@/components/site-nav";
import { readAppStore } from "@/lib/app-store";
import { workAssets } from "@/data/assets.generated";
import { site } from "@/data/site";
import { roles } from "@/data/experience";
import { work } from "@/data/work";
import { byRole } from "@/lib/experience";

/**
 * "a" or "an", by the letter the title starts with.
 *
 * Only the first clause of the record takes one, because English drops the
 * article on the second of two titles and repeating it reads as two separate
 * announcements. Which title comes first is `data/experience.ts`'s business, so
 * the article cannot be written into the copy.
 */
const article = (title: string) => (/^[aeiou]/i.test(title) ? "an" : "a");

/**
 * The home is the work.
 *
 * No index and no selected grid: a lockup, a short record, then the products,
 * numbered, in the order `data/work.ts` lists them. Both of Kenny's pieces are
 * iOS apps and open on a card built from their App Store listing rather than on
 * a frame of their own — see `components/app-store-card.tsx`.
 *
 * The one structural departure from the page this was ported from is its
 * footer: the source closes on a wall of live instruments reporting on its
 * owner's day, and those are cut by §1 of the v3 spec. A borrowed pulse is
 * worse than no pulse, so the foot is the one quiet line and nothing else.
 */
export default async function Home() {
  /* One read of the App Store for the whole document, six hours old at most.
     Both products are iOS apps and open on their listing's card; `readAppStore`
     returns a card for each of them whatever Apple says, so there is no failure
     path to branch on here. See `lib/app-store.ts`.

     Awaited at the top of the page rather than fetched per product because
     `Product` is a client component, and because two entries asking the same
     endpoint for the same two rows is one request too many even when Next would
     have deduped it. */
  const apps = await readAppStore();

  /* Padded the same way each product numbers itself, so the count and the
     ordinals below it read as one system rather than two. Derived from the
     array, so a third piece changes the count without anybody editing it. */
  const featuredCount = String(work.length).padStart(2, "0");

  /* The first run only — the design roles.
     `byRole` gathers runs of one title in the record's own order, and Kenny's
     record has four of them: two product-design roles, then two editing ones,
     then the teaching. Read aloud in full that is a paragraph-long sentence
     which arrives at the work by way of 2017. The full ladder is `/about`'s
     job and it prints there complete; the home says what he does now. */
  const [current] = byRole(roles);

  return (
    <main className="mx-auto w-full max-w-[1240px] px-5 py-4 sm:px-6">
      <SiteNav current="/" />

      {/* One band, not a section, and one voice. The record is a sentence and
          the company marks stand inside it where the names would be, so the
          roles are carried by the grammar rather than by a column. Derived from
          `data/experience.ts`, not written out: the article, the lower case and
          the commas are chosen here, because a verb tense is not data and
          neither is a comma.

          Two columns on `short-wide` and one stack everywhere else. Height is
          the scarce axis on a landscape phone, so the copy and the contact
          stand side by side there rather than spending 400px of screen in
          sequence. */}
      <header className="mt-10 pb-8 short:mt-4 short:pb-4">
        <div className="grid min-w-0 gap-x-10 short-wide:grid-cols-[minmax(0,1fr)_auto] short-wide:items-start">
          <div className="min-w-0">
            {/* The name leads, bold, because it is the one fact a visitor
                should leave with even if they read nothing else. */}
            <h1 className="text-xl font-bold tracking-tight">&rsquo;{site.name}</h1>
            {/* The claim. `text-lg` sits between the bold name and the
                `text-base` paragraph beneath it on the six-step scale, so all
                three keep a visible order rather than the middle line reading
                as a peer of either neighbour. */}
            <p className="mt-2 max-w-[46ch] text-lg font-medium leading-snug tracking-tight text-ink">
              I design chess software &mdash; the screens where a game becomes
              something you can read.
            </p>
            {/* The leading is set for the marks rather than for the type.

                A wordmark tile is 1.9em, because that is what puts a logo's cap
                on the cap height of the words around it, and an inline box that
                tall makes its own line box taller than the strut whatever the
                line-height says. Left at `leading-relaxed` the lines holding a
                mark would stand 1.9em apart and the lines without one 1.63em,
                so the paragraph would breathe unevenly for a reason nobody
                could see. 2.2 is the tile plus a little air on each side,
                applied to every line, so the block is even and the marks sit in
                it rather than on it. */}
            <p className="mt-4 max-w-[46ch] text-base leading-[2.2] text-ink-2">
              Most recently {article(current.role)} {current.role.toLowerCase()} at{" "}
              {current.companies.map((role, n) => (
                <Fragment key={role.company}>
                  {n > 0 && (n === current.companies.length - 1 ? " and " : ", ")}
                  {/* `align-middle` centres the mark on the line's own x-height,
                      which is where a word would sit. The group is opened here
                      because the hoverable thing is the link, not the artwork
                      inside it. */}
                  <a
                    href={role.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={role.company}
                    className="group inline-flex items-center align-middle"
                  >
                    <CompanyMark role={role} />
                  </a>
                </Fragment>
              ))}
              .
            </p>
            {/* The fact that makes him credible on this work, and the only
                thing on the home page that reaches back past the design roles.
                Every clause of it is a row in `data/experience.ts`. */}
            <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-ink-2">
              Before that, five years teaching chess and two editing it &mdash;
              Chessable, then Forward Chess. I came to the products from the
              board, not the other way round.
            </p>
          </div>
          <div className="mt-6 min-w-0 short-wide:mt-0">
            {/* One useful fact, and the only place the home says where he is. */}
            <p className="text-sm text-ink-3">{site.location}</p>
            {/* Filled, mono, uppercase, tracked: the nav's active chip at CTA
                scale rather than a new control inventing its own language.
                `min-h` clears the touch floor; opacity is the only thing that
                moves, and only under a pointer or a press. */}
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-flex min-h-[2.75rem] items-center gap-2 rounded-[4px] bg-strong px-5 font-mono text-xs uppercase tracking-[0.08em] text-on-strong transition-opacity hover:opacity-90 active:opacity-80"
            >
              Get in touch
              <GlyphIcon name="arrow-out" size="0.5rem" />
            </a>
          </div>
        </div>
      </header>

      {/* Sits directly on the rule the first product already draws, so the
          label reads as a caption on that boundary rather than a fourth heading
          stacked above the two below it. The count is spoken as text for a
          screen reader and drawn as the matrix's own numerals for everyone
          else, the same split each product's own number makes. */}
      <div className="flex items-baseline justify-between gap-x-4 pb-2 text-sm text-ink-2">
        <span>Featured work</span>
        <span className="flex items-baseline gap-1.5">
          <span className="sr-only">{featuredCount}</span>
          <GlyphText text={featuredCount} size="0.5rem" className="text-ink-3" />
        </span>
      </div>

      <div className="space-y-20">
        {work.map((item, i) => (
          <Product
            key={item.slug}
            item={item}
            assets={workAssets[item.slug] ?? []}
            index={i}
            app={apps[item.slug]}
          />
        ))}
      </div>

      <footer className="mt-8 pb-8">
        <FooterLine />
      </footer>
    </main>
  );
}
