import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./page";
import { roles } from "@/data/experience";
import { site } from "@/data/site";

describe("About", () => {
  it("names Kenny as the page's one h1", () => {
    render(<About />);
    expect(screen.getByRole("heading", { level: 1, name: site.name })).toBeInTheDocument();
  });

  it("renders the portrait at 320x320, eager and named", () => {
    render(<About />);
    const img = screen.getByRole("img", { name: "Kenny Olajide" });
    expect(img).toHaveAttribute("width", "320");
    expect(img).toHaveAttribute("height", "320");
    // next/image marks a priority image fetchpriority="high" and drops the
    // lazy loading attribute a below-the-fold image would carry.
    expect(img).not.toHaveAttribute("loading", "lazy");
  });

  it("says the portrait is a placeholder pending a real photograph", () => {
    render(<About />);
    expect(screen.getByText(/placeholder portrait/i)).toBeInTheDocument();
  });

  it("carries no placeholder notice for the experience data, which is real", () => {
    render(<About />);
    expect(screen.queryByText(/placeholder records/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/real history to be supplied/i)).not.toBeInTheDocument();
  });

  it("renders every one of the six real roles and their company", () => {
    render(<About />);
    expect(roles).toHaveLength(6);
    for (const r of roles) {
      expect(screen.getByText(`${r.role}, ${r.company}`)).toBeInTheDocument();
    }
  });

  it("renders each role's own note where the profile gave one", () => {
    render(<About />);
    for (const r of roles.filter((r) => r.note)) {
      expect(screen.getByText(r.note!)).toBeInTheDocument();
    }
  });

  it("carries education and location as record rows", () => {
    render(<About />);
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText(site.education)).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText(site.location)).toBeInTheDocument();
  });

  it("carries the chess-to-design narrative as prose, not a list", () => {
    const { container } = render(<About />);
    expect(container.querySelector("ul")).toBeNull();
    expect(screen.getAllByRole("paragraph").length).toBeGreaterThanOrEqual(2);
  });
});
