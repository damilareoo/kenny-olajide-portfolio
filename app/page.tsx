import { FooterLine } from "@/components/footer-line";
import { GlyphIcon } from "@/components/glyph-icon";
import { GlyphText } from "@/components/glyph-text";
import { Product } from "@/components/product";
import { SiteNav } from "@/components/site-nav";
import { readAppStore } from "@/lib/app-store";
import { workAssets } from "@/data/assets.generated";
import { site } from "@/data/site";
import { work } from "@/data/work";

/**
 * The home is the work.
 *
 * A masthead, then the products, numbered. Three things left this page and
 * each was cut for the same reason: it said something the page did not need to
 * say. The record sentence set the company marks inline where the names would
 * be — handsome in the source, where three logos carry three different titles,
 * and on a two-product site it was two logo tiles interrupting one line to
 * name the two products printed directly beneath it. The location line was one
 * word floating in its own column. And the prose that followed said in three
 * clauses what one now says.
 *
 * What is left is a name, a claim, a line of standing, and the work.
 */
export default async function Home() {
  /* One read of the App Store for the whole document, six hours old at most.
     Both products are iOS apps and open on their listing's card; `readAppStore`
     returns a card for each whatever Apple says, so there is no failure path to
     branch on here. Awaited at the top of the page rather than fetched per
     product because `Product` is a client component. */
  const apps = await readAppStore();

  /* Padded the way each product numbers itself, so the count and the ordinals
     below it read as one system. Derived, so a third piece changes it. */
  const featuredCount = String(work.length).padStart(2, "0");

  return (
    <main className="mx-auto w-full max-w-[1240px] px-5 py-4 sm:px-6">
      <SiteNav current="/" />

      {/* The masthead. Name and role on one baseline, the contact opposite
          them, a rule under the pair — the same three-part row the section
          headings on /shots draw, so the page opens in the language it
          continues in rather than in a hero that appears once.

          `short:` trims the vertical spend: a landscape phone has 540px of
          glass and the masthead is the only thing between the nav and the
          first product. */}
      <header className="mt-10 short:mt-4">
        <div className="rule-b flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-3">
          <h1 className="text-xl font-bold tracking-tight">&rsquo;{site.name}</h1>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-ink-3 transition-colors hover:text-ink"
          >
            {site.email}
            <GlyphIcon name="arrow-out" size="0.4375rem" />
          </a>
        </div>

        {/* The claim, then the standing. `text-lg` against `text-base` keeps
            the two in a visible order on the six-step scale — set at one step
            they read as a paragraph that happens to break. */}
        <p className="mt-6 max-w-[34ch] text-lg font-medium leading-snug tracking-tight text-ink">
          I design chess software.
        </p>
        <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-ink-2">
          Five years teaching chess, two editing it, then designing it.
        </p>
      </header>

      {/* Sits on the rule the first product draws, so it reads as a caption on
          that boundary rather than a heading stacked above one. The count is
          spoken for a screen reader and drawn in the matrix's own numerals for
          everyone else — the split each product's number makes. */}
      <div className="mt-14 flex items-baseline justify-between gap-x-4 pb-2 text-sm text-ink-2 short:mt-8">
        <span>Featured work</span>
        <span className="flex items-baseline gap-1.5">
          <span className="sr-only">{featuredCount}</span>
          <GlyphText text={featuredCount} size="0.5rem" className="text-ink-3" aria-hidden />
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

      <footer className="mt-20 pb-8">
        <FooterLine />
      </footer>
    </main>
  );
}
