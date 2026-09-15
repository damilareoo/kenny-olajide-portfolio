import { describe, expect, it } from "vitest";
import {
  FILES,
  RANKS,
  START,
  SOLUTION,
  SOLUTION_SAN,
  file,
  isSolution,
  pieceAt,
  queenCanReach,
  rank,
} from "./chess";

describe("the position", () => {
  it("is three pieces and nothing else", () => {
    expect(START).toHaveLength(3);
    expect(START.map((p) => `${p.colour}${p.kind}${p.at}`).sort()).toEqual([
      "bKh8",
      "wKg6",
      "wQb2",
    ]);
  });

  it("is legal: the two kings are not adjacent", () => {
    const [wk] = START.filter((p) => p.colour === "w" && p.kind === "K");
    const [bk] = START.filter((p) => p.colour === "b");
    const apart = Math.max(Math.abs(file(wk.at) - file(bk.at)), Math.abs(rank(wk.at) - rank(bk.at)));
    expect(apart).toBeGreaterThan(1);
  });

  /* The mate, re-derived here rather than asserted as a string, so the claim
     on the board is checked by something other than the person who made it.
     After Qb8 the black king's three escapes are g7, h7 and g8; g7 and h7 are
     adjacent to the white king on g6, and g8 is on the eighth rank with the
     queen, whose path to it is empty. */
  it("leaves the black king no square after Qb8", () => {
    const wk = "g6";
    const queen = SOLUTION.to;
    const bk = "h8";

    const adjacent = (a: string, b: string) =>
      a !== b &&
      Math.abs(file(a) - file(b)) <= 1 &&
      Math.abs(rank(a) - rank(b)) <= 1;

    // Nothing stands between b8 and the black king's rank, so the queen's
    // reach on an empty board is its reach in this position.
    expect(queenCanReach(queen, bk)).toBe(true);

    const escapes = ["g7", "h7", "g8"].filter(
      (s) => !adjacent(wk, s) && !queenCanReach(queen, s),
    );
    expect(escapes).toEqual([]);
  });

  it("writes the solution the way a game score would", () => {
    expect(SOLUTION_SAN).toBe("Qb8#");
  });

  it("names every file and rank exactly once", () => {
    expect([...FILES]).toEqual(["a", "b", "c", "d", "e", "f", "g", "h"]);
    expect([...RANKS]).toEqual([8, 7, 6, 5, 4, 3, 2, 1]);
  });
});

describe("queenCanReach", () => {
  it("accepts a move along a rank", () => {
    expect(queenCanReach("b2", "h2")).toBe(true);
  });

  it("accepts a move along a file", () => {
    expect(queenCanReach("b2", "b8")).toBe(true);
  });

  it("accepts a move along a diagonal", () => {
    expect(queenCanReach("b2", "h8")).toBe(true);
  });

  it("rejects a knight's move", () => {
    expect(queenCanReach("b2", "c4")).toBe(false);
    expect(queenCanReach("b2", "d1")).toBe(false);
  });

  it("rejects standing still", () => {
    expect(queenCanReach("b2", "b2")).toBe(false);
  });
});

describe("isSolution", () => {
  it("accepts only b2 to b8", () => {
    expect(isSolution("b2", "b8")).toBe(true);
  });

  it("rejects every other destination from b2", () => {
    for (const to of ["b7", "h8", "g7", "b1", "a2", "f6", "c2"]) {
      expect(isSolution("b2", to), `b2-${to}`).toBe(false);
    }
  });

  it("rejects the right destination from the wrong square", () => {
    expect(isSolution("b3", "b8")).toBe(false);
  });
});

describe("file, rank and pieceAt", () => {
  it("reads a square's coordinates", () => {
    expect([file("a1"), rank("a1")]).toEqual([1, 1]);
    expect([file("h8"), rank("h8")]).toEqual([8, 8]);
  });

  it("finds the piece standing on a square, and nothing on an empty one", () => {
    expect(pieceAt(START, "b2")).toMatchObject({ colour: "w", kind: "Q" });
    expect(pieceAt(START, "e4")).toBeUndefined();
  });
});
