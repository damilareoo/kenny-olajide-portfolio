import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { DUR, EASE_OUT, EASE_INOUT } from "./motion";

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
    const block = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)![1];
    expect(block).toMatch(/animation-duration:\s*0\.01ms/);
    expect(block).toMatch(/transition-duration:\s*0\.01ms/);
    expect(block).toMatch(/animation-iteration-count:\s*1/);
  });

  it("keeps the ruler motif out of the stylesheet entirely", () => {
    expect(css).not.toMatch(/ruler|tick-strip|gauge/i);
  });

  it("holds EASE_INOUT for symmetric moves", () => {
    expect(EASE_INOUT).toEqual([0.65, 0, 0.35, 1]);
  });
});
