import type { Metadata } from "next";
import { FooterLine } from "@/components/footer-line";
import { GlyphText } from "@/components/glyph-text";
import { ShotsWall } from "@/components/shots-wall";
import { SiteNav } from "@/components/site-nav";
import { feedAssets } from "@/data/assets.generated";
import { groupShots } from "@/lib/shots";

export const metadata: Metadata = {
  title: "Shots",
  description: "Screens from the two iOS chess products Kenny designed.",
};

/**
 * Twenty-six frames, from two listings and the owner's 2026-09-17 bundle,
 * filed under the product they came from.
 *
 * The frames are real: pulled from the two App Store listings at 1290px, eight
 * from Endgame AI and six from ChessEver. They are the products' own design
 * work, which is what a shots page on a product designer's site should hold and
 * the reason nothing here is captioned as an art direction exercise.
 *
 * Why this is a grouped gallery rather than the source's masonry feed is
 * written where the decision lives — `components/shots-wall.tsx`.
 */
export default function ShotsPage() {
  const { groups, unfiled } = groupShots(feedAssets);
  const total = String(feedAssets.length).padStart(2, "0");

  return (
    <main className="mx-auto w-full max-w-[1320px] px-5 py-4 pb-20 sm:px-6">
      <SiteNav current="/shots" />

      {/* One line of orientation, because a wall of phone screens with no
          preamble does not say whether it is a portfolio, a press kit or a
          gallery. `short:mt-4` for the reason the home's header carries it: a
          landscape phone has no vertical room to spend on a margin. */}
      <header className="mt-10 pb-8 short:mt-4 short:pb-4">
        <h1 className="text-xl font-bold tracking-tight">Shots</h1>
        <p className="mt-2 flex max-w-[52ch] items-baseline gap-2 text-base leading-relaxed text-ink-2">
          <span className="sr-only">{total}</span>
          <GlyphText text={total} size="0.5rem" className="shrink-0 text-ink-3" aria-hidden />
          <span>screens from two iOS chess products.</span>
        </p>
      </header>

      <ShotsWall groups={groups} />

      {/* A frame the manifest found and `groupShots` could not place. It should
          never appear — `lib/shots.test.ts` asserts the committed manifest has
          none — and if it does, it is a file somebody dropped in without the
          naming the join depends on. Saying so on the page beats swallowing it. */}
      {unfiled.length > 0 && (
        <p className="mt-16 font-mono text-2xs uppercase tracking-wider text-ink-3">
          {unfiled.length} frame{unfiled.length === 1 ? "" : "s"} not filed under a
          product
        </p>
      )}

      <footer className="mt-20">
        <FooterLine />
      </footer>
    </main>
  );
}
