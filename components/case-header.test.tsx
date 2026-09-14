import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseHeader } from "./case-header";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

/**
 * Same stub as work-card.test.tsx, and for the same reason: a `layoutId`
 * produces no observable difference in jsdom, since the FLIP machinery it
 * drives depends on real layout measurement jsdom does not perform. Stubbing
 * `motion/react` to forward `layoutId` onto a `data-layout-id` attribute
 * makes its presence or absence — which is exactly what `CaseHeader`'s
 * `layout()` conditional decides — observable in the rendered DOM.
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
    h1: ({ layoutId, children, ...rest }: StubbedMotionProps<React.HTMLAttributes<HTMLHeadingElement>>) => {
      delete rest.transition;
      return (
        <h1 data-layout-id={layoutId} {...rest}>
          {children}
        </h1>
      );
    },
  },
}));

const props = { slug: "chessever", icon: "/icon.png", title: "ChessEver", summary: "Summary text." };

describe("CaseHeader", () => {
  it("renders the title and summary", () => {
    render(<CaseHeader {...props} />);
    expect(screen.getByRole("heading", { name: "ChessEver" })).toBeInTheDocument();
    expect(screen.getByText("Summary text.")).toBeInTheDocument();
  });
});

describe("CaseHeader's shared-element layoutId, under reduced motion", () => {
  it("hands motion a layoutId matching WorkCard's for the icon and title when motion is not reduced", () => {
    reduced.value = false;
    const { container } = render(<CaseHeader {...props} />);
    expect(screen.getByRole("heading", { name: "ChessEver" })).toHaveAttribute(
      "data-layout-id",
      "title-chessever",
    );
    const iconWrapper = container.querySelector("header > div:first-child");
    expect(iconWrapper).toHaveAttribute("data-layout-id", "icon-chessever");
  });

  it("withholds the layoutId under reduced motion, matching WorkCard's other half so neither side animates alone", () => {
    reduced.value = true;
    const { container } = render(<CaseHeader {...props} />);
    expect(screen.getByRole("heading", { name: "ChessEver" })).not.toHaveAttribute("data-layout-id");
    const iconWrapper = container.querySelector("header > div:first-child");
    expect(iconWrapper).not.toHaveAttribute("data-layout-id");
    reduced.value = false;
  });
});
