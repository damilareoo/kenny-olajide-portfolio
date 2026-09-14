import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "./site-footer";
import { elsewhere, site } from "@/data/site";

describe("SiteFooter", () => {
  it("gives a real mailto for the site's email", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: site.email })).toHaveAttribute(
      "href",
      `mailto:${site.email}`,
    );
  });

  it("links out to every elsewhere entry", () => {
    render(<SiteFooter />);
    for (const e of elsewhere) {
      expect(screen.getByRole("link", { name: e.label })).toHaveAttribute("href", e.href);
    }
  });

  it("names Inter and the palette provenance in the colophon", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/Inter/)).toBeInTheDocument();
    expect(screen.getByText(/dejiajetomobi\.com/)).toBeInTheDocument();
    expect(screen.getByText(/jakub\.kr/)).toBeInTheDocument();
  });

  it("prints the build's commit, falling back to \"dev\" off Vercel", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/Built at dev/)).toBeInTheDocument();
  });

  it("carries no measuring device", () => {
    const { container } = render(<SiteFooter />);
    expect(container.innerHTML).not.toMatch(/ruler|tick/i);
  });
});
