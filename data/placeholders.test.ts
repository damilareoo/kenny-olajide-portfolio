import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { IS_PLACEHOLDER as experienceIsPlaceholder, roles } from "./experience";
import { IS_PLACEHOLDER as writingIsPlaceholder, posts } from "./writing";
import { work, findWork } from "./work";

describe("content honesty", () => {
  it("flags both career files as placeholder in code, not only in a comment", () => {
    expect(experienceIsPlaceholder).toBe(true);
    expect(writingIsPlaceholder).toBe(true);
  });

  it("says so at the top of each file for whoever edits it next", () => {
    for (const f of ["data/experience.ts", "data/writing.ts"]) {
      expect(readFileSync(f, "utf8").slice(0, 600)).toMatch(/PLACEHOLDER/);
    }
  });

  it("never files the unverified ZoomInfo employers as fact", () => {
    // Search surfaced SmallChess, Forward Chess, Chessable and Telebu from a
    // scrape. None of it is confirmed, so none of it ships.
    const text = readFileSync("data/experience.ts", "utf8");
    for (const name of ["SmallChess", "Forward Chess", "Chessable", "Telebu"]) {
      expect(text, `${name} must not appear`).not.toContain(name);
    }
  });

  it("marks every placeholder role and post visibly", () => {
    for (const r of roles) expect(r.placeholder).toBe(true);
    for (const p of posts) expect(p.placeholder).toBe(true);
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
      expect(w.summary.length).toBeGreaterThan(40);
    }
  });
});
