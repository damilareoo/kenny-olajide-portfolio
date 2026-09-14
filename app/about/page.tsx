import Image from "next/image";
import { roles } from "@/data/experience";
import { elsewhere, site } from "@/data/site";
import { Label, RecordRow } from "@/components/ui";

export const metadata = { title: "About" };

/**
 * The page that carries the narrative data/experience.ts's own comment
 * describes: five years teaching chess, then editing it, then designing it.
 *
 * A portrait beside type, not a hero banner — public/portrait/kenny.png is
 * 800px, which is enough for the 320px next/image renders here and not
 * enough to go larger. Two short paragraphs carry the chess-to-design
 * argument as prose; the full role history sits below as a record, in his
 * own wording rather than a rewrite of it.
 *
 * `IS_PLACEHOLDER` from data/experience.ts is not read here at all, unlike
 * app/writing/page.tsx and app/writing/[slug]/page.tsx: it is `false` now
 * that his history is real, so the notice this page used to carry has
 * nothing left to say. The portrait is a different claim — it is a stand-in
 * for a real photograph even though the history beside it is not a
 * stand-in for anything — so it gets its own caption below, rather than
 * borrowing a flag that answers a different question.
 */
export default function About() {
  return (
    <main id="main" className="mx-auto w-full max-w-[1240px] px-6 pb-32 pt-16">
      <header className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="shrink-0">
          <Image
            src="/portrait/kenny.png"
            alt="Kenny Olajide"
            width={320}
            height={320}
            priority
            className="rounded-2xl"
          />
          {/* The portrait is a placeholder even though the roles beside it
              are not — the page has to say so, or the photo reads as
              settled as the history. */}
          <p className="text-text-3 mt-3 max-w-[320px] text-[length:var(--text-xs)]">
            Placeholder portrait, taken from his LinkedIn profile. A real
            photograph is pending.
          </p>
        </div>

        <div>
          <h1 className="text-text-1 text-[length:var(--text-xl)] font-medium tracking-[var(--tracking-tight)]">
            {site.name}
          </h1>
          <p className="text-text-2 mt-2 max-w-lg text-[length:var(--text-lead)]">{site.headline}</p>

          {/* The chess-to-design argument, as prose rather than a list —
              this is the interesting true thing about him and the reason he
              is credible on this work. */}
          <div className="mt-8 max-w-lg space-y-4">
            <p className="text-text-2 text-[length:var(--text-base)]">
              He taught chess and Scrabble for five years at the Grand Cortex
              Centre before he ever opened a design tool. From there he moved
              into editing: technical content on Chessable&rsquo;s course
              library, then chess e-books at Forward Chess — work that meant
              reading the game&rsquo;s own material closely enough to correct
              it.
            </p>
            <p className="text-text-2 text-[length:var(--text-base)]">
              Only after years spent inside that material did he start
              designing chess products himself — first ChessEver, built from
              nothing across web and iOS, then Endgame AI, which turns engine
              analysis into something a club player can actually read. He
              designs for people who already know the game, because for most
              of his career he was one of them.
            </p>
          </div>
        </div>
      </header>

      <section className="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <Label>Experience</Label>
          <ol className="mt-4">
            {roles.map((r) => (
              <li key={`${r.company}-${r.from}`} className="border-border border-b py-4">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="label shrink-0">
                    {r.from}–{r.to}
                  </span>
                  <span className="text-text-1 text-right text-[length:var(--text-sm)]">
                    {r.role}, {r.company}
                  </span>
                </div>
                {/* His own wording from his profile, not a rewrite — absent
                    where the profile gave none. */}
                {r.note && (
                  <p className="text-text-3 mt-2 text-[length:var(--text-xs)]">{r.note}</p>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-12">
          <div>
            <Label>Record</Label>
            <dl className="mt-4">
              <RecordRow label="Education" value={site.education} />
              <RecordRow label="Location" value={site.location} />
            </dl>
          </div>

          <div>
            <Label>Elsewhere</Label>
            <dl className="mt-4">
              {elsewhere.map((e) => (
                <RecordRow key={e.label} label={e.label} value={e.handle} href={e.href} />
              ))}
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
