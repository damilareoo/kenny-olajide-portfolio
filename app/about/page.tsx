import { IS_PLACEHOLDER, roles } from "@/data/experience";
import { elsewhere, site } from "@/data/site";
import { Label, RecordRow } from "@/components/ui";

export const metadata = { title: "About" };

export default function About() {
  return (
    <main id="main" className="mx-auto w-full max-w-[1240px] px-6 pb-32 pt-16">
      <h1 className="text-text-1 text-[length:var(--text-xl)] font-medium tracking-[var(--tracking-tight)]">
        {site.name}
      </h1>

      <section className="mt-16 grid gap-12 lg:grid-cols-2">
        <div>
          <Label>Experience</Label>
          {/* Visible in the page, not only in the source, so nobody reviews
              this surface believing the ladder is real. */}
          {IS_PLACEHOLDER && (
            <p className="text-text-3 mt-3 text-[length:var(--text-xs)]">
              Placeholder records — real history to be supplied.
            </p>
          )}
          <dl className="mt-4">
            {roles.map((r) => (
              <RecordRow
                key={`${r.company}-${r.from}`}
                label={`${r.from}–${r.to}`}
                value={`${r.role}, ${r.company}`}
              />
            ))}
          </dl>
        </div>

        <div>
          <Label>Elsewhere</Label>
          <dl className="mt-4">
            {elsewhere.map((e) => (
              <RecordRow key={e.label} label={e.label} value={e.handle} href={e.href} />
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
