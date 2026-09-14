import { notFound } from "next/navigation";
import { findWork, work } from "@/data/work";
import { readAppStore } from "@/lib/app-store";
import { ShotCarousel } from "@/components/shot-carousel";
import { AppStoreMeta } from "@/components/app-store-meta";
import { CaseHeader } from "@/components/case-header";
import { Breadcrumb } from "@/components/breadcrumb";
import { adjacent, Pagination } from "@/components/pagination";
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
  return item ? { title: item.title, description: item.summary } : {};
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
  const index = work.findIndex((w) => w.slug === slug);
  const { prev, next } = adjacent(
    work.map((w) => ({ title: w.title, href: `/work/${w.slug}` })),
    index,
  );

  return (
    <main id="main" className="mx-auto w-full max-w-[1240px] px-6 pb-32">
      <div className="pt-8">
        <Breadcrumb
          trail={[
            { label: "Work", href: "/work" },
            { label: item.title, href: `/work/${item.slug}` },
          ]}
        />
      </div>

      <CaseHeader slug={item.slug} icon={card.icon} title={item.title} summary={item.summary} />

      {/* The carousel as a full-bleed band, escaping the measure the prose
          below reads inside. `-mx-6` cancels exactly `main`'s own px-6
          gutter, so the band spans main's full max-w-[1240px] box — clearly
          wider than the lg:grid-cols-[2fr_1fr] body/rail below, which stays
          inside that gutter. Deliberately not a viewport-spanning w-screen
          bleed: that trick opens a horizontal scrollbar the moment a page's
          own vertical scrollbar narrows the true viewport by its own width,
          and a scroll-triggered layout shift is a worse defect than a
          modest bleed. */}
      <div className="-mx-6 mt-16">
        <Reveal scale>
          <ShotCarousel card={card} />
        </Reveal>
      </div>

      {/* Body and a sticky Record rail. Sticky only from `lg` up: below that
          the two columns stack into one and the rail sits after the body in
          normal flow — a rail "stuck" a few lines below prose it has already
          finished trailing is worse than a rail that simply scrolls with the
          page, so correct scrolling wins there over stickiness. `self-start`
          is required at `lg` too: a grid item stretches to the row's full
          height by default, which leaves a sticky child no room to move
          inside it. */}
      <div className="mt-16 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          {item.body.map((p) => (
            <p key={p} className="text-text-2 text-[length:var(--text-base)]">
              {p}
            </p>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Label>Record</Label>
          <dl className="mt-4">
            <RecordRow label="Year" value={item.year} />
            {/* The Endgame honesty requirement: a Role row is only printed
                when the work item actually carries one, never asserted. */}
            {item.role && <RecordRow label="Role" value={item.role} />}
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

      <Pagination prev={prev} next={next} />
    </main>
  );
}
