import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkCard } from "./work-card";
import { findWork } from "@/data/work";
import { recordedCards } from "@/lib/app-store";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

/**
 * A `layoutId` produces no observable difference in jsdom: rendering a bare
 * `motion.div` with and without one yields byte-identical HTML, because the
 * FLIP machinery it drives depends on real layout measurement that jsdom does
 * not perform. Confirmed by hand before writing this file — a test asserting
 * on `motion.div`'s real DOM output here would pass whether or not
 * `work-card.tsx`'s `layout()` conditional existed at all, which is exactly
 * the shape of tautological test this project has already been bitten by
 * once (see lib/motion.test.ts's reduced-motion fix).
 *
 * So `motion/react` itself is stubbed for this file: `motion.div`/`motion.h2`
 * are replaced with components that render a real DOM node and forward
 * whatever `layoutId` they were handed onto a `data-layout-id` attribute.
 * React drops an attribute whose value is `undefined` entirely, so that
 * attribute's presence or absence is a faithful, DOM-observable proxy for
 * whether `WorkCard` decided to hand motion an id at all — which is precisely
 * the decision `layout()` makes.
 */
type StubbedMotionProps<T> = React.PropsWithChildren<{ layoutId?: string; transition?: unknown }> & T;

vi.mock("motion/react", () => ({
  motion: {
    div: ({ layoutId, children, ...rest }: StubbedMotionProps<React.HTMLAttributes<HTMLDivElement>>) => {
      delete rest.transition;
      return (
        <div data-layout-id={layoutId} {...rest}>
          {children}
        </div>
      );
    },
    h2: ({ layoutId, children, ...rest }: StubbedMotionProps<React.HTMLAttributes<HTMLHeadingElement>>) => {
      delete rest.transition;
      return (
        <h2 data-layout-id={layoutId} {...rest}>
          {children}
        </h2>
      );
    },
  },
}));

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

describe("WorkCard's shared-element layoutId, under reduced motion", () => {
  it("hands motion a layoutId for the icon and title when motion is not reduced", () => {
    reduced.value = false;
    const { container } = render(<WorkCard item={item} card={card} />);
    expect(screen.getByRole("heading", { name: "ChessEver" })).toHaveAttribute(
      "data-layout-id",
      "title-chessever",
    );
    // The icon's motion.div is the header's first child — the fan below also
    // renders `alt=""` images, so this targets the header specifically rather
    // than risking a match against one of those.
    const iconWrapper = container.querySelector("header > div:first-child");
    expect(iconWrapper).toHaveAttribute("data-layout-id", "icon-chessever");
  });

  it("withholds the layoutId under reduced motion, so a case page reusing the same id has nothing to match and renders its final frame outright", () => {
    reduced.value = true;
    const { container } = render(<WorkCard item={item} card={card} />);
    expect(screen.getByRole("heading", { name: "ChessEver" })).not.toHaveAttribute("data-layout-id");
    // The icon wrapper still renders — reduced motion withholds the id, not
    // the element — but carries no id to match against the case page's.
    const iconWrapper = container.querySelector("header > div:first-child");
    expect(iconWrapper).not.toHaveAttribute("data-layout-id");
    reduced.value = false;
  });
});
