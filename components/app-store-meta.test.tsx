import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppStoreMeta } from "./app-store-meta";
import { recordedCards } from "@/lib/app-store";

const card = recordedCards()["endgame-ai"];

describe("AppStoreMeta", () => {
  it("rounds the rating to one place, because two is false precision on 30 votes", () => {
    render(<AppStoreMeta card={card} />);
    expect(screen.getByText("4.7")).toBeInTheDocument();
  });

  it("says how many ratings the average is over", () => {
    render(<AppStoreMeta card={card} />);
    expect(screen.getByText(/30 ratings/)).toBeInTheDocument();
  });

  it("links out to the listing", () => {
    render(<AppStoreMeta card={card} />);
    expect(screen.getByRole("link", { name: /App Store/i })).toHaveAttribute("href", card.storeUrl);
  });

  it("rides its provenance on the element so the degraded path can be verified", () => {
    const { container } = render(<AppStoreMeta card={card} />);
    expect(container.firstChild).toHaveAttribute("data-source", "recorded");
  });
});
