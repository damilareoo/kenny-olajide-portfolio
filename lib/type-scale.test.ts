import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The type scale, as the source repository declares it and this repo now
 * carries it: six steps, three fixed and three fluid, every clamp bounded in
 * rem at both ends and led by a rem term.
 *
 * v2's scale had eight steps — `display` and `lead` above `xl` — and asserted
 * Inter's `ss02` and `tnum` feature settings. Both are gone: the ramp is the
 * source's six, and the site is set in Geist, which carries neither of those
 * feature names. The discipline is unchanged and the figures are not v2's.
 */
const root = resolve(__dirname, "..");
const css = readFileSync(resolve(root, "app/globals.css"), "utf8");

/** The surfaces this scale governs. */
const GOVERNED = [
  "app/page.tsx",
  "app/about/page.tsx",
  "app/shots/page.tsx",
  "app/not-found.tsx",
  "components/ui.tsx",
  "components/frame.tsx",
  "components/case-reel.tsx",
  "components/site-nav.tsx",
  "components/product.tsx",
  "components/shots-wall.tsx",
  /* The borderless surfaces. BareShots and ScreenRail carry no type of their
     own today; Photo and CopyEmail set captions and controls at `2xs` — listed
     so any size added later lands on the scale. */
  "components/bare-shots.tsx",
  "components/screen-rail.tsx",
  "components/photo.tsx",
  "components/copy-email.tsx",
  /* The App Store card. Every size on it is a step — the listing name at
     `base`, the seller, genre and rating figure at `2xs`, the control at `xs`
     — and that is the only reason a card carrying somebody else's product
     header reads as part of this page rather than as a paste from another
     site. */
  "components/app-store-card.tsx",
  /* The company marks. The type step is load-bearing there in a way it is
     nowhere else on the site: the row's font size is what sets the cap height
     of the raster wordmark beside the one that is set in type, so a size
     smuggled in off the scale would resize two marks at once. */
  "components/company-marks.tsx",
  /* The roles, as a list — the same coupling one level up: the row's font size
     sets the cap height of the marks standing in it. */
  "components/role-list.tsx",
  /* The page's one photograph. It carries no type of its own today, which is
     exactly when a file is worth adding to this list: a caption or a credit
     added later has nowhere off the scale to land. */
];

const STEPS = ["2xs", "xs", "sm", "base", "lg", "xl"] as const;

/** How a step is declared: a bare rem, or a clamp() of three terms. */
function declaration(step: string): string {
  const match = css.match(new RegExp(`--text-${step}:\\s*([^;]+);`));
  if (!match) throw new Error(`--text-${step} is not declared in the stylesheet`);
  return match[1].trim();
}

describe("the type scale", () => {
  it("declares every step, and only these six", () => {
    for (const step of STEPS) expect(declaration(step), step).not.toHaveLength(0);
    // v2's two extra steps went with v2's scale.
    for (const gone of ["display", "lead"]) {
      expect(css, gone).not.toMatch(new RegExp(`--text-${gone}\\s*:`));
    }
  });

  it("bounds every step in rem, so the visitor's own text size still reaches it", () => {
    /* A size expressed only in viewport units is pinned to the window and
       ignores the text size the visitor set in their browser. So a step is
       either a bare rem or a clamp() whose floor, ceiling, and the leading term
       of its preferred value are all rem. */
    for (const step of STEPS) {
      const value = declaration(step);
      if (!value.startsWith("clamp(")) {
        expect(value, step).toMatch(/^[\d.]+rem$/);
        continue;
      }
      const terms = value.slice("clamp(".length, -1).split(",").map((t) => t.trim());
      expect(terms, step).toHaveLength(3);
      const [min, preferred, max] = terms;
      expect(min, `${step} floor`).toMatch(/^[\d.]+rem$/);
      expect(max, `${step} ceiling`).toMatch(/^[\d.]+rem$/);
      expect(preferred, `${step} preferred`).toMatch(/^[\d.]+rem\s*\+/);
    }
  });

  it("keeps the three small steps fixed and the three large ones fluid", () => {
    /* Captions, labels, years and counts are already at the floor of what is
       readable, and a caption that grows with the window is not a caption that
       got better — it is one that stopped being quiet. Growth is spent on the
       three steps that carry the name, the titles and the prose. */
    for (const step of ["2xs", "xs", "sm"]) {
      expect(declaration(step), step).toMatch(/^[\d.]+rem$/);
    }
    for (const step of ["base", "lg", "xl"]) {
      expect(declaration(step), step).toMatch(/^clamp\(/);
    }
  });

  it("declares no root font size, so the browser's own text size is honoured", () => {
    const html = css.match(/\bhtml\s*\{([^}]*)\}/)![1];
    expect(html).not.toMatch(/font-size/);
  });

  it("exposes the steps to Tailwind", () => {
    for (const step of STEPS) {
      expect(css).toContain(`--text-${step}: var(--text-${step})`);
    }
  });

  it("leaves no arbitrary font size in the surfaces it governs", () => {
    /* The defect this was written against: nine sizes chosen per component, so
       nothing could be louder than anything else on purpose. A size smuggled in
       as px, em, a viewport unit or a clamp() of its own is the same defect
       wearing a different unit. Colour and other non-length arbitraries are not
       font sizes and are not caught. */
    const offenders: string[] = [];
    for (const file of GOVERNED) {
      const source = readFileSync(resolve(root, file), "utf8");
      for (const [match] of source.matchAll(
        /text-\[(?:clamp\(|[\d.]+(?:rem|px|em|ch|vw|vh|vmin|vmax|pt))/g,
      )) {
        offenders.push(`${file}: ${match}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
