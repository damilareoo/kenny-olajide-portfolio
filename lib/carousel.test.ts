import { describe, expect, it } from "vitest";
import { dragBounds, nearestSnap, projectedOffset, snapPoints } from "./carousel";

describe("snapPoints", () => {
  it("puts one point per item, counting leftward from zero", () => {
    expect(snapPoints(4, 300, 20)).toEqual([-0, -320, -640, -960]);
  });

  it("returns a single resting point for a single item", () => {
    expect(snapPoints(1, 300, 20)).toEqual([-0]);
  });

  it("returns nothing to snap to when there is nothing to show", () => {
    expect(snapPoints(0, 300, 20)).toEqual([]);
  });
});

describe("nearestSnap", () => {
  const points = snapPoints(4, 300, 20);

  it("lands on the closest point", () => {
    expect(nearestSnap(-330, points)).toBe(-320);
    expect(nearestSnap(-500, points)).toBe(-640);
  });

  it("breaks an exact tie toward the earlier point, so a half-drag does not advance", () => {
    expect(nearestSnap(-160, points)).toBe(-0);
  });

  it("clamps past either end rather than running off", () => {
    expect(nearestSnap(400, points)).toBe(-0);
    expect(nearestSnap(-5000, points)).toBe(-960);
  });
});

describe("projectedOffset", () => {
  it("carries a flick onward in its own direction", () => {
    expect(projectedOffset(-100, -800)).toBeLessThan(-100);
    expect(projectedOffset(-100, 800)).toBeGreaterThan(-100);
  });

  it("stays put when the finger was not moving", () => {
    expect(projectedOffset(-320, 0)).toBe(-320);
  });

  it("scales the throw with the decay constant", () => {
    expect(projectedOffset(0, -1000, 0.2)).toBeCloseTo(-200, 5);
  });
});

describe("dragBounds", () => {
  it("allows exactly the overflow and no more", () => {
    // 4 x 300 + 3 x 20 = 1260 of content in an 800 viewport: 460 of travel.
    expect(dragBounds(4, 300, 20, 800)).toEqual({ left: -460, right: 0 });
  });

  it("refuses to drag when everything already fits", () => {
    expect(dragBounds(2, 300, 20, 900)).toEqual({ left: 0, right: 0 });
  });
});
