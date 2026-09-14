import Link from "next/link";

export type Crumb = { label: string; href: string };

/**
 * `Work / ChessEver` and `Writing / <post>` — the "where am I / what does
 * this sit inside" a case or post page gave no answer to before this.
 *
 * An ordered list because a trail is an order, not a bag of links. The last
 * crumb is the page the visitor is already on: it renders as plain text with
 * `aria-current="page"` rather than a link to itself, the same rule
 * `components/nav.tsx` already applies to the active section.
 */
export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-text-3 flex items-center gap-2 text-[length:var(--text-sm)]">
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {last ? (
                <span aria-current="page" className="text-text-1">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-text-1 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
