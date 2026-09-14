import { readAppStore } from "@/lib/app-store";
import { work } from "@/data/work";
import { WorkCard } from "@/components/work-card";
import { Reveal, RevealLines } from "@/components/reveal";
import { Label } from "@/components/ui";
import { STAGGER } from "@/lib/motion";

export default async function Home() {
  /* Cached for six hours by readAppStore, so this stays a static prerender
     between reads rather than putting an Apple request on every visit. */
  const cards = await readAppStore();

  return (
    <main id="main" className="mx-auto w-full max-w-[1240px] px-6 pb-32">
      <section className="py-24 sm:py-32">
        <h1 className="text-text-1 text-[length:var(--text-xl)] font-medium tracking-[var(--tracking-tight)]">
          <RevealLines
            lines={["Kenny Olajide is a product", "designer working on chess", "software for people who play it."]}
          />
        </h1>
      </section>

      <section>
        <Label>Selected work</Label>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {work.map((item, i) => (
            <Reveal key={item.slug} delay={i * STAGGER}>
              <WorkCard item={item} card={cards[item.slug]} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
