import type { ReactNode } from "react";

/** The site's one micro-label. See the .label utility in globals.css. */
export function Label({ children }: { children: ReactNode }) {
  return <span className="label">{children}</span>;
}

/** A small translucent pill. Deji's .social-link, in this site's tokens. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="bg-chip rounded text-text-2 px-2 py-1 text-[length:var(--text-xs)]">
      {children}
    </span>
  );
}

/**
 * One row of a record: label left, value right.
 *
 * A <dt>/<dd> pair rather than two divs, because that is what this is — the
 * row must sit inside a <dl>. One component for every such row on the site, so
 * three surfaces cannot drift into three slightly different rows.
 */
export function RecordRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="border-border flex items-baseline justify-between gap-4 border-b py-3">
      <dt className="label">{label}</dt>
      <dd className="text-text-1 text-[length:var(--text-sm)]">
        {href ? (
          <a href={href} className="hover:text-text-2 transition-colors underline-offset-4 hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

/* No separator component lives here. RecordRow draws its own border-b, which
   is the only separator the site uses. If one is ever needed standalone, it is
   a plain typographic rule and nothing more — it is not to be developed into
   ticks, a gauge, or any measuring device. */
