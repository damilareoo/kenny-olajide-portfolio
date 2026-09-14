import { describe, expect, it } from "vitest";
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
