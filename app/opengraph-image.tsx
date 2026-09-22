import { ImageResponse } from "next/og";
import { portraitDataUri } from "@/lib/portrait-file";
import { site } from "@/data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name}, product designer`;

/* Drawn in the site's own tokens rather than screenshotted: an OG image is the
   one surface that is only ever seen out of context, so it has to carry the
   identity with none of the page around it.

   The portrait is on it now, and that is the change worth naming. A share card
   that is only type is a title bar; a face in a feed is the thing that says a
   person is behind the link. It is the same file the favicon crops and the
   About page paints as a dot field — see `lib/portrait-file.ts` for why all
   three read one constant.

   Uncropped here, because the card has room for the whole circle and because
   the transparent corners fall on the ground and disappear: the mask does the
   work a border-radius would.

   Dark ground (--bg/--text-1/--text-2 on the dark skin: #090909/#f5f5f5/#9a9a9a)
   rather than the light one — this is almost always seen in a feed, and the
   dark lockup is the stronger identity out of context.

   next/og does not run next/font, so the family here is a system stack, not the
   Geist binding the rest of the site uses. What carries is the composition. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 72,
          background: "#090909",
          color: "#f5f5f5",
          padding: 88,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 76, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 30, color: "#9a9a9a", marginTop: 16 }}>{site.role}</div>
          {/* The one line of substance, and it is the home's own claim rather
              than a second piece of copy invented for a card nobody edits. */}
          <div style={{ fontSize: 26, color: "#9a9a9a", marginTop: 40, lineHeight: 1.4 }}>
            Interfaces, end to end. The last two were chess apps.
          </div>
        </div>
        <img src={portraitDataUri()} alt="" width={380} height={380} />
      </div>
    ),
    size,
  );
}
