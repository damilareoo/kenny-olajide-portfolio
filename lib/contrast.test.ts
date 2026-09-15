import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, readSkins, relativeLuminance } from "./contrast";

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
const skins = readSkins(css);

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

describe("readSkins", () => {
  it("finds both skins and their tokens", () => {
    for (const skin of [skins.light, skins.dark]) {
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
    }
  });

  it("no longer carries the tokens the old ramp had and this one does not", () => {
    // --rule and --text-4 were v2's. A stylesheet that still declared them
    // would mean the swap was partial.
    for (const skin of [skins.light, skins.dark]) {
      expect(skin["--rule"]).toBeUndefined();
      expect(skin["--text-4"]).toBeUndefined();
    }
  });
});

describe("the two skins", () => {
  const both = [
    ["light", skins.light],
    ["dark", skins.dark],
  ] as const;

  const GROUNDS = ["--bg", "--surface", "--surface-2"] as const;

  it("keeps tertiary text legible, which is the whole point of this floor", () => {
    // --text-3 carries every label, year and caption at --text-xs, 0.6875rem,
    // and at --text-2xs, 0.5625rem. Below 3:1 it is decoration that happens to
    // contain words. Measured on all three grounds, not only --bg: the lowest
    // of the six is --text-3 on dark --surface-2 at 3.14.
    for (const [name, skin] of both) {
      for (const ground of GROUNDS) {
        expect(contrastRatio(skin["--text-3"], skin[ground]), `${name} ${ground}`)
          .toBeGreaterThanOrEqual(LARGE);
      }
    }
  });

  it("keeps primary and secondary text at AA on every ground", () => {
    for (const [name, skin] of both) {
      for (const ground of GROUNDS) {
        for (const ink of ["--text-1", "--text-2"] as const) {
          expect(contrastRatio(skin[ink], skin[ground]), `${name} ${ink} on ${ground}`)
            .toBeGreaterThanOrEqual(AA);
        }
      }
    }
  });

  it("holds --text-3 below AA on the light skin, as a fact rather than an oversight", () => {
    /* The failure, pinned. On the light ramp --text-3 (#777777) measures 4.37
       on --bg and 4.04 on --surface-2 — under AA on both, on purpose: it is the
       quiet ink and pushing it to 4.5 would flatten the three-step ink ramp
       that the test below guards. Anything set in it is a label, a year or a
       caption, never body copy. If somebody darkens it past AA that is a
       decision about the ramp's shape and this test is where it gets stated. */
    expect(contrastRatio(skins.light["--text-3"], skins.light["--bg"])).toBeLessThan(AA);
    expect(contrastRatio(skins.light["--text-3"], skins.light["--surface-2"])).toBeLessThan(AA);
  });

  it("keeps the three ink steps genuinely distinct", () => {
    for (const [name, skin] of both) {
      const one = contrastRatio(skin["--text-1"], skin["--bg"]);
      const two = contrastRatio(skin["--text-2"], skin["--bg"]);
      const three = contrastRatio(skin["--text-3"], skin["--bg"]);
      expect(one, name).toBeGreaterThan(two);
      expect(two, name).toBeGreaterThan(three);
    }
  });

  it("separates the raised surface from the ground on BOTH skins", () => {
    // Measured as a contrast RATIO, not a luminance difference. The same
    // difference in luminance reads as an obvious step near black and as nothing
    // at all near white, so comparing raw differences across two skins scores
    // the light one against a yardstick that does not apply to it.
    const separations = both.map(([, skin]) => contrastRatio(skin["--surface-2"], skin["--bg"]));
    for (const separation of separations) expect(separation).toBeGreaterThan(1.015);
    const [light, dark] = separations;
    expect(Math.max(light - 1, dark - 1) / Math.min(light - 1, dark - 1)).toBeLessThanOrEqual(3);
  });

  it("draws a hairline that is actually a line", () => {
    for (const [name, skin] of both) {
      const gap = Math.abs(relativeLuminance(skin["--border"]) - relativeLuminance(skin["--bg"]));
      expect(gap, name).toBeGreaterThan(0.01);
    }
  });

  it("keeps the strong fill's own ink at AA against it", () => {
    // --on-strong is the one pairing where the ground is ink: a filled chip, the
    // held-down nav key. Nothing above white is left to spend on the light skin.
    for (const [name, skin] of both) {
      expect(contrastRatio(skin["--on-strong"], skin["--fill-strong"]), name)
        .toBeGreaterThanOrEqual(AA);
    }
  });

  it("admits exactly one hue, and it is --miss", () => {
    // Pure monochrome is the law, and equal channels is how it is enforced.
    // --miss is the one documented exception and is not asserted here.
    for (const [name, skin] of both) {
      for (const [token, value] of Object.entries(skin)) {
        if (token === "--miss") continue;
        const [r, g, b] = [1, 3, 5].map((i) => value.slice(i, i + 2).toLowerCase());
        expect(`${name}${token}:${r}${g}${b}`).toBe(`${name}${token}:${r}${r}${r}`);
      }
    }
  });
});

describe("the exact figures", () => {
  /* Computed off this ramp, not copied from the palette it replaced. v2's
     numbers — 5.37, 4.54, 16.40, 4.50 — measured tokens that no longer exist.
     These are here so a nudge to any of them has to state its cost. */
  it("holds the light skin's measured ratios", () => {
    const l = skins.light;
    expect(contrastRatio(l["--text-1"], l["--bg"])).toBeCloseTo(18.68, 1);
    expect(contrastRatio(l["--text-2"], l["--bg"])).toBeCloseTo(7.04, 1);
    expect(contrastRatio(l["--text-3"], l["--bg"])).toBeCloseTo(4.37, 1);
    expect(contrastRatio(l["--surface-2"], l["--bg"])).toBeCloseTo(1.08, 2);
  });

  it("holds the dark skin's measured ratios", () => {
    const d = skins.dark;
    expect(contrastRatio(d["--text-1"], d["--bg"])).toBeCloseTo(18.26, 1);
    expect(contrastRatio(d["--text-2"], d["--bg"])).toBeCloseTo(7.08, 1);
    expect(contrastRatio(d["--text-3"], d["--bg"])).toBeCloseTo(3.79, 1);
    expect(contrastRatio(d["--surface-2"], d["--bg"])).toBeCloseTo(1.21, 2);
  });

  it("holds the one hue at AA on its own ground, on both skins", () => {
    // --miss is deeper on light and brighter on dark for exactly this reason.
    expect(contrastRatio(skins.light["--miss"], skins.light["--bg"])).toBeCloseTo(4.87, 1);
    expect(contrastRatio(skins.dark["--miss"], skins.dark["--bg"])).toBeCloseTo(6.09, 1);
  });
});
