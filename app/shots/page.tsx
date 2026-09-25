import type { Metadata } from "next";
import { ShotsWall } from "@/components/shots-wall";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { feedAssets } from "@/data/assets.generated";
import { groupShots } from "@/lib/shots";

export const metadata: Metadata = {
  title: "Shots",
  description: "Screens from the products Kenny has designed.",
};

/**
 * Every screen, from two products, filed under the product each came from.
 *
 * The frames are the products' own design work, which is what a shots page on
 * a product designer's site should hold. No containers: each picture stands
 * bare at its own aspect through `BareShots`, so nothing is cropped and no
 * chrome sits between the reader and the work.
 */
export default function ShotsPage() {
  const { groups, unfiled } = groupShots(feedAssets);

  return (
    <main className="mx-auto w-full max-w-[1320px] px-5 py-4 pb-20 sm:px-6">
      <SiteNav current="/shots" />

      <header className="mt-10 pb-8 short:mt-4 short:pb-4">
        <h1 className="text-xl font-bold tracking-tight">Shots</h1>
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

      <SiteFooter />
    </main>
  );
}
