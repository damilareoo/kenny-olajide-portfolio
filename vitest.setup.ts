import "@testing-library/jest-dom/vitest";

/* jsdom implements no matchMedia, and this site reads three of them —
   reduced motion, the pointer type, and the breakpoints — through
   useSyncExternalStore. Without a stub every component that reaches one
   throws on render, which would mean no test could render the footer or the
   nav without first mocking a seam it has no opinion about.

   It answers `false` to everything, which is the honest default for a
   headless run: no reduced-motion preference, no fine pointer, no wide
   viewport. A test that cares about one of those still mocks it at the seam
   (`@/lib/motion`, `@/lib/use-media-query`) the way nav, boot-screen and
   theme-control already do — this only stops the throw. */
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      media: query,
      matches: false,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

/* Nor does jsdom implement IntersectionObserver, which is what motion's
   viewport features (`whileInView`, `onViewportEnter`) construct on mount. A
   component that counts up when it scrolls into view would otherwise throw on
   render in every test that renders the page it sits on.

   This stub observes nothing: it records the callback and never calls it, so
   in a headless run nothing is ever "in view". That is the honest answer for a
   document with no layout and no scrolling — and it means a test asserting the
   pre-animation state is asserting what a visitor who has not scrolled there
   yet actually sees. */
class NoLayoutIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = NoLayoutIntersectionObserver;
}
