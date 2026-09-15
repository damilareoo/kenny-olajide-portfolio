import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { IS_PLACEHOLDER as experienceIsPlaceholder, roles } from "./experience";
import { IS_PLACEHOLDER as writingIsPlaceholder, posts } from "./writing";
import { work, findWork } from "./work";

describe("content honesty", () => {
  it("flags experience as real and writing as still placeholder, in code, not only in a comment", () => {
    expect(experienceIsPlaceholder).toBe(false);
    expect(writingIsPlaceholder).toBe(true);
  });

  it("says so at the top of the writing file for whoever edits it next", () => {
    expect(readFileSync("data/writing.ts", "utf8").slice(0, 600)).toMatch(/PLACEHOLDER/);
  });

  it("never files the one still-uncorroborated ZoomInfo employer as fact", () => {
    // Forward Chess, Telebu and Chessable are now verified against Kenny's own
    // LinkedIn and appear legitimately in data/experience.ts. SmallChess is
    // still an unconfirmed scrape fragment and does not ship.
    const text = readFileSync("data/experience.ts", "utf8");
    expect(text, "SmallChess must not appear").not.toContain("SmallChess");
  });

  it("marks every placeholder post visibly", () => {
    for (const p of posts) expect(p.placeholder).toBe(true);
  });

  it("gives every real role its full record", () => {
    /* `from`/`to` became one `period` when the schema moved to the source
       repository's shape. The record is the same record; the assertion follows
       the field. `lib/experience.test.ts` is what checks a period parses. */
    for (const r of roles) {
      expect(r.role).toBeTruthy();
      expect(r.company).toBeTruthy();
      expect(r.period).toBeTruthy();
    }
  });

  it("never implies a role he still holds", () => {
    // Both product-design roles have ended. A period written to "Present" is
    // what would make the site say "Currently", and none of them is.
    for (const r of roles) expect(r.period).not.toMatch(/present/i);
  });
});

describe("the work", () => {
  it("selects exactly the two pieces the brief names", () => {
    expect(work.map((w) => w.slug)).toEqual(["endgame-ai", "chessever"]);
  });

  it("finds a piece by slug and returns undefined for anything else", () => {
    expect(findWork("chessever")?.title).toBe("ChessEver");
    expect(findWork("nope")).toBeUndefined();
  });

  it("gives every piece the fields a case page renders", () => {
    for (const w of work) {
      expect(w.title).toBeTruthy();
      expect(w.year).toMatch(/^\d{4}$/);
      expect(w.role).toBeTruthy();
      expect(w.oneLiner.length).toBeGreaterThan(40);
    }
  });

  it("gives both selected pieces a real, owner-confirmed role", () => {
    expect(findWork("endgame-ai")?.role).toBe("Product Designer");
    expect(findWork("chessever")?.role).toBe("0–1 Product Experience");
  });
});
