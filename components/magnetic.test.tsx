import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MAGNET_MAX, MAGNET_STRENGTH, Magnetic, magnetOffset } from "./magnetic";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

/* The pointer query is read straight from lib/use-media-query rather than
   through lib/motion, so it is mocked at its own seam. Same reason the other
   component tests mock useReducedMotion there: jsdom has no real matchMedia
   to answer differently per query. */
const fine = vi.hoisted(() => ({ value: true }));
vi.mock("@/lib/use-media-query", () => ({
  useMediaQuery: (query: string) => (query.includes("pointer: fine") ? fine.value : false),
}));

const rect = { left: 100, top: 100, width: 100, height: 40 };

describe("magnetOffset", () => {
  it("leans toward the pointer, scaled down from the distance to the centre", () => {
    // 10px right of centre (150), 4px below it (120) — both inside the clamp,
    // so what is asserted here is the scaling and nothing else.
    expect(magnetOffset(rect, 160, 124)).toEqual({
      x: 10 * MAGNET_STRENGTH,
      y: 4 * MAGNET_STRENGTH,
    });
  });

  it("does not lean at all from dead centre", () => {
    expect(magnetOffset(rect, 150, 120)).toEqual({ x: 0, y: 0 });
  });

  it("clamps in both directions, so the lean never becomes a move", () => {
    expect(magnetOffset(rect, 9000, 9000)).toEqual({ x: MAGNET_MAX, y: MAGNET_MAX });
    expect(magnetOffset(rect, -9000, -9000)).toEqual({ x: -MAGNET_MAX, y: -MAGNET_MAX });
  });
});

describe("Magnetic", () => {
  beforeEach(() => {
    reduced.value = false;
    fine.value = true;
  });

  it("wraps the child on a fine pointer", () => {
    render(
      <Magnetic>
        <button type="button">Work</button>
      </Magnetic>,
    );
    expect(screen.getByRole("button", { name: "Work" }).closest("[data-magnetic]")).not.toBeNull();
  });

  describe("when the visitor has asked for less motion", () => {
    beforeEach(() => {
      reduced.value = true;
    });
    afterEach(() => {
      reduced.value = false;
    });

    it("returns the child completely untouched — not a smaller magnet", () => {
      const { container } = render(
        <Magnetic>
          <button type="button">Work</button>
        </Magnetic>,
      );
      expect(container.querySelector("[data-magnetic]")).toBeNull();
      expect(container.firstChild).toBe(screen.getByRole("button", { name: "Work" }));
    });
  });

  describe("on a pointer that cannot hover", () => {
    beforeEach(() => {
      fine.value = false;
    });
    afterEach(() => {
      fine.value = true;
    });

    it("returns the child completely untouched", () => {
      const { container } = render(
        <Magnetic>
          <button type="button">Work</button>
        </Magnetic>,
      );
      expect(container.querySelector("[data-magnetic]")).toBeNull();
      expect(container.firstChild).toBe(screen.getByRole("button", { name: "Work" }));
    });
  });
});
