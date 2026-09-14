/**
 * The first focusable element in `<body>`. Invisible until it holds focus, so
 * a mouse visitor never sees it and a keyboard visitor's first tab stop is a
 * jump straight to `#main` rather than the six links and controls the header
 * carries.
 *
 * `sr-only` / `focus:not-sr-only` rather than `opacity-0` or `hidden`: those
 * would either leave the link in the page invisibly (fine for sighted-keyboard
 * use but noise for a screen reader on every page) or remove it from the
 * accessibility tree outright, which defeats the point. `sr-only` clips it to
 * a 1px box off-screen — present for assistive tech, invisible for sight —
 * until focus lifts it back into the visible layout.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="focus:bg-surface focus:text-text-1 sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:border focus:border-border focus:px-4 focus:py-2 focus:text-[length:var(--text-sm)]"
    >
      Skip to content
    </a>
  );
}
