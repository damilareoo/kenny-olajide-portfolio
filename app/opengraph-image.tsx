import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kenny Olajide, product designer";

/* Drawn in the site's own tokens rather than a screenshot: an OG image is the
   one surface that is only ever seen out of context, so it has to carry the
   identity without any of the page around it.

   next/og does not run next/font, so the family here is a system stack, not
   the Geist binding the rest of the site uses. The figure that matters is the
   composition, not the exact face.

   Dark ground (--bg/--text-1/--text-2 on the dark skin: #090909/#f5f5f5/#9a9a9a) rather than the light one: this is
   almost always seen in a feed, not on the site, and the dark lockup is the
   stronger identity out of context. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#090909",
          color: "#f5f5f5",
          padding: 72,
          fontSize: 76,
          letterSpacing: "-0.03em",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div>{site.name}</div>
        <div style={{ fontSize: 30, color: "#9a9a9a", letterSpacing: 0, marginTop: 12 }}>
          {site.role}
        </div>
      </div>
    ),
    size,
  );
}
