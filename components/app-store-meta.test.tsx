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

  /* The count is a CountUp now, so the figure's rendered text is whatever
     frame the animation is on. The settled value rides on the element as
     `data-count-up`, which is what this has always meant to assert — that the
     average is reported over the number of votes it was taken from. */
  it("says how many ratings the average is over", () => {
    render(<AppStoreMeta card={card} />);
    const phrase = screen.getByText(/ratings/);
    expect(phrase).toHaveTextContent("ratings");
    expect(phrase.querySelector("[data-count-up]")).toHaveAttribute(
      "data-count-up",
      String(card.ratingCount),
    );
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
