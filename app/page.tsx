import { GlyphText } from "@/components/glyph-text";
import { Photo } from "@/components/photo";
import { Product } from "@/components/product";
import { ShotsMarquee } from "@/components/shots-marquee";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { readAppStore } from "@/lib/app-store";
import { groupShots } from "@/lib/shots";
import { feedAssets, workAssets } from "@/data/assets.generated";
import { site } from "@/data/site";
import { work } from "@/data/work";

/**
 * The home, in the preferred layout.
 *
 * Top row is a dot (home) plus Shots / About plus a Contact pill — the mock's
 * minimal bar with the two routes the v3 spec keeps. Then name, chess claim,
 * UX-heavy about excerpt, numbered work, a horizontal Shots strip, and an
 * email + LinkedIn-only footer. Work itself still renders through `Product`
 * / `AppStoreCard` untouched.
 */
export default async function Home() {
  const apps = await readAppStore();
  const featuredCount = String(work.length).padStart(2, "0");
  /* The rail each app entry scrolls: the product's own feed screens, so the
     home shows the same pictures /shots files under the product. */
  const { groups } = groupShots(feedAssets);
  const shotsBySlug = Object.fromEntries(groups.map((group) => [group.item.slug, group.shots]));
  /* The Endgame rail ends at the Settings screen (08). Everything past it is
     contact-sheet cuts the owner says are not Endgame screens — they stay out
     of the rail. Slice is inclusive of the marker; a missing marker falls back
     to the whole group rather than an empty rail. */
  const RAIL_END: Record<string, string> = {
    "endgame-ai": "/shots/endgame-ai-08.jpg",
  };
  const railShots = (slug: string) => {
    const all = shotsBySlug[slug] ?? [];
    const end = RAIL_END[slug];
    if (!end) return all;
    const at = all.findIndex((shot) => shot.src === end);
    return at === -1 ? all : all.slice(0, at + 1);
  };

  return (
    <main className="mx-auto w-full max-w-[1240px] px-5 py-4 sm:px-6">
      <SiteNav current="/" />

      {/* The hero, set like a title card: the claim large and tight on the
          left, the face held to the right — at desktop widths a single
          column of capped prose left the whole right half empty. Mobile
          stacks with the face on top, small. Reads `/portrait/kenny.png`,
          so it follows whatever file is there with no code change. */}
      <header className="mt-8 sm:mt-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          {/* No h1 here: the header lockup above is the page's own h1, so the
              name is printed once. */}
          <div className="min-w-0">
            <p className="max-w-[24ch] text-xl font-medium leading-tight tracking-tight text-ink">
              Chess UX designer / UX Writer and Content Editor
            </p>
            <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-ink-2">
              I design thoughtful digital products from first idea to launch.
            </p>
            <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-ink-2">
              Open to full-time roles and collaborations.{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink-3"
              >
                Say hello.
              </a>
            </p>
          </div>
          <div className="order-first w-28 shrink-0 sm:order-last sm:w-44 sm:pb-1">
            <Photo
              src="/portrait/kenny.png"
              alt="Kenny Olajide"
              width={200}
              height={200}
              sizes="(min-width: 640px) 176px, 112px"
              priority
              roundedClassName="rounded-md"
            />
          </div>
        </div>
      </header>

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
            bare
            shots={railShots(item.slug)}
            defaultOpen
          />
        ))}
      </div>

      {/* Shots live here now, after the last case and just above the footer:
          one line that drifts on its own. The single label is the whole of
          the separation from the XD case above — without it the strip reads
          as XD's fourth block. The full grid archive still lives on /shots. */}
      <section aria-label="Shots" className="mt-20">
        <div className="flex items-baseline justify-between gap-x-4 pb-4 text-sm text-ink-2">
          <span>Shots</span>
        </div>
        <ShotsMarquee groups={groups} />
      </section>

      {/* Contact footer: the playlist plus the email with a copy control,
          and nothing else. Elsewhere links were cut by the owner — one
          contact path, in the nav's Connect and here. */}
      <SiteFooter />
    </main>
  );
}
