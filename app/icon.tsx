import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/* Same system-font stack as the OG images — next/og cannot run next/font. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#090909",
          color: "#f5f5f5",
          fontSize: 22,
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
