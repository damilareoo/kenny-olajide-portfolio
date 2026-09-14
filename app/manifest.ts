import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kenny Olajide",
    short_name: "Kenny",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#101010",
  };
}
