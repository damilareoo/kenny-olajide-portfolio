import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import WritingIndex from "./page";

vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => true,
}));

// jsdom has no IntersectionObserver; Reveal's whileInView needs one to mount
// at all, even though useReducedMotion() is stubbed to skip the animated
// branch — Reveal still calls the hook before it can decide.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

describe("the writing index", () => {
  it("has exactly one h1, distinct from each post's own h2", () => {
    render(<WritingIndex />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("All posts");
    // Each post title is still an h2, one level below the page's h1.
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(0);
  });
});
