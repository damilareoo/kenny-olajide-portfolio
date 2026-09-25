import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kenny Olajide",
    short_name: "Kenny",
    start_url: "/",
    display: "standalone",
    /* --bg, from app/globals.css. The old theme colour (#090909) belonged to
       the removed dark skin; an installed app must open onto the light
       ground like every other surface. */
    background_color: "#fcfcfc",
    theme_color: "#fcfcfc",
  };
}
