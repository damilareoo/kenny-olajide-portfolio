import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BootScreen, BOOT_KEY } from "./boot-screen";

vi.mock("@/lib/use-mounted", () => ({ useMounted: () => true }));

// jsdom has no window.matchMedia; useReducedMotion reaches it through
// lib/motion, so it is mocked at that seam rather than polyfilling
// matchMedia — same pattern as nav.test.tsx and theme-control.test.tsx.
const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

describe("BootScreen", () => {
  beforeEach(() => sessionStorage.clear());

  it("uses one session key, spelled the same everywhere", () => {
    expect(BOOT_KEY).toBe("ko:booted");
  });

  it("plays on a fresh session", () => {
    render(<BootScreen />);
    expect(screen.getByTestId("boot")).toBeInTheDocument();
  });

  it("does not play again once the session has seen it", () => {
    sessionStorage.setItem(BOOT_KEY, "1");
    render(<BootScreen />);
    expect(screen.queryByTestId("boot")).toBeNull();
  });

  it("is hidden from assistive tech — it carries no information", () => {
    render(<BootScreen />);
    expect(screen.getByTestId("boot")).toHaveAttribute("aria-hidden", "true");
  });

  describe("when the visitor has asked for less motion", () => {
    beforeEach(() => {
      reduced.value = true;
    });

    afterEach(() => {
      reduced.value = false;
    });

    it("does not play at all — it marks the session seen and renders the final frame (nothing)", () => {
      render(<BootScreen />);
      expect(screen.queryByTestId("boot")).toBeNull();
      expect(sessionStorage.getItem(BOOT_KEY)).toBe("1");
    });
  });
});
