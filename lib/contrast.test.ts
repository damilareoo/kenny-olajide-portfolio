import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { contrastRatio, readSkins } from "./contrast";

const css = readFileSync("app/globals.css", "utf8");
const { light, dark } = readSkins(css);

const AA = 4.5;
const LARGE = 3;

describe("the light skin", () => {
  it("sets every token the site reads", () => {
    for (const t of ["--bg","--surface","--surface-2","--border","--rule","--text-1","--text-2","--text-3","--text-4"]) {
      expect(light[t], `light is missing ${t}`).toBeDefined();
    }
  });

  it("carries body copy at AA on --bg for ink 1 through 3", () => {
    for (const t of ["--text-1", "--text-2", "--text-3"]) {
      expect(contrastRatio(light[t], light["--bg"])).toBeGreaterThanOrEqual(AA);
    }
  });

  it("carries body copy at AA on --surface for ink 1 and 2 only", () => {
    expect(contrastRatio(light["--text-1"], light["--surface"])).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(light["--text-2"], light["--surface"])).toBeGreaterThanOrEqual(AA);
    // Rule 3: --text-3 is below AA here. Held as a fact, so moving the token trips this.
    expect(contrastRatio(light["--text-3"], light["--surface"])).toBeLessThan(AA);
  });

  it("keeps --text-4 out of every text role", () => {
    // Rule 4: it fails even the large-text floor on all three light grounds.
    for (const g of ["--bg", "--surface", "--surface-2"]) {
      expect(contrastRatio(light["--text-4"], light[g])).toBeLessThan(LARGE);
    }
  });
});

describe("the dark skin", () => {
  it("carries body copy at AA on --bg and --surface for ink 1 through 3", () => {
    for (const t of ["--text-1", "--text-2", "--text-3"]) {
      for (const g of ["--bg", "--surface"]) {
        expect(contrastRatio(dark[t], dark[g])).toBeGreaterThanOrEqual(AA);
      }
    }
  });

  it("keeps --text-4 to decoration in dark too, for one rule across both skins", () => {
    expect(contrastRatio(dark["--text-4"], dark["--surface"])).toBeLessThan(AA);
  });
});

describe("both skins", () => {
  it("holds the exact measured figures, so a nudge has to state its cost", () => {
    expect(contrastRatio(light["--text-2"], light["--bg"])).toBeCloseTo(5.37, 1);
    expect(contrastRatio(light["--text-3"], light["--bg"])).toBeCloseTo(4.54, 1);
    expect(contrastRatio(dark["--text-1"], dark["--bg"])).toBeCloseTo(16.40, 1);
    expect(contrastRatio(dark["--text-4"], dark["--bg"])).toBeCloseTo(4.50, 1);
  });
});
