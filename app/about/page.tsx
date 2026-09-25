import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { GlyphText } from "@/components/glyph-text";
import { Photo } from "@/components/photo";
import { RoleList } from "@/components/role-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { roles } from "@/data/experience";
import { site } from "@/data/site";
import { standing } from "@/lib/experience";

/**
 * "a" or "an", by the letter the title starts with.
 *
 * Only the first title in the clause takes one, the same rule the home reads
 * its record by. Which title comes first is `data/experience.ts`'s business, so
 * the article cannot be written into the copy.
 */
const article = (title: string) => (/^[aeiou]/i.test(title) ? "an" : "a");

export const metadata: Metadata = {
  title: "About",
  description: "Product designer working on chess software.",
};

/**
 * About: one photograph, then the record.
 *
 * Emisho's arrangement — a narrow centred column, borderless media fading in
 * over a shimmer, generous gaps between sections — in this site's tokens. The
 * portrait is the one image that must read as itself, so it skips the
 * dot-matrix sweep every other picture arrives through.
 *
 * The file is a stand-in from LinkedIn until the real portrait lands; that
 * provenance lives here and in the README, not on the page, per owner.
 */
export default function AboutPage() {
  /* Derived, not written: `standing` reads the periods and decides both the
     tense and which roles it names. Both of Kenny's design roles have ended, so
     this resolves to "Most recently" — a hand-written line here is exactly what
     would still be claiming a current job a year from now. */
  const now = standing(roles);

  return (
    <main className="mx-auto w-full max-w-[1240px] px-5 pb-14 pt-4 sm:px-6">
      <SiteNav current="/about" />

      <div className="mx-auto flex w-full max-w-[540px] flex-col gap-16 pt-8">
        {/* The face, in a circle, left-aligned. The file is an 800-square
            circle-masked portrait, so the crop costs nothing. */}
        <div className="w-44">
          <Photo
            src="/portrait/kenny.png"
            alt="Kenny Olajide"
            width={200}
            height={200}
            sizes="176px"
            priority
            roundedClassName="rounded-md"
          />
        </div>

        <Block index={0} label="Practice">
          {/* First person, and a greeting rather than a title card. A record
              of a person written in the third person about himself is a CV. */}
          <h1 className="max-w-[46ch] text-lg font-medium leading-snug tracking-tight text-ink">
            Hey &mdash; I&rsquo;m {site.name}. I design chess software.
          </h1>
          <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-ink-2">
            A product designer focused on UX, research, and interface design.
            Five years teaching chess, two editing it, then designing it.
          </p>
          {now.roles.length > 0 && (
            <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-ink-2">
              {now.open ? "Currently " : "Most recently "}
              {now.roles.map((role, i) => (
                <Fragment key={role.company}>
                  {i > 0 && <span>{i === now.roles.length - 1 ? " and " : ", "}</span>}
                  {i === 0 && `${article(role.role)} `}
                  {role.role.toLowerCase()} at{" "}
                  {role.url ? <Out href={role.url}>{role.company}</Out> : role.company}
                </Fragment>
              ))}
              .
            </p>
          )}
        </Block>

        <Block index={1} label="Roles">
          {/* Dates and all, because when is the thing this page adds. The
              order is the record's own — newest first — and the ladder read
              bottom to top is the argument the paragraph above makes in
              words. */}
          <RoleList roles={roles} />
        </Block>

        {/* The ending lives in the shared footer now — the same contact door,
            playlist, and mail row as every other page. */}
        <SiteFooter />
      </div>
    </main>
  );
}

/**
 * A link that leaves, in the site's own mono.
 *
 * Underlined on the hairline rather than on the ink, so a column of them reads
 * as a list before it reads as a set of links.
 */
function Out({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="font-mono text-2xs uppercase tracking-wider text-ink-2 underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-ink-3"
    >
      {children}
    </a>
  );
}

/**
 * One numbered block of the sequence.
 *
 * The numeral is drawn in the matrix's own alphabet at the size the home draws
 * its product ordinals, and it is `aria-hidden` there for the same reason: a
 * screen reader has no use for a picture of a number. The position is still
 * information, so it is spoken in the label and drawn in the dots.
 *
 * The rule under the heading rather than around the block: a box would make
 * three cards, and three cards is a layout the site does not otherwise have.
 */
function Block({
  index,
  label,
  children,
}: {
  index: number;
  label: string;
  children: ReactNode;
}) {
  const ordinal = String(index + 1).padStart(2, "0");
  return (
    <section>
      <div className="rule-b flex items-baseline gap-3 pb-2">
        <span className="sr-only">
          {ordinal} {label}
        </span>
        <GlyphText text={ordinal} size="0.5rem" className="shrink-0 text-ink-3" aria-hidden />
        <h2 className="font-mono text-2xs uppercase tracking-wider text-ink-3">{label}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
