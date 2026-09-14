import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShotCarousel } from "./shot-carousel";
import { recordedCards } from "@/lib/app-store";
import { dragBounds, snapPoints } from "@/lib/carousel";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

/**
 * `motion/react` is stubbed for the same reason work-card.test.tsx and
 * case-header.test.tsx stub it: real drag/layout machinery depends on layout
 * measurement jsdom does not perform. Unlike those two files, this component
 * also drives a real `useMotionValue` and calls `animate()` on it — both are
 * faked here with a plain, stateful object so `x.get()` after a keydown
 * reflects whatever the component's own goTo()/step() last asked for. The
 * fake mirrors real `useMotionValue` semantics: the initial value is applied
 * once, not on every re-render, because a stateful width (via
 * ResizeObserver → setState) causes this component to re-render more than
 * once during a test and a naive mock would reset the position each time.
 */
const held = vi.hoisted(() => ({ current: 0, initialized: false }));

vi.mock("motion/react", () => {
  const value = {
    get: () => held.current,
    set: (v: number) => {
      held.current = v;
    },
  };
  return {
    useMotionValue: (init: number) => {
      if (!held.initialized) {
        held.current = init;
        held.initialized = true;
      }
      return value;
    },
    animate: (mv: { set: (v: number) => void }, target: number) => {
      mv.set(target);
      return { stop() {} };
    },
    motion: {
      // Only the plain DOM props this test cares about are forwarded — drag,
      // dragConstraints, dragElastic, dragMomentum, onDragEnd and the
      // MotionValue-carrying style are real motion/react props with no
      // business reaching a bare <div>, and naming them only to discard them
      // would just be unused-variable warnings with extra steps.
      div: (props: {
        tabIndex?: number;
        role?: string;
        "aria-label"?: string;
        onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
        className?: string;
        children?: React.ReactNode;
      }) => (
        <div
          tabIndex={props.tabIndex}
          role={props.role}
          aria-label={props["aria-label"]}
          onKeyDown={props.onKeyDown}
          className={props.className}
        >
          {props.children}
        </div>
      ),
    },
  };
});

// jsdom has no ResizeObserver; the observer fires once, synchronously, with a
// fixed viewport width so dragBounds() has real overflow to clamp against.
const VIEWPORT_WIDTH = 400;

class ResizeObserverStub {
  #cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) {
    this.#cb = cb;
  }
  observe() {
    this.#cb(
      [{ contentRect: { width: VIEWPORT_WIDTH } } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
  }
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

const card = recordedCards()["chessever"]; // 4 shots, real fixture data
const ITEM = 240;
const GAP = 16;
const points = snapPoints(card.shots.length, ITEM, GAP);
const bounds = dragBounds(card.shots.length, ITEM, GAP, VIEWPORT_WIDTH);
const clamp = (v: number) => Math.max(bounds.left, Math.min(bounds.right, v));

function track() {
  return screen.getByRole("group", { name: /screenshots/ });
}

beforeEach(() => {
  held.current = 0;
  held.initialized = false;
});

describe("ShotCarousel's keyboard path", () => {
  it("is focusable", () => {
    render(<ShotCarousel card={card} />);
    expect(track()).toHaveAttribute("tabindex", "0");
  });

  it("names the count and the arrow keys in its accessible label", () => {
    render(<ShotCarousel card={card} />);
    expect(track()).toHaveAccessibleName(`${card.name} screenshots, ${card.shots.length} of them. Use the left and right arrow keys.`);
  });

  it("moves one snap point on ArrowRight, through lib/carousel.ts's own arithmetic", () => {
    render(<ShotCarousel card={card} />);
    fireEvent.keyDown(track(), { key: "ArrowRight" });
    expect(held.current).toBe(clamp(points[1]));
  });

  it("moves back one snap point on ArrowLeft", () => {
    render(<ShotCarousel card={card} />);
    fireEvent.keyDown(track(), { key: "ArrowRight" });
    fireEvent.keyDown(track(), { key: "ArrowRight" });
    fireEvent.keyDown(track(), { key: "ArrowLeft" });
    expect(held.current).toBe(clamp(points[1]));
  });

  it("does not advance past the last point on ArrowRight", () => {
    render(<ShotCarousel card={card} />);
    for (let i = 0; i < points.length + 3; i++) fireEvent.keyDown(track(), { key: "ArrowRight" });
    expect(held.current).toBe(clamp(points[points.length - 1]));
  });

  it("does not retreat past the first point on ArrowLeft", () => {
    render(<ShotCarousel card={card} />);
    fireEvent.keyDown(track(), { key: "ArrowLeft" });
    expect(held.current).toBe(clamp(points[0]));
  });

  it("jumps to the last point on End", () => {
    render(<ShotCarousel card={card} />);
    fireEvent.keyDown(track(), { key: "End" });
    expect(held.current).toBe(clamp(points[points.length - 1]));
  });

  it("jumps back to the first point on Home", () => {
    render(<ShotCarousel card={card} />);
    fireEvent.keyDown(track(), { key: "End" });
    fireEvent.keyDown(track(), { key: "Home" });
    expect(held.current).toBe(clamp(points[0]));
  });

  it("ignores keys it does not handle", () => {
    render(<ShotCarousel card={card} />);
    fireEvent.keyDown(track(), { key: "Tab" });
    expect(held.current).toBe(0);
  });
});

describe("the visible previous/next buttons", () => {
  it("call the same step logic as the keyboard, moving one point per click", () => {
    render(<ShotCarousel card={card} />);
    fireEvent.click(screen.getByRole("button", { name: `Next ${card.name} screenshot` }));
    expect(held.current).toBe(clamp(points[1]));
    fireEvent.click(screen.getByRole("button", { name: `Previous ${card.name} screenshot` }));
    expect(held.current).toBe(clamp(points[0]));
  });

  it("are not rendered under reduced motion — that branch is a native scroller", () => {
    reduced.value = true;
    render(<ShotCarousel card={card} />);
    expect(screen.queryByRole("button", { name: /screenshot/ })).not.toBeInTheDocument();
    reduced.value = false;
  });
});
