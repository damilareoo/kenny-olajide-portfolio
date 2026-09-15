import type { Metadata } from "next";
import { ShotsField } from "@/components/shots-field";
import { SiteNav } from "@/components/site-nav";
import { feedAssets } from "@/data/assets.generated";

export const metadata: Metadata = {
  title: "Shots",
  description: "Screens from the two iOS products Kenny designed.",
};

/**
 * Stage A placeholder, and the one route that is close to finished: the feed
 * is the source's `ShotsField` over this repo's own fourteen App Store
 * screenshots. Stage B owns the titles the frames carry in their alt text —
 * `scripts/manifest.mjs` derives them from the filenames today, which is
 * accurate and plain rather than written.
 */
export default function ShotsPage() {
  // Newest first, and undated frames sort last rather than pretending to a date.
  const shots = [...feedAssets].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <main className="mx-auto w-full max-w-[1320px] px-5 py-4 pb-28 sm:px-6">
      <SiteNav current="/shots" />
      <div className="mt-8 short:mt-4">
        <ShotsField shots={shots} />
      </div>
    </main>
  );
}
