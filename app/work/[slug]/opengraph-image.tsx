import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { findWork, work } from "@/data/work";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Same tokens and system-font stack as app/opengraph-image.tsx — see the
   comment there for why. This one takes its copy from findWork(slug) instead
   of the site-wide role line. */
export function generateStaticParams() {
  return work.map((w) => ({ slug: w.slug }));
}

export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findWork(slug);
  return item ? [{ id: item.slug, alt: `${item.title} — ${item.summary}` }] : [];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findWork(slug);
  if (!item) notFound();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#101010",
          color: "#eeeeee",
          padding: 72,
          fontSize: 64,
          letterSpacing: "-0.03em",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div>{item.title}</div>
        <div style={{ fontSize: 28, color: "#b5b5b5", letterSpacing: 0, marginTop: 16, maxWidth: 960 }}>
          {item.summary}
        </div>
      </div>
    ),
    size,
  );
}
