import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chip, Label, RecordRow } from "./ui";

describe("primitives", () => {
  it("sets a label in the one micro-label style", () => {
    render(<Label>Selected work</Label>);
    expect(screen.getByText("Selected work")).toHaveClass("label");
  });

  it("renders a record row as a term and its definition", () => {
    render(<dl><RecordRow label="Year" value="2026" /></dl>);
    expect(screen.getByText("Year").tagName).toBe("DT");
    expect(screen.getByText("2026").tagName).toBe("DD");
  });

  it("links a record row's value out when given an href", () => {
    render(<dl><RecordRow label="Store" value="App Store" href="https://apps.apple.com" /></dl>);
    expect(screen.getByRole("link", { name: "App Store" })).toHaveAttribute("href", "https://apps.apple.com");
  });

  it("puts a chip on the translucent fill", () => {
    render(<Chip>Games</Chip>);
    expect(screen.getByText("Games").className).toMatch(/bg-chip/);
  });
});
