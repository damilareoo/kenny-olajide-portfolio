import { describe, expect, it } from "vitest";
import { feedAssets } from "@/data/assets.generated";
import { work } from "@/data/work";
import { groupShots } from "@/lib/shots";

describe("groupShots", () => {
  it("files every committed frame under a product", () => {
    const { unfiled } = groupShots(feedAssets);
    expect(unfiled).toEqual([]);
  });

  it("keeps the work's own order and the manifest's order inside it", () => {
    const { groups } = groupShots(feedAssets);
    expect(groups.map((g) => g.item.slug)).toEqual(["endgame-ai", "chessever"]);

    for (const group of groups) {
      const sources = group.shots.map((s) => s.src);
      expect(sources).toEqual([...sources].sort());
    }
  });

  it("accounts for every frame exactly once", () => {
    const { groups } = groupShots(feedAssets);
    const filed = groups.flatMap((g) => g.shots.map((s) => s.src));
    expect(filed).toHaveLength(feedAssets.length);
    expect(new Set(filed).size).toBe(feedAssets.length);
  });

  it("drops a product with no frames rather than printing an empty heading", () => {
    const { groups } = groupShots([]);
    expect(groups).toEqual([]);
  });

  it("returns what it cannot place instead of guessing", () => {
    const stray = { src: "/shots/nobody-01.jpg", title: "Nobody 01", date: null, width: 1, height: 1 };
    const { groups, unfiled } = groupShots([stray]);
    expect(groups).toEqual([]);
    expect(unfiled).toEqual([stray]);
  });

  it("matches on the slug boundary, not on a bare prefix", () => {
    // `endgame-ai` and a hypothetical `endgame` must not collect each other's
    // frames: the separator is part of the prefix for exactly this reason.
    const slugs = work.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const { groups } = groupShots([
      { src: "/shots/endgame-aixx-01.jpg", title: "x", date: null, width: 1, height: 1 },
    ]);
    expect(groups).toEqual([]);
  });
});
