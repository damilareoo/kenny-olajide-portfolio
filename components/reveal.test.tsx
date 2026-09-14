import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal, RevealLines } from "./reveal";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

// jsdom has no IntersectionObserver; `Reveal`'s whileInView needs one to mount
// at all. This stubs the browser API the test environment is missing rather
// than changing Reveal's real behaviour to avoid using it.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

describe("Reveal", () => {
  it("renders its children as real text, animated or not", () => {
    render(<Reveal>Kenny Olajide</Reveal>);
    expect(screen.getByText("Kenny Olajide")).toBeInTheDocument();
  });

  it("puts each line in its own clipping frame so the mask reads per line", () => {
    const { container } = render(<RevealLines lines={["one", "two"]} />);
    expect(container.querySelectorAll(".overflow-hidden")).toHaveLength(2);
  });

  /* These two are a pair, and the second is what makes the first mean
     anything. Asserting only that the text is present would pass even if the
     reduced branch were deleted outright — motion.span renders its children as
     real text too. The observable difference is the inline transform that
     `initial={{ y: "110%" }}` writes: the animated branch has one, the plain
     span does not. */
  it("renders plain, untransformed spans when motion is reduced", () => {
    reduced.value = true;
    render(<RevealLines lines={["alpha", "beta"]} />);
    for (const word of ["alpha", "beta"]) {
      const el = screen.getByText(word);
      expect(el).toBeInTheDocument();
      expect(el.getAttribute("style") ?? "").not.toMatch(/transform|translate/);
    }
    reduced.value = false;
  });

  it("does write a transform when motion is not reduced", () => {
    reduced.value = false;
    render(<RevealLines lines={["gamma"]} />);
    expect(screen.getByText("gamma").getAttribute("style") ?? "").toMatch(
      /transform|translate/,
    );
  });
});
