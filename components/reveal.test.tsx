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

  it("still renders every line when motion is reduced", () => {
    reduced.value = true;
    render(<RevealLines lines={["alpha", "beta"]} />);
    expect(screen.getByText("alpha")).toBeInTheDocument();
    expect(screen.getByText("beta")).toBeInTheDocument();
    reduced.value = false;
  });
});
