import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { DUR, EASE_OUT, EASE_INOUT, HOLD, STAGGER } from "./motion";

const css = readFileSync("app/globals.css", "utf8");

describe("the motion token set", () => {
  it("uses Deji's nav curve verbatim as the primary ease", () => {
    // dejiajetomobi.com: .active-container{transition:width .42s cubic-bezier(.22,.61,.36,1)}
    expect(EASE_OUT).toEqual([0.22, 0.61, 0.36, 1]);
    expect(DUR.base).toBe(0.42);
  });

  it("offers exactly four durations", () => {
    expect(Object.keys(DUR).sort()).toEqual(["base", "entrance", "micro", "staged"]);
  });

  it("exports STAGGER as a separate, non-DUR timing for staged offsets", () => {
    expect(typeof STAGGER).toBe("number");
    expect(Object.keys(DUR)).not.toContain("stagger");
  });

  it("mirrors every token into CSS so both languages animate identically", () => {
    expect(css).toContain("--ease-out: cubic-bezier(0.22, 0.61, 0.36, 1)");
    expect(css).toContain("--ease-inout: cubic-bezier(0.65, 0, 0.35, 1)");
    expect(css).toContain("--dur-base: 420ms");
  });

  it("agrees between the JS seconds and the CSS milliseconds", () => {
    for (const [name, seconds] of Object.entries(DUR)) {
      expect(css, `--dur-${name}`).toContain(`--dur-${name}: ${Math.round(seconds * 1000)}ms`);
    }
  });

  it("collapses to the final frame under reduced motion, not to a faster one", () => {
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);

    /* There is more than one reduced-motion block now — components that drive
       their own animations (e.g. the work-card fan) carry their own guards —
       so match the GLOBAL one by the universal selector it resets rather than
       by being first in the file. */
    const global = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*\*,[\s\S]*?\n\}/);
    expect(global, "no global reduced-motion block found").not.toBeNull();
    expect(global![0]).toMatch(/animation-duration:\s*0\.01ms/);
    expect(global![0]).toMatch(/transition-duration:\s*0\.01ms/);
    expect(global![0]).toMatch(/animation-iteration-count:\s*1/);
  });

  it("stops the work-card fan for reduced-motion visitors", () => {
    expect(css).toMatch(/\.group:hover \.fan > \*\s*\{\s*transform:\s*none/);
  });

  it("keeps the ruler motif out of the stylesheet entirely", () => {
    expect(css).not.toMatch(/ruler|tick-strip|gauge/i);
  });

  it("holds EASE_INOUT for symmetric moves", () => {
    expect(EASE_INOUT).toEqual([0.65, 0, 0.35, 1]);
  });

  /* v1 defined this curve and used it nowhere, and the v2 spec (§8) put it on
     notice: it is the curve for anything that returns to where it started, and
     if it ended up unused again it would be deleted. These two are what adopt
     it — the magnetic release settling back to zero, and the copy-email label
     reverting to the address. Asserted against the source so the token cannot
     quietly become dead again. */
  it("is adopted by the two moves that return to where they started", () => {
    expect(readFileSync("components/magnetic.tsx", "utf8")).toContain("EASE_INOUT");
    expect(readFileSync("components/copy-email.tsx", "utf8")).toContain("EASE_INOUT");
  });

  it("draws the link underline from the left rather than fading one in", () => {
    const rule = css.match(/\.link \{[\s\S]*?\}/);
    expect(rule, "no .link rule found").not.toBeNull();
    expect(rule![0]).toContain("background-size: 0% 1px");
    expect(rule![0]).toContain("transition: background-size var(--dur-micro) var(--ease-out)");
    expect(css).toMatch(/\.link:hover,\s*\n?\s*\.link:focus-visible \{\s*\n?\s*background-size: 100% 1px/);
  });

  it("stops the link underline from transitioning under reduced motion", () => {
    expect(css).toMatch(/\.link \{ transition: none; \}/);
  });

  it("exports HOLD as a separate, non-DUR rest beat", () => {
    expect(typeof HOLD).toBe("number");
    expect(Object.keys(DUR)).not.toContain("hold");
  });
});
