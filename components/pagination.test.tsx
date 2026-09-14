import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { adjacent, Pagination } from "./pagination";

const items = [
  { title: "One", href: "/work/one" },
  { title: "Two", href: "/work/two" },
  { title: "Three", href: "/work/three" },
];

describe("adjacent", () => {
  it("gives a middle item its plain, in-order neighbours", () => {
    expect(adjacent(items, 1)).toEqual({ prev: items[0], next: items[2] });
  });

  it("wraps the first item's previous to the last item", () => {
    expect(adjacent(items, 0).prev).toEqual(items[2]);
  });

  it("wraps the last item's next to the first item", () => {
    expect(adjacent(items, items.length - 1).next).toEqual(items[0]);
  });
});

describe("Pagination", () => {
  it("renders both the previous and next piece as links to their own page", () => {
    const { prev, next } = adjacent(items, 1);
    render(<Pagination prev={prev} next={next} />);
    expect(screen.getByRole("link", { name: /One/ })).toHaveAttribute("href", "/work/one");
    expect(screen.getByRole("link", { name: /Three/ })).toHaveAttribute("href", "/work/three");
  });

  it("labels the pair as a pagination landmark", () => {
    const { prev, next } = adjacent(items, 1);
    render(<Pagination prev={prev} next={next} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });
});
