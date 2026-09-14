import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import WorkIndex from "./page";
import { recordedCards } from "@/lib/app-store";

/* Same substitution as app/page.test.tsx: readAppStore is a real network
   fetch to Apple's lookup endpoint, and this file only cares what the index
   renders around a card, not the fetch/merge logic lib/app-store.test.ts
   already owns. */
vi.mock("@/lib/app-store", async (orig) => ({
  ...(await orig<typeof import("@/lib/app-store")>()),
  readAppStore: async () => recordedCards(),
}));

vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => true,
}));

describe("the work index", () => {
  it("has exactly one h1, distinct from its kicker label", async () => {
    render(await WorkIndex());
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Selected work");
  });
});
