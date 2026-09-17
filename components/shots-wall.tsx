import { Frame } from "@/components/frame";
import { GlyphIcon } from "@/components/glyph-icon";
import { GlyphText } from "@/components/glyph-text";
import { PanelField } from "@/components/panel-field";
import type { ShotGroup } from "@/lib/shots";
import { appSnapshots } from "@/data/app-store";

/**
 * The shots, grouped by product, on one uniform grid.
 *
 * This is the one place the site departs from the arrangement it was ported
 * from, and the reason is the art. The source's feed is a twelve-track masonry
 * that alternates a full-measure frame with a drifted pair, and it is right for
 * what it holds: artwork of a dozen different aspect ratios, where the run
 * lengths are what stop a ragged column forming. Every frame here is a 1284 by
 * 2778 phone screenshot. Run through that layout the frames all hit the same
 * `--frame-cap` ceiling, arrive at the same width whichever track they were
 * given, and the alternation becomes a rhythm with nothing to distinguish its
 * halves — a composition doing its work invisibly and at the reader's expense.
 *
 * What fourteen identical phone screens want instead is a gallery: one size,
 * one grid, and a heading that says which app you are looking at. That heading
 * is the whole of the intuitiveness — without it the page is a wall of screens
 * from two products with no way to tell them apart short of recognising the
 * board style.
 *
 * Everything else is the source's and unchanged: `Frame` draws the slot,
 * `PanelField` runs the dot-matrix sweep that dissolves each photograph in, and
 * the labels are the same mono the record rows use.
 */
export function ShotsWall({ groups }: { groups: ShotGroup[] }) {
  return (
    <div className="space-y-16">
      {groups.map((group) => {
        const snapshot = appSnapshots.find((app) => app.slug === group.item.slug);
        const count = String(group.shots.length).padStart(2, "0");

        return (
          <section key={group.item.slug}>
            {/* The same header the home puts over its featured count: a name,
                a rule, and the count drawn in the matrix's own numerals with
                the digits spoken separately for a screen reader. */}
            <div className="rule-b flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-2">
              <h2 className="text-sm text-ink">{group.item.title}</h2>
              <div className="flex items-baseline gap-4">
                {snapshot && (
                  <a
                    href={snapshot.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-ink-3 transition-colors hover:text-ink"
                  >
                    App Store
                    <GlyphIcon name="arrow-out" size="0.4375rem" />
                  </a>
                )}
                <span className="flex items-baseline gap-1.5">
                  <span className="sr-only">{count} screens</span>
                  <GlyphText text={count} size="0.5rem" className="text-ink-3" aria-hidden />
                </span>
              </div>
            </div>

            {/* `revision` is the group's own length: each group runs its own
                sweep, so a frame is only ever dissolved by the field it stands
                in. `rootMargin` stays at the field's default here — unlike the
                source's full-measure frames, these are short enough that the
                default lead lands them on screen mid-dissolve rather than
                finished. */}
            <PanelField
              revision={group.shots.length}
              className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
            >
              {group.shots.map((shot, i) => (
                <Frame
                  key={shot.src}
                  src={shot.src}
                  /* What a reader who cannot see it is owed: which product, and
                     where in the listing it sits. Naming the screen's contents
                     would be writing captions for artwork nobody here made. */
                  alt={`${group.item.title}, App Store screen ${i + 1} of ${group.shots.length}`}
                  width={shot.width}
                  height={shot.height}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 46vw"
                  panel
                />
              ))}
            </PanelField>
          </section>
        );
      })}
    </div>
  );
}
