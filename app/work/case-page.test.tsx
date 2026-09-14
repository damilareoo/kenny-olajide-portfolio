import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CasePage from "./[slug]/page";

/**
 * A fixture item with no `role` alongside the two real ones, so this file can
 * assert the Record's omission behaviour without touching data/work.ts. That
 * file's two real items both carry a role today — Endgame's is expected to
 * lose its role once the owner's confirmation lands (see data/experience.ts's
 * own comment) — so the negative case needs its own fixture rather than
 * waiting on that edit.
 */
const items = vi.hoisted(() => [
  {
    slug: "chessever",
    title: "ChessEver",
    year: "2025",
    role: "0–1 Product Experience",
    summary: "Follow professional chess tournaments live, across web and iOS, built from nothing.",
    body: ["First paragraph.", "Second paragraph."],
  },
  {
    slug: "no-role",
    title: "No Role Case",
    year: "2026",
    summary: "A fixture case whose role has not been confirmed.",
    body: ["A body paragraph."],
  },
]);

vi.mock("@/data/work", () => ({
  work: items,
  findWork: (slug: string) => items.find((i) => i.slug === slug),
}));

const card = vi.hoisted(() => ({
  slug: "no-role",
  storeUrl: "https://apps.apple.com/us/app/x/id1",
  name: "No Role Case",
  seller: "Seller",
  genre: "Games",
  rating: 4.5,
  ratingCount: 10,
  icon: "/apps/x/icon.jpg",
  shots: ["/apps/x/01.jpg"],
  shotRatio: "1/1",
  source: "recorded" as const,
}));

vi.mock("@/lib/app-store", () => ({
  readAppStore: async () => ({ chessever: card, "no-role": card }),
}));

vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => true,
}));

// jsdom has no ResizeObserver; ShotCarousel's non-reduced branch would need
// one, but useReducedMotion is stubbed true above so that branch never
// mounts here — this is only a safety net if that ever changes.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

describe("the case page's Record rail", () => {
  it("prints the Role row when the work item carries one", async () => {
    render(await CasePage({ params: Promise.resolve({ slug: "chessever" }) }));
    expect(screen.getByText("Role")).toBeInTheDocument();
  });

  it("omits the Role row rather than asserting one when item.role is undefined", async () => {
    render(await CasePage({ params: Promise.resolve({ slug: "no-role" }) }));
    expect(screen.queryByText("Role")).not.toBeInTheDocument();
    // The rest of the Record still renders — this is a targeted omission,
    // not a broken rail.
    expect(screen.getByText("Year")).toBeInTheDocument();
  });

  it("carries the breadcrumb naming Work and the piece itself", async () => {
    render(await CasePage({ params: Promise.resolve({ slug: "chessever" }) }));
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/work");
  });

  it("carries pagination to the other piece", async () => {
    render(await CasePage({ params: Promise.resolve({ slug: "chessever" }) }));
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    // With exactly two fixture items, both previous and next wrap to the
    // other one — that is adjacent()'s own correct wrap-around behaviour
    // (see components/pagination.test.tsx), not a bug in this page.
    const links = screen.getAllByRole("link", { name: /No Role Case/ });
    expect(links).toHaveLength(2);
    for (const link of links) expect(link).toHaveAttribute("href", "/work/no-role");
  });
});
