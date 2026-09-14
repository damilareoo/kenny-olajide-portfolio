import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";

const setThemeMock = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: setThemeMock }),
}));

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

describe("ThemeToggle", () => {
  it("names the theme it will switch TO, which is what the visitor is choosing", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).toHaveAccessibleName(/dark/i);
  });

  it("is a real button so it is reachable by keyboard", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button").tagName).toBe("BUTTON");
  });

  describe("when the visitor has asked for less motion", () => {
    const startViewTransition = vi.fn(
      () => ({ ready: Promise.resolve() }) as unknown as ViewTransition,
    );

    beforeEach(() => {
      reduced.value = true;
      setThemeMock.mockClear();
      startViewTransition.mockClear();
      document.startViewTransition = startViewTransition;
    });

    afterEach(() => {
      reduced.value = false;
      // @ts-expect-error restore jsdom's actual lack of the View Transitions API
      delete document.startViewTransition;
    });

    it("still changes the theme, but skips the circular reveal entirely", () => {
      render(<ThemeToggle />);
      fireEvent.click(screen.getByRole("button"));

      expect(setThemeMock).toHaveBeenCalledWith("dark");
      expect(startViewTransition).not.toHaveBeenCalled();
    });
  });
});
