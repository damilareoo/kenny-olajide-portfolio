import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* Same system-font stack as the OG images — next/og cannot run next/font. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#101010",
          color: "#eeeeee",
          fontSize: 120,
          fontWeight: 600,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        K
      </div>
    ),
    size,
  );
}
