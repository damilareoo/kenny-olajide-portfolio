import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";
import { recordedCards } from "@/lib/app-store";
import { roles } from "@/data/experience";
import { site } from "@/data/site";

/* readAppStore does a real network fetch to Apple's lookup endpoint. This
   file only cares what the home renders around a card, not the fetch/merge
   logic itself — lib/app-store.test.ts already owns that — so the network
   call is replaced with the same recordedCards() floor work-card.test.tsx
   renders from. */
vi.mock("@/lib/app-store", async (orig) => ({
  ...(await orig<typeof import("@/lib/app-store")>()),
  readAppStore: async () => recordedCards(),
}));

// jsdom has no window.matchMedia; every reveal on this page reaches it
// through lib/motion — same pattern as nav.test.tsx. Reduced motion renders
// each block's final frame outright, which is all this file needs.
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => true,
}));

describe("Home", () => {
  it("names Kenny as the page's one h1", async () => {
    render(await Home());
    expect(screen.getByRole("heading", { level: 1, name: site.name })).toBeInTheDocument();
  });

  it("lays out both selected pieces", async () => {
    render(await Home());
    expect(screen.getByRole("heading", { name: "Endgame AI" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "ChessEver" })).toBeInTheDocument();
  });

  it("renders every role in the ladder", async () => {
    render(await Home());
    for (const r of roles) {
      expect(screen.getByText(`${r.role}, ${r.company}`)).toBeInTheDocument();
    }
  });

  it("links out to writing posts", async () => {
    render(await Home());
    const links = screen.getAllByRole("link").filter((l) => l.getAttribute("href")?.startsWith("/writing/"));
    expect(links.length).toBeGreaterThan(0);
  });

  it("carries no measuring device", async () => {
    const { container } = render(await Home());
    expect(container.innerHTML).not.toMatch(/ruler|tick|gauge/i);
  });
});
