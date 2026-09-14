import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "./nav";

vi.mock("next/navigation", () => ({ usePathname: () => "/work/chessever" }));
vi.mock("next-themes", () => ({ useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }) }));

// jsdom has no window.matchMedia; useReducedMotion (and ThemeToggle's own use
// of it) reach it through lib/motion, so it is mocked at that seam rather than
// polyfilling matchMedia — same pattern as theme-toggle.test.tsx.
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => false,
}));

describe("Nav", () => {
  it("links to every top-level surface", () => {
    render(<Nav />);
    for (const name of ["Work", "Writing", "About"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("marks the section containing the current page as current", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });

  it("carries no measuring device", () => {
    const { container } = render(<Nav />);
    expect(container.innerHTML).not.toMatch(/ruler|tick/i);
  });
});
