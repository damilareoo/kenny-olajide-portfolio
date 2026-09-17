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
 * What fourteen identical phone screens wanted instead was a gallery: one
 * size, one grid, and a heading that says which app you are looking at. That
 * heading is the whole of the intuitiveness — without it the page is a wall
 * of screens from two products with no way to tell them apart short of
 * recognising the board style.
 *
 * Since 2026-09-17 the Endgame group also holds artwork that is not a screen:
 * an alternate state of the wager sheet, two strips of board themes, and the
 * avatar set. Screens stay in the one uniform slot; artwork keeps its own
 * aspect and runs wide, because cropping a theme strip into a portrait phone
 * box would leave one board showing where it should show eight. Same grid,
 * same sweep, same labels — the owner's instruction was that everything
 * lives on this page in the same treatment.
 *
 * Everything else is the source's and unchanged: `Frame` draws the slot,
 * `PanelField` runs the dot-matrix sweep that dissolves each photograph in, and
 * the labels are the same mono the record rows use.
 */
/**
 * One shape for every frame on the wall.
 *
 * The screens do not all arrive at one size — the App Store exports are
 * 1290x2803 and 1284x2778, and the later additions came off a contact sheet at
 * 210 wide — and their ratios differ by up to seven percent. Laid out at their
 * own ratios that difference is a grid whose rows do not line up, which is the
 * one thing a gallery of identical phone screens must not look like. So every
 * slot is the same portrait box and the picture is cropped into it: at this
 * margin the crop is about three percent off each side of the widest frames,
 * which is inside the padding a phone screenshot already carries.
 *
 * Artwork that isn't a phone screen is exempt from the slot: it renders at
 * its own intrinsic ratio (`Frame` reads width/height straight from the
 * manifest) and spans the grid, so the strips and the avatar set show whole.
 */
const SHOT_RATIO = "9 / 19.5";

export function ShotsWall({ groups }: { groups: ShotGroup[] }) {
  return (
    <div className="space-y-16">
      {groups.map((group) => {
        const snapshot = appSnapshots.find((app) => app.slug === group.item.slug);
        const count = String(group.shots.length).padStart(2, "0");

        return (
          <section key={group.item.slug}>
            {/* The same three-part row the home's masthead and its featured
                count draw: a name, a rule, and the count in the matrix's own
                numerals with the digits spoken for a screen reader. */}
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
              {group.shots.map((shot, i) => {
                /* Screens take the one uniform slot; artwork keeps its own
                   shape. The wager sheet's alternate state is still a phone
                   screen by ratio, so the test is the ratio, not the title. */
                const r = shot.width / shot.height;
                const isScreen = r > 0.4 && r < 0.62;
                const wide = r >= 1.6;
                return (
                  <Frame
                    key={shot.src}
                    src={shot.src}
                    /* What a reader who cannot see it is owed: which product,
                       and where in the sequence it sits. */
                    alt={`${group.item.title}, ${isScreen ? "screen" : "artwork"} ${i + 1} of ${group.shots.length}`}
                    {...(isScreen
                      ? { ratio: SHOT_RATIO }
                      : { width: shot.width, height: shot.height })}
                    sizes={
                      wide
                        ? "(min-width: 1024px) 1180px, 92vw"
                        : r >= 1
                          ? "(min-width: 1024px) 50vw, 92vw"
                          : "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 46vw"
                    }
                    className={
                      wide
                        ? "col-span-2 sm:col-span-3 lg:col-span-4"
                        : r >= 1
                          ? "col-span-2"
                          : ""
                    }
                    panel
                  />
                );
              })}
            </PanelField>
          </section>
        );
      })}
    </div>
  );
}
