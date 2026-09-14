import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kenny Olajide, product designer";

/* Drawn in the site's own tokens rather than a screenshot: an OG image is the
   one surface that is only ever seen out of context, so it has to carry the
   identity without any of the page around it.

   next/og does not run next/font, so the family here is a system stack, not
   the Inter binding the rest of the site uses. The figure that matters is the
   composition, not the exact face.

   Dark ground (#101010/#eeeeee/#b5b5b5) rather than the light one: this is
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
          background: "#101010",
          color: "#eeeeee",
          padding: 72,
          fontSize: 76,
          letterSpacing: "-0.03em",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div>{site.name}</div>
        <div style={{ fontSize: 30, color: "#b5b5b5", letterSpacing: 0, marginTop: 12 }}>
          {site.role}
        </div>
      </div>
    ),
    size,
  );
}
