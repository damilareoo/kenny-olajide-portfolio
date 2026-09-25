import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, readSkin, relativeLuminance } from "./contrast";

/**
 * The harness survived the design language switch; the palette it measures did
 * not. Every figure below was recomputed against the monochrome ramp now in
 * app/globals.css — none of v2's numbers were carried over, and the shape of
 * what is asserted follows the source repository's own contrast test rather
 * than v2's, because the ramp is the source's.
 *
 * Read out of the stylesheet rather than duplicated here: a copy of the palette
 * in a test file is a second source of truth that goes stale the first time
 * somebody edits the CSS.
 */
const css = readFileSync(resolve(__dirname, "../app/globals.css"), "utf8");
const skin = readSkin(css);

const AA = 4.5;
const LARGE = 3;

describe("contrastRatio", () => {
  it("puts black on white at the top of the scale", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
  });

  it("puts a colour against itself at the bottom", () => {
    expect(contrastRatio("#7d7d7d", "#7d7d7d")).toBeCloseTo(1, 5);
  });

  it("is symmetric — the order of the pair cannot matter", () => {
    expect(contrastRatio("#111111", "#f2f2f2")).toBeCloseTo(
      contrastRatio("#f2f2f2", "#111111"),
      5,
    );
  });

  it("reads luminance down the ramp, not up it", () => {
    expect(relativeLuminance("#ffffff")).toBeGreaterThan(relativeLuminance("#7d7d7d"));
    expect(relativeLuminance("#7d7d7d")).toBeGreaterThan(relativeLuminance("#000000"));
  });
});

describe("readSkin", () => {
  it("finds the skin and its tokens", () => {
    for (const token of [
      "--bg",
      "--surface",
      "--surface-2",
      "--border",
      "--text-1",
      "--text-2",
      "--text-3",
      "--fill-strong",
      "--on-strong",
      "--miss",
    ]) {
      expect(skin[token], token).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("no longer carries the tokens the old ramp had and this one does not", () => {
    // --rule and --text-4 were v2's. A stylesheet that still declared them
    // would mean the swap was partial.
    expect(skin["--rule"]).toBeUndefined();
    expect(skin["--text-4"]).toBeUndefined();
  });
});

describe("the skin", () => {
  const GROUNDS = ["--bg", "--surface", "--surface-2"] as const;

  it("keeps tertiary text legible, which is the whole point of this floor", () => {
    // --text-3 carries every label, year and caption at --text-xs, 0.6875rem,
    // and at --text-2xs, 0.5625rem. Below 3:1 it is decoration that happens to
    // contain words. Measured on all three grounds, not only --bg.
    for (const ground of GROUNDS) {
      expect(contrastRatio(skin["--text-3"], skin[ground]), ground)
        .toBeGreaterThanOrEqual(LARGE);
    }
  });

  it("keeps primary and secondary text at AA on every ground", () => {
    for (const ground of GROUNDS) {
      for (const ink of ["--text-1", "--text-2"] as const) {
        expect(contrastRatio(skin[ink], skin[ground]), `${ink} on ${ground}`)
          .toBeGreaterThanOrEqual(AA);
      }
    }
  });

  it("holds --text-3 below AA, as a fact rather than an oversight", () => {
    /* The failure, pinned. --text-3 (#777777) measures 4.37 on --bg and 4.04
       on --surface-2 — under AA on both, on purpose: it is the quiet ink and
       pushing it to 4.5 would flatten the three-step ink ramp that the test
       below guards. Anything set in it is a label, a year or a caption, never
       body copy. If somebody darkens it past AA that is a decision about the
       ramp's shape and this test is where it gets stated. */
    expect(contrastRatio(skin["--text-3"], skin["--bg"])).toBeLessThan(AA);
    expect(contrastRatio(skin["--text-3"], skin["--surface-2"])).toBeLessThan(AA);
  });

  it("keeps the three ink steps genuinely distinct", () => {
    const one = contrastRatio(skin["--text-1"], skin["--bg"]);
    const two = contrastRatio(skin["--text-2"], skin["--bg"]);
    const three = contrastRatio(skin["--text-3"], skin["--bg"]);
    expect(one).toBeGreaterThan(two);
    expect(two).toBeGreaterThan(three);
  });

  it("separates the raised surface from the ground", () => {
    // Measured as a contrast RATIO, not a luminance difference. The same
    // difference in luminance reads as an obvious step near black and as
    // nothing at all near white, so the ratio is the honest yardstick on a
    // light ground.
    expect(contrastRatio(skin["--surface-2"], skin["--bg"])).toBeGreaterThan(1.015);
  });

  it("draws a hairline that is actually a line", () => {
    const gap = Math.abs(relativeLuminance(skin["--border"]) - relativeLuminance(skin["--bg"]));
    expect(gap).toBeGreaterThan(0.01);
  });

  it("keeps the strong fill's own ink at AA against it", () => {
    // --on-strong is the one pairing where the ground is ink: a filled chip, the
    // held-down nav key. Nothing above white is left to spend.
    expect(contrastRatio(skin["--on-strong"], skin["--fill-strong"]))
      .toBeGreaterThanOrEqual(AA);
  });

  it("admits exactly one hue, and it is --miss", () => {
    // Pure monochrome is the law, and equal channels is how it is enforced.
    // --miss is the one documented exception and is not asserted here.
    for (const [token, value] of Object.entries(skin)) {
      if (token === "--miss") continue;
      const [r, g, b] = [1, 3, 5].map((i) => value.slice(i, i + 2).toLowerCase());
      expect(`${token}:${r}${g}${b}`).toBe(`${token}:${r}${r}${r}`);
    }
  });
});

describe("the exact figures", () => {
  /* Computed off this ramp, not copied from the palette it replaced. v2's
     numbers — 5.37, 4.54, 16.40, 4.50 — measured tokens that no longer exist.
     These are here so a nudge to any of them has to state its cost. */
  it("holds the measured ratios", () => {
    const l = skin;
    expect(contrastRatio(l["--text-1"], l["--bg"])).toBeCloseTo(18.68, 1);
    expect(contrastRatio(l["--text-2"], l["--bg"])).toBeCloseTo(7.04, 1);
    expect(contrastRatio(l["--text-3"], l["--bg"])).toBeCloseTo(4.37, 1);
    expect(contrastRatio(l["--surface-2"], l["--bg"])).toBeCloseTo(1.08, 2);
  });

  it("holds the one hue at AA on its own ground", () => {
    expect(contrastRatio(skin["--miss"], skin["--bg"])).toBeCloseTo(4.87, 1);
  });
});
