import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Ladder } from "./ladder";
import { roles } from "@/data/experience";

// jsdom has no window.matchMedia; Reveal reaches it through lib/motion, so it
// is mocked at that seam rather than polyfilling matchMedia — same pattern as
// nav.test.tsx and theme-control.test.tsx. Reduced motion is exercised
// directly by reveal.test.tsx; this file only needs Ladder's own content and
// order to render, which reduced motion's early return still gives it.
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => true,
}));

describe("Ladder", () => {
  it("renders every role from data/experience.ts, in the order the data gives", () => {
    render(<Ladder />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(roles.length);
    roles.forEach((r, i) => {
      expect(items[i]).toHaveTextContent(`${r.role}, ${r.company}`);
      expect(items[i]).toHaveTextContent(`${r.from}–${r.to}`);
    });
  });

  it("carries no measuring device", () => {
    const { container } = render(<Ladder />);
    expect(container.innerHTML).not.toMatch(/ruler|tick|gauge/i);
  });
});
