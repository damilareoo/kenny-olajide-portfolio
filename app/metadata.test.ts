import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import sitemap from "./sitemap";
import robots from "./robots";
import manifest from "./manifest";

describe("metadata", () => {
  it("lists every real route in the sitemap", () => {
    const urls = sitemap().map((e) => new URL(e.url).pathname).sort();
    expect(urls).toEqual([
      "/", "/about", "/work", "/work/chessever", "/work/endgame-ai",
      "/writing", "/writing/designing-for-live", "/writing/on-constraint",
    ]);
  });

  it("keeps the artwork proxy out of the crawl — it is plumbing", () => {
    expect(robots().rules).toMatchObject({ userAgent: "*", disallow: "/api/" });
  });

  it("names the app and takes its colours from the two grounds", () => {
    expect(manifest().name).toBe("Kenny Olajide");
    expect(manifest().background_color).toBe("#ffffff");
    expect(manifest().theme_color).toBe("#101010");
  });
});

describe("page titles", () => {
  /* The template in app/layout.tsx already appends " — Kenny Olajide". A page
     whose own title also ends in the name renders it twice —
     "About — Kenny Olajide — Kenny Olajide" — which is the first thing a browser
     tab, a search result and a link unfurl show. This shipped once; the
     assertion is here so it cannot ship again. */
  const routes = [
    "app/about/page.tsx",
    "app/work/page.tsx",
    "app/writing/page.tsx",
    "app/not-found.tsx",
    "app/work/[slug]/page.tsx",
    "app/writing/[slug]/page.tsx",
  ];

  it("never repeats the site name in a page title", () => {
    for (const route of routes) {
      const src = readFileSync(route, "utf8");
      const titles = [...src.matchAll(/title:\s*([^,\n}]+)/g)].map((m) => m[1]);
      for (const t of titles) {
        expect(t, `${route} repeats the site name in its title`).not.toMatch(/Kenny Olajide/);
      }
    }
  });

  it("keeps the template that supplies the name exactly once", () => {
    expect(readFileSync("app/layout.tsx", "utf8")).toMatch(/template:\s*`%s — \$\{site\.name\}`/);
  });
});
