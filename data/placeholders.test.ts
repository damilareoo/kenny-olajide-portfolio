import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "fs";
import { IS_PLACEHOLDER as experienceIsPlaceholder, roles } from "./experience";
import { work, findWork } from "./work";

describe("content honesty", () => {
  /* The writing surface went with the routes it served — §1 of the v3 spec is
     three routes and no others — so the flag that guarded it went with the
     file. Experience is the one content set with a flag left to check, and it
     is false because the roles are real, read off his own LinkedIn. */
  it("flags experience as real in code, not only in a comment", () => {
    expect(experienceIsPlaceholder).toBe(false);
  });

  it("never files the one still-uncorroborated ZoomInfo employer as fact", () => {
    // Forward Chess, Telebu and Chessable are now verified against Kenny's own
    // LinkedIn and appear legitimately in data/experience.ts. SmallChess is
    // still an unconfirmed scrape fragment and does not ship.
    const text = readFileSync("data/experience.ts", "utf8");
    expect(text, "SmallChess must not appear").not.toContain("SmallChess");
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
  it("selects exactly the two pieces the brief names, ChessEver first", () => {
    expect(work.map((w) => w.slug)).toEqual(["chessever", "endgame-ai"]);
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

  it("points every staged preview image at a committed file", () => {
    /* Preview slots are staged, not placeholders: a slot with no file is a
       hole on the page, so every image block in a preview must name art that
       exists under public/. Text blocks carry the words and need none. */
    const missing: string[] = [];
    for (const item of work) {
      for (const block of item.preview ?? []) {
        const media =
          block.kind === "full"
            ? [block]
            : block.kind === "pair" || block.kind === "inset"
              ? block.items
              : [];
        for (const frame of media) {
          if (frame.src && !existsSync(`public${frame.src}`)) missing.push(frame.src);
          if (!frame.src) missing.push(`(empty slot in ${item.slug})`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
