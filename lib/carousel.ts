/**
 * The arithmetic behind the screenshot carousel, with no DOM in it.
 *
 * All of it is separated from the component on purpose. Snap selection and
 * inertia projection are exactly the parts that are wrong in subtle ways — a
 * tie that advances a frame it should not, a throw that overshoots the last
 * item — and those are unreadable in a browser and obvious in a test.
 *
 * Offsets are negative-leftward, matching a translateX on the track.
 */

/** One resting offset per item. */
export function snapPoints(count: number, itemWidth: number, gap: number): number[] {
  return Array.from({ length: count }, (_, i) => -(i * (itemWidth + gap)));
}

/**
 * The point an offset should settle on.
 *
 * A strict `<` on the comparison is what breaks an exact tie toward the
 * earlier point: a drag stopped precisely halfway has not committed to the
 * next item, so it returns to the one it came from.
 */
export function nearestSnap(offset: number, points: number[]): number {
  if (points.length === 0) return 0;
  return points.reduce((best, p) => (Math.abs(p - offset) < Math.abs(best - offset) ? p : best));
}

/**
 * Where a flick would come to rest if nothing stopped it.
 *
 * A one-term exponential projection: the throw is proportional to the release
 * velocity. `decay` is in seconds and 0.2 matches the feel of the platform
 * scrollers this sits beside.
 */
export function projectedOffset(offset: number, velocity: number, decay = 0.2): number {
  return offset + velocity * decay;
}

/** How far the track may travel: exactly its overflow, and zero if it fits. */
export function dragBounds(
  count: number,
  itemWidth: number,
  gap: number,
  viewport: number,
): { left: number; right: number } {
  const content = count * itemWidth + Math.max(0, count - 1) * gap;
  return { left: Math.min(0, viewport - content), right: 0 };
}
