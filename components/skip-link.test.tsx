import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink } from "./skip-link";

describe("SkipLink", () => {
  it("jumps to #main", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main");
  });

  it("is visually hidden until focused", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "Skip to content" }).className).toMatch(/sr-only/);
  });

  it("carries no tabindex that would pull it out of the normal tab order", () => {
    // The skip link's position as the FIRST focusable element comes from being
    // the first focusable element in the DOM (see app/layout.tsx), not from a
    // tabindex trick — a positive tabindex here would fight the browser's
    // natural order instead of relying on it.
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "Skip to content" })).not.toHaveAttribute("tabindex");
  });
});
