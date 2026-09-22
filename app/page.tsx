import { GlyphText } from "@/components/glyph-text";
import { CopyEmail } from "@/components/copy-email";
import { Product } from "@/components/product";
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
 * UX-heavy about excerpt, numbered work, and an email + LinkedIn-only footer.
 * Work itself still renders through `Product` / `AppStoreCard` untouched.
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

      <header className="mt-8 short:mt-6">
        {/* No h1 here: the header lockup above is the page's own h1, so the
            name is printed once. What opens the page is the claim — UX-heavy
            per owner, no agency invented. */}
        <p className="max-w-[52ch] text-base leading-relaxed text-ink-2">
          I&rsquo;m a product designer focused on UX, research, and interface
          design — shipping product-ready work from first concept to the App
          Store.
        </p>
        <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-ink-2">
          Currently open to full-time roles and collaborations,{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink-3"
          >
            message me.
          </a>
        </p>
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
          />
        ))}
      </div>

      {/* Contact footer: the email with a copy control, and nothing else.
          Elsewhere links were cut by the owner — one contact path, in the
          nav's Connect and here. */}
      <footer className="mt-20 border-t border-line pt-8 pb-8">
        <p className="font-mono text-2xs uppercase tracking-wider text-ink-3">Email</p>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <a
            href={`mailto:${site.email}`}
            className="text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink-3"
          >
            {site.email}
          </a>
          <CopyEmail email={site.email} />
        </p>
      </footer>
    </main>
  );
}
