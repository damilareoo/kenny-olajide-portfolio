import { elsewhere, site } from "@/data/site";
import { Label } from "@/components/ui";

/**
 * The commit this build was made from, short-formed the way GitHub does.
 *
 * `VERCEL_GIT_COMMIT_SHA` is only set on Vercel; `next dev` and a bare
 * `next build` off Vercel have no such thing, so the fallback is "dev" rather
 * than an empty string that would print as a blank next to "Built at".
 */
const COMMIT = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev";

/**
 * The site's floor, mounted on every route by app/layout.tsx.
 *
 * Before this the site had no footer at all: a visitor who reached the
 * bottom of any page — case, post, or the 404 — was offered nothing further.
 * This carries the three things a floor owes a visitor: a real way to reach
 * Kenny (`mailto:`, not a contact form — see the v1 spec, unchanged), the
 * `elsewhere` links, and the colophon (typeface, palette provenance, and the
 * exact commit this page was built from) — the same kind of honesty the rest
 * of the site practises about its own data, applied to the build itself.
 */
export function SiteFooter() {
  return (
    <footer className="border-border mt-24 border-t">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-10 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Label>Get in touch</Label>
          <a
            href={`mailto:${site.email}`}
            className="text-text-1 hover:text-text-2 mt-2 block text-[length:var(--text-lg)] font-medium tracking-[var(--tracking-tight)] transition-colors"
          >
            {site.email}
          </a>
        </div>

        <nav aria-label="Elsewhere">
          <Label>Elsewhere</Label>
          <ul className="mt-2 flex flex-col gap-1 sm:items-end">
            {elsewhere.map((e) => (
              <li key={e.label}>
                <a
                  href={e.href}
                  className="text-text-2 hover:text-text-1 text-[length:var(--text-sm)] transition-colors"
                >
                  {e.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-border mx-auto flex w-full max-w-[1240px] flex-col gap-2 border-t px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-text-3 text-[length:var(--text-xs)]">
          Set in Inter. Palette read from dejiajetomobi.com in light, jakub.kr in dark.
        </p>
        <p className="text-text-3 text-[length:var(--text-xs)]">Built at {COMMIT}</p>
      </div>
    </footer>
  );
}
