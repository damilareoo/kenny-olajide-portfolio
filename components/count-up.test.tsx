import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountUp } from "./count-up";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

const mounted = vi.hoisted(() => ({ value: true }));
vi.mock("@/lib/use-mounted", () => ({ useMounted: () => mounted.value }));

describe("CountUp", () => {
  beforeEach(() => {
    reduced.value = false;
    mounted.value = true;
  });

  it("carries the settled value on the element in every branch", () => {
    const { container } = render(<CountUp value={30} />);
    expect(container.firstChild).toHaveAttribute("data-count-up", "30");
  });

  describe("before hydration — which is what a no-JS visitor keeps", () => {
    beforeEach(() => {
      mounted.value = false;
    });
    afterEach(() => {
      mounted.value = true;
    });

    it("prints the real figure, not the animation's first frame", () => {
      render(<CountUp value={30} />);
      expect(screen.getByText("30")).toBeInTheDocument();
    });
  });

  describe("when the visitor has asked for less motion", () => {
    beforeEach(() => {
      reduced.value = true;
    });
    afterEach(() => {
      reduced.value = false;
    });

    it("renders the final value immediately — the end state, not a faster count", () => {
      const { container } = render(<CountUp value={30} />);
      expect(screen.getByText("30")).toBeInTheDocument();
      // A plain span: no motion element, so nothing can animate at all.
      expect(container.firstChild).toHaveAttribute("data-count-up", "30");
      expect((container.firstChild as HTMLElement).tagName).toBe("SPAN");
    });
  });
});
