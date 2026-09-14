import { describe, expect, it } from "vitest";
import { appSnapshots } from "@/data/app-store";
import {
  ART_ROUTE, SHOT_WIDTH, atShotWidth, cardsFrom, liveCard, proxied,
  recordedCard, recordedCards,
} from "./app-store";

const endgame = appSnapshots.find((a) => a.slug === "endgame-ai")!;

describe("the recorded floor", () => {
  it("serves every asset from public/, never from Apple", () => {
    const card = recordedCard(endgame);
    expect(card.icon.startsWith("/apps/")).toBe(true);
    for (const s of card.shots) expect(s.startsWith("/apps/")).toBe(true);
    expect(card.source).toBe("recorded");
  });

  it("drops trackId and recorded, which have no business reaching a component", () => {
    const card = recordedCard(endgame) as Record<string, unknown>;
    expect(card.trackId).toBeUndefined();
    expect(card.recorded).toBeUndefined();
  });

  it("keys every card by its work slug", () => {
    expect(Object.keys(recordedCards()).sort()).toEqual(["chessever", "endgame-ai"]);
  });
});

describe("rewriting Apple's URLs", () => {
  it("asks for the screen at reading width, not the 320x480 thumb", () => {
    expect(atShotWidth("https://is1-ssl.mzstatic.com/image/thumb/a/b/320x480bb.jpg"))
      .toBe(`https://is1-ssl.mzstatic.com/image/thumb/a/b/${SHOT_WIDTH}x0w.jpg`);
  });

  it("hands back a URL it does not recognise rather than mangling it", () => {
    expect(atShotWidth("https://example.com/thing")).toBe("https://example.com/thing");
  });

  it("routes artwork through the same-origin proxy, host first", () => {
    expect(proxied("https://is1-ssl.mzstatic.com/image/a.jpg"))
      .toBe(`${ART_ROUTE}/is1-ssl.mzstatic.com/image/a.jpg`);
  });
});

describe("the live merge", () => {
  it("takes the live figures when the payload carries them", () => {
    const card = liveCard(endgame, {
      trackId: Number(endgame.trackId), averageUserRating: 4.9,
      userRatingCount: 99, sellerName: "New Seller",
    });
    expect(card.rating).toBe(4.9);
    expect(card.ratingCount).toBe(99);
    expect(card.seller).toBe("New Seller");
    expect(card.source).toBe("live");
  });

  it("keeps the committed screens when a listing between builds returns none", () => {
    // Swapping four real screens for zero would empty a third of the card,
    // which is the one thing the floor exists to prevent.
    const card = liveCard(endgame, { trackId: Number(endgame.trackId), screenshotUrls: [] });
    expect(card.shots).toEqual(endgame.shots);
  });

  it("matches rows to snapshots by trackId, never by position", () => {
    // Two ids in and one row back is a normal answer. A positional match would
    // print one app's rating under the other's name.
    const only = appSnapshots.find((a) => a.slug === "chessever")!;
    const cards = cardsFrom([
      { trackId: Number(only.trackId), averageUserRating: 4.1, userRatingCount: 12 },
    ]);
    expect(cards["chessever"].source).toBe("live");
    expect(cards["chessever"].rating).toBe(4.1);
    expect(cards["endgame-ai"].source).toBe("recorded");
  });

  it("falls to the floor when the payload is empty", () => {
    const cards = cardsFrom([]);
    for (const c of Object.values(cards)) expect(c.source).toBe("recorded");
  });
});
