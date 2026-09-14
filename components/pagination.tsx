import Link from "next/link";
import { Label } from "./ui";

export type Adjacent = { title: string; href: string };

/**
 * The wrapped previous/next pair for `items[index]`.
 *
 * The first item's previous is the last item, and the last item's next is
 * the first, so a case or post page always has somewhere to go rather than a
 * dead end at either edge of the list. Exported so the page that renders
 * `<Pagination />` computes the pair from its own ordered data (`data/work.ts`,
 * `data/writing.ts`) with this one arithmetic rather than each page
 * hand-rolling its own modulo.
 */
export function adjacent<T extends Adjacent>(items: T[], index: number): { prev: T; next: T } {
  const prev = items[(index - 1 + items.length) % items.length];
  const next = items[(index + 1) % items.length];
  return { prev, next };
}

/**
 * Previous and next at the foot of a case or post page — the fix for the
 * single biggest intuitiveness gap the v1 review found: today the only way
 * from one piece to another is back, then click again.
 *
 * Takes the already-resolved pair rather than the list and an index, so the
 * component itself stays a plain presentational pair of links; `adjacent()`
 * above is where the wrap-around lives.
 */
export function Pagination({ prev, next }: { prev: Adjacent; next: Adjacent }) {
  return (
    <nav aria-label="Pagination" className="border-border mt-16 grid grid-cols-2 gap-6 border-t pt-8">
      <Link href={prev.href} className="group block">
        <Label>Previous</Label>
        <p className="text-text-1 group-hover:text-text-2 mt-2 text-[length:var(--text-base)]">
          {prev.title}
        </p>
      </Link>
      <Link href={next.href} className="group block text-right">
        <Label>Next</Label>
        <p className="text-text-1 group-hover:text-text-2 mt-2 text-[length:var(--text-base)]">
          {next.title}
        </p>
      </Link>
    </nav>
  );
}
