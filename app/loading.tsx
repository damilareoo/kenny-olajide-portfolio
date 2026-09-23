/**
 * What a route looks like while it is on its way.
 *
 * A skeleton in the site's own shimmer — a pill where the menu sits, three
 * text lines where the words will be — rather than the matrix bar that stood
 * here. Two reasons: a navigation has no progress to read (no percentage is
 * printed, because none exists), and a loading state that shows before
 * hydration should not need JavaScript to say anything. Pure CSS, so it
 * paints on the first frame; the reduced-motion blanket stills the pulse.
 */
export default function Loading() {
  return (
    <div
      className="mx-auto w-full max-w-[1240px] px-5 py-4 sm:px-6"
      role="status"
      aria-label="Loading"
    >
      <div className="flex items-center justify-end">
        <span aria-hidden className="media-shimmer h-8 w-24 rounded-full" />
      </div>
      <div className="mt-8 max-w-[52ch] space-y-3" aria-hidden>
        <span className="media-shimmer block h-4 w-3/4 rounded-[4px]" />
        <span className="media-shimmer block h-4 w-full rounded-[4px]" />
        <span className="media-shimmer block h-4 w-2/3 rounded-[4px]" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
