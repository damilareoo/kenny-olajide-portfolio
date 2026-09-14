import Link from "next/link";
import { readAppStore } from "@/lib/app-store";
import { findWork } from "@/data/work";
import { roles } from "@/data/experience";
import { IS_PLACEHOLDER as WRITING_IS_PLACEHOLDER, posts } from "@/data/writing";
import { site } from "@/data/site";
import { WorkCard } from "@/components/work-card";
import { Ladder } from "@/components/ladder";
import { Reveal, RevealLines } from "@/components/reveal";
import { Label, RecordRow } from "@/components/ui";
import { STAGGER } from "@/lib/motion";

export default async function Home() {
  /* Cached for six hours by readAppStore, so this stays a static prerender
     between reads rather than putting an Apple request on every visit. */
  const cards = await readAppStore();

  const endgame = findWork("endgame-ai")!;
  const chessever = findWork("chessever")!;

  /* The two most recent posts, same ordering rule as app/writing/page.tsx.
     Still placeholder data until IS_PLACEHOLDER in data/writing.ts drops. */
  const recentPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);

  /* roles[0] is the most recent row data/experience.ts carries (Endgame AI,
     ended Aug 2026) — a fact read straight off the ladder rather than a
     separate "current status" claim invented for the hero. Both of his two
     most recent roles have ended, so nothing here should read as present
     employment. */
  const mostRecent = roles[0];

  return (
    <main id="main" className="mx-auto w-full max-w-[1240px] overflow-x-clip px-6 pb-32">
      {/* Hero. Not centred — nothing on this site is. */}
      <section className="py-24 sm:py-32">
        <h1 className="text-text-1 text-[length:var(--text-display)] font-medium tracking-[var(--tracking-display)]">
          <RevealLines lines={[site.name]} />
        </h1>
        <p className="text-text-2 mt-6 max-w-xl text-[length:var(--text-lead)]">
          He taught chess for five years, edited chess courses, then chess e-books — and
          only then designed a chess product for people who play it.
        </p>
        <dl className="mt-10 max-w-md">
          <RecordRow label="Location" value={site.location} />
          <RecordRow label="Status" value={`Most recently at ${mostRecent.company}`} />
          <RecordRow label="Email" value={site.email} href={`mailto:${site.email}`} />
        </dl>
      </section>

      {/* Selected work — layered rather than a symmetric two-up grid. Endgame
          takes roughly seven of twelve columns and sits high; ChessEver takes
          five, starts past the midpoint, and is pushed down by lg:mt-24 so
          the two overlap vertically rather than sitting as a matched pair.
          Below `lg` both go full width and the offset drops — an asymmetry
          that survives into one column is just a misalignment, not a
          composition. */}
      <section>
        <Label>Selected work</Label>
        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <WorkCard item={endgame} card={cards[endgame.slug]} />
            </Reveal>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:mt-24">
            <Reveal delay={STAGGER}>
              <WorkCard item={chessever} card={cards[chessever.slug]} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The ladder — where the chess narrative lands as a dense record
          rather than as more prose. */}
      <section className="mt-24 sm:mt-32">
        <Label>The long way round</Label>
        <p className="text-text-2 mt-3 max-w-xl text-[length:var(--text-base)]">
          He did not arrive at chess software as a designer looking for a domain — the
          board came first.
        </p>
        <div className="mt-8">
          <Ladder />
        </div>
      </section>

      {/* Writing teaser. Two most recent posts, titles at reading size, dates
          in tabular figures (html's global tnum feature, not a per-component
          style). Carries the placeholder notice while IS_PLACEHOLDER holds. */}
      <section className="mt-24 sm:mt-32">
        <Label>Writing</Label>
        {WRITING_IS_PLACEHOLDER && (
          <p className="text-text-3 mt-3 text-[length:var(--text-xs)]">
            Placeholder posts — real writing to be supplied.
          </p>
        )}
        <ul className="mt-6">
          {recentPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * STAGGER}>
              <li className="border-border border-b py-4 last:border-none">
                <Link
                  href={`/writing/${post.slug}`}
                  className="group flex items-baseline justify-between gap-6"
                >
                  <span className="text-text-1 group-hover:text-text-2 text-[length:var(--text-base)] transition-colors">
                    {post.title}
                  </span>
                  <span className="label shrink-0">{post.date}</span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>
    </main>
  );
}
