import { notFound } from "next/navigation";
import { findWork, work } from "@/data/work";
import { readAppStore } from "@/lib/app-store";
import { ShotCarousel } from "@/components/shot-carousel";
import { AppStoreMeta } from "@/components/app-store-meta";
import { CaseHeader } from "@/components/case-header";
import { Label, RecordRow } from "@/components/ui";
import { Reveal } from "@/components/reveal";

/* See app/work/work-route.test.ts. This is load-bearing, not tidiness.
   The case page sits behind app/loading.tsx, so Next serves a prerendered
   shell and commits HTTP 200 before the body streams — a notFound() reached
   during render can never set the status, and the page soft-404s.
   dynamicParams = false moves the decision to the router instead. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findWork(slug);
  return item ? { title: `${item.title} — Kenny Olajide`, description: item.summary } : {};
}

/**
 * A server component: it awaits `params` and `readAppStore()`, and every
 * animated piece it renders (`CaseHeader`, `ShotCarousel`, `Reveal`) carries
 * its own `"use client"`. No `"use client"` here — that would drag the Apple
 * fetch into the browser and lose the six-hour cache.
 */
export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findWork(slug);
  if (!item) notFound();

  const card = (await readAppStore())[slug];

  return (
    <main className="mx-auto w-full max-w-[1240px] px-6 pb-32">
      <CaseHeader slug={item.slug} icon={card.icon} title={item.title} summary={item.summary} />

      <Reveal>
        <ShotCarousel card={card} />
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          {item.body.map((p) => (
            <p key={p} className="text-text-2 text-[length:var(--text-base)]">
              {p}
            </p>
          ))}
        </div>

        <aside>
          <Label>Record</Label>
          <dl className="mt-4">
            <RecordRow label="Year" value={item.year} />
            <RecordRow label="Role" value={item.role} />
            <RecordRow label="Platform" value={card.genre} />
            {item.collaborators?.map((c) => (
              <RecordRow key={c.name} label={c.role} value={c.name} href={c.href} />
            ))}
          </dl>
          <div className="mt-8">
            <AppStoreMeta card={card} />
          </div>
        </aside>
      </div>
    </main>
  );
}
