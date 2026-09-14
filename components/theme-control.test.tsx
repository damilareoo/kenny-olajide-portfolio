import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeControl } from "./theme-control";

const setThemeMock = vi.fn();
const themeState = vi.hoisted(() => ({
  theme: "light" as string | undefined,
  resolvedTheme: "light" as string | undefined,
  systemTheme: "light" as string | undefined,
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: themeState.theme,
    setTheme: setThemeMock,
    resolvedTheme: themeState.resolvedTheme,
    systemTheme: themeState.systemTheme,
  }),
}));

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("@/lib/motion", async (orig) => ({
  ...(await orig<typeof import("@/lib/motion")>()),
  useReducedMotion: () => reduced.value,
}));

/* Same stubbing approach as work-card.test.tsx: a layoutId produces no
   observable difference in jsdom, so motion/react is stubbed to forward
   whatever layoutId it was handed onto a data-layout-id attribute — a
   faithful, DOM-observable proxy for whether the component decided to hand
   motion an id at all. */
type StubbedMotionProps<T> = React.PropsWithChildren<{ layoutId?: string; transition?: unknown }> & T;

vi.mock("motion/react", () => ({
  motion: {
    span: ({ layoutId, children, ...rest }: StubbedMotionProps<React.HTMLAttributes<HTMLSpanElement>>) => {
      delete rest.transition;
      return (
        <span data-layout-id={layoutId} {...rest}>
          {children}
        </span>
      );
    },
  },
}));

describe("ThemeControl", () => {
  beforeEach(() => {
    setThemeMock.mockClear();
    themeState.theme = "light";
    themeState.resolvedTheme = "light";
    themeState.systemTheme = "light";
  });

  it("renders three radios", () => {
    render(<ThemeControl />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    for (const name of ["Light", "System", "Dark"]) {
      expect(screen.getByRole("radio", { name })).toBeInTheDocument();
    }
  });

  it("marks the active mode's radio checked and leaves the others unchecked", () => {
    render(<ThemeControl />);
    expect(screen.getByRole("radio", { name: "Light" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "System" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: "Dark" })).toHaveAttribute("aria-checked", "false");
  });

  it("calls setTheme with the clicked segment's value", () => {
    render(<ThemeControl />);
    fireEvent.click(screen.getByRole("radio", { name: "Dark" }));
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("is a real radiogroup, reachable and readable without a pointer", () => {
    render(<ThemeControl />);
    expect(screen.getByRole("radiogroup", { name: "Colour theme" })).toBeInTheDocument();
  });

  describe("the sliding thumb's layoutId", () => {
    it("is handed to motion for the active segment when motion is not reduced", () => {
      reduced.value = false;
      render(<ThemeControl />);
      const thumb = screen.getByRole("radio", { name: "Light" }).querySelector("[data-layout-id]");
      expect(thumb).toHaveAttribute("data-layout-id", "theme-thumb");
    });

    it("is withheld under reduced motion — the id IS the animation", () => {
      reduced.value = true;
      const { container } = render(<ThemeControl />);
      expect(container.querySelector("[data-layout-id]")).toBeNull();
      reduced.value = false;
    });
  });

  describe("the circular View Transitions reveal", () => {
    const startViewTransition = vi.fn((run: () => void) => {
      run();
      return { ready: Promise.resolve() } as unknown as ViewTransition;
    });

    beforeEach(() => {
      startViewTransition.mockClear();
      document.startViewTransition = startViewTransition;
      // jsdom implements neither the View Transitions API nor Element.animate;
      // both are stubbed here rather than left to throw once the reveal's
      // promise chain resolves.
      document.documentElement.animate = vi.fn() as unknown as Element["animate"];
    });

    afterEach(() => {
      // @ts-expect-error restore jsdom's actual lack of the View Transitions API
      delete document.startViewTransition;
      // @ts-expect-error restore jsdom's actual lack of Element.animate
      delete document.documentElement.animate;
    });

    it("fires when the click changes the resolved theme", () => {
      render(<ThemeControl />);
      fireEvent.click(screen.getByRole("radio", { name: "Dark" }));

      expect(setThemeMock).toHaveBeenCalledWith("dark");
      expect(startViewTransition).toHaveBeenCalledTimes(1);
    });

    it("does not fire when the click leaves the resolved theme unchanged", () => {
      // theme is "light" and the OS (systemTheme) is also "light", so picking
      // "system" changes the stored choice but not what is painted.
      render(<ThemeControl />);
      fireEvent.click(screen.getByRole("radio", { name: "System" }));

      expect(setThemeMock).toHaveBeenCalledWith("system");
      expect(startViewTransition).not.toHaveBeenCalled();
    });

    it("still changes the theme under reduced motion, but skips the reveal entirely", () => {
      reduced.value = true;
      render(<ThemeControl />);
      fireEvent.click(screen.getByRole("radio", { name: "Dark" }));

      expect(setThemeMock).toHaveBeenCalledWith("dark");
      expect(startViewTransition).not.toHaveBeenCalled();
      reduced.value = false;
    });
  });
});
