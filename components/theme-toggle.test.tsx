import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
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
});
