import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumb } from "./breadcrumb";

const trail = [
  { label: "Work", href: "/work" },
  { label: "ChessEver", href: "/work/chessever" },
];

describe("Breadcrumb", () => {
  it("renders the trail in order", () => {
    render(<Breadcrumb trail={trail} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Work");
    expect(items[1]).toHaveTextContent("ChessEver");
  });

  it("carries the landmark's own label", () => {
    render(<Breadcrumb trail={trail} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("only the last crumb carries aria-current, and it is not a link", () => {
    render(<Breadcrumb trail={trail} />);
    expect(screen.getByRole("link", { name: "Work" })).not.toHaveAttribute("aria-current");
    expect(screen.queryByRole("link", { name: "ChessEver" })).not.toBeInTheDocument();
    expect(screen.getByText("ChessEver")).toHaveAttribute("aria-current", "page");
  });
});
