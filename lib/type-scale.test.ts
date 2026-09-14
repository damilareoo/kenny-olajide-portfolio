import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";

const css = readFileSync("app/globals.css", "utf8");
const root = css.match(/:root\s*\{([^}]*)\}/)![1];
const step = (name: string) => root.match(new RegExp(`--text-${name}:\\s*([^;]+);`))![1].trim();

const FIXED = ["2xs", "xs", "sm"];
const FLUID = ["base", "lg", "xl"];

describe("the type scale", () => {
  it("sets all six steps", () => {
    for (const s of [...FIXED, ...FLUID]) expect(step(s)).toBeTruthy();
  });

  it("keeps the three small steps fixed", () => {
    // Captions, labels, years and counts are already at their floor. Growing
    // them with the window makes them worse, not more readable.
    for (const s of FIXED) expect(step(s)).not.toMatch(/clamp|vw/);
  });

  it("makes the three large steps fluid", () => {
    for (const s of FLUID) expect(step(s)).toMatch(/^clamp\(/);
  });

  it("anchors both clamp ends in rem so browser zoom still reaches them", () => {
    for (const s of FLUID) {
      const [min, , max] = step(s).replace(/^clamp\(|\)$/g, "").split(/,(?![^()]*\))/);
      expect(min.trim(), `${s} min`).toMatch(/rem$/);
      expect(max.trim(), `${s} max`).toMatch(/rem$/);
    }
  });

  it("leads every preferred value with a rem term, never pure vw", () => {
    // A preferred value of pure vw pins size to the window and ignores the
    // visitor's text-size setting entirely.
    for (const s of FLUID) {
      const pref = step(s).replace(/^clamp\(|\)$/g, "").split(/,(?![^()]*\))/)[1];
      expect(pref.trim(), `${s} preferred`).toMatch(/^[\d.]+rem/);
    }
  });

  it("enables tabular figures and Inter's disambiguation set, and not cv05", () => {
    // ss02 is Inter's "Disambiguation (with zero)" and already covers the
    // I/l/1 collision and the slashed zero. cv05 would duplicate that work.
    expect(css).toMatch(/font-feature-settings:[^;]*"tnum"/);
    expect(css).toMatch(/font-feature-settings:[^;]*"ss02"/);
    expect(css).not.toMatch(/"cv05"/);
  });
});
