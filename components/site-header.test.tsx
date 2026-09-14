import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next-themes", () => ({ useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }) }));

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

/* jsdom's window.scrollY is a plain own-value property (not a getter), so it
   can be overwritten directly with Object.defineProperty rather than needing
   a spy. `render` here is a plain client render, not a hydration — React
   reads useSyncExternalStore's client getSnapshot directly on mount, so
   setting scrollY before render is enough to drive the hook's initial value
   without needing to dispatch a scroll event afterward. */
function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", { value, configurable: true, writable: true });
}

afterEach(() => {
  setScrollY(0);
  reduced.value = false;
});

describe("SiteHeader", () => {
  it("renders the full wordmark at scroll 0", () => {
    setScrollY(0);
    render(<SiteHeader />);
    expect(screen.getByText("Kenny Olajide")).toBeInTheDocument();
  });

  it("condenses the wordmark to initials past the threshold", () => {
    setScrollY(200);
    render(<SiteHeader />);
    expect(screen.getByText("KO")).toBeInTheDocument();
    expect(screen.queryByText("Kenny Olajide")).not.toBeInTheDocument();
  });

  it("keeps the accessible name intact on the condensed wordmark", () => {
    setScrollY(200);
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Kenny Olajide" })).toBeInTheDocument();
  });

  it("carries the nav links in both the full and condensed state", () => {
    setScrollY(0);
    const { unmount } = render(<SiteHeader />);
    for (const name of ["Work", "Writing", "About"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
    unmount();

    setScrollY(200);
    render(<SiteHeader />);
    for (const name of ["Work", "Writing", "About"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("renders the condensed state statically, with no transition classes, under reduced motion", () => {
    reduced.value = true;
    setScrollY(200);
    render(<SiteHeader />);
    expect(screen.getByRole("banner").className).not.toMatch(/transition/);
  });

  it("carries no measuring device", () => {
    // Word-bounded: "sticky" (positioning) legitimately contains "tick" as a
    // substring and must not trip this guard.
    setScrollY(200);
    const { container } = render(<SiteHeader />);
    expect(container.innerHTML).not.toMatch(/\bruler\b|\btick\b|\bprogress\b/i);
  });
});
