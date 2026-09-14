import { readAppStore } from "@/lib/app-store";
import { work } from "@/data/work";
import { WorkCard } from "@/components/work-card";
import { Reveal } from "@/components/reveal";
import { Label } from "@/components/ui";
import { STAGGER } from "@/lib/motion";

export const metadata = { title: "Work" };

/* Cached for six hours by readAppStore (see lib/app-store.ts), so this stays
   a static prerender between reads rather than putting an Apple request on
   every visit — the same shape as the home page's selected-work section. */
export default async function WorkIndex() {
  const cards = await readAppStore();

  return (
    <main className="mx-auto w-full max-w-[1240px] px-6 pb-32 pt-16">
      <Label>Work</Label>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {work.map((item, i) => (
          <Reveal key={item.slug} delay={i * STAGGER}>
            <WorkCard item={item} card={cards[item.slug]} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
