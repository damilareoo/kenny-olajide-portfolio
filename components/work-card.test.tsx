import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkCard } from "./work-card";
import { findWork } from "@/data/work";
import { recordedCards } from "@/lib/app-store";

const item = findWork("chessever")!;
const card = recordedCards()["chessever"];

describe("WorkCard", () => {
  it("titles the piece with the site's name for it, not Apple's listing name", () => {
    // data/work.ts calls it "ChessEver"; the listing files it as
    // "ChessEver: Follow Live Chess". Both are right; the site uses its own.
    render(<WorkCard item={item} card={card} />);
    expect(screen.getByRole("heading", { name: "ChessEver" })).toBeInTheDocument();
  });

  it("links the whole piece to its case page", () => {
    render(<WorkCard item={item} card={card} />);
    expect(screen.getByRole("link", { name: /ChessEver/ })).toHaveAttribute("href", "/work/chessever");
  });

  it("prints the year and the role", () => {
    render(<WorkCard item={item} card={card} />);
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText(item.role)).toBeInTheDocument();
  });
});
