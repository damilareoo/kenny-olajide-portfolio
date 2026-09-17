import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { FooterLine } from "@/components/footer-line";
import { GlyphText } from "@/components/glyph-text";
import Image from "next/image";
import { RoleList } from "@/components/role-list";
import { SiteNav } from "@/components/site-nav";
import { roles } from "@/data/experience";
import { elsewhere, site } from "@/data/site";
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
  description: `Product designer in ${site.location}, by way of the chessboard.`,
};

/**
 * About: the record, the ladder, and a column of photographs.
 *
 * The arrangement is the source's — words on the left as a numbered sequence,
 * pictures on the right in their own column, a wide gutter between them — and
 * two things about it are Kenny's rather than inherited.
 *
 * The first is that the picture column holds several frames rather than one.
 * The one-screen, no-scroll composition the source uses was built around a
 * single portrait running off the bottom edge; a column asked to carry three
 * pictures cannot also promise never to scroll, and the owner asked for the
 * imagery. So the page scrolls, and the column is a stack.
 *
 * The second is that two of those three frames are empty and say so. There is
 * exactly one photograph of Kenny in this repository, it is a stand-in taken
 * from his LinkedIn, and the real ones have not arrived. An empty slot with a
 * brief written in it is honest and is also the fastest way to get the picture
 * that fills it; a slot padded out with an App Store screenshot would be the
 * site pretending product work is photography. See `README.md`, which carries
 * the same brief for whoever is sending the files.
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

      <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] xl:gap-16">
        {/* The words, as a numbered sequence.

            The home numbers its products in the matrix's own numerals, small
            and quiet, beside each title; nothing else on the site is numbered.
            Numbering the three things this page says the same way ties About to
            the work rather than to a reference, and it is a device nobody else
            can use, because nobody else has the alphabet.

            Three blocks, in the order somebody reads them: who he is, what he
            has done, and how to reach him. */}
        <div className="flex min-w-0 flex-col gap-10">
          <Block index={0} label="Practice">
            {/* First person, and a greeting rather than a title card. A record
                of a person written in the third person about himself is a CV. */}
            <h1 className="max-w-[46ch] text-lg font-medium leading-snug tracking-tight text-ink">
              Hey &mdash; I&rsquo;m {site.name}. I design chess software.
            </h1>
            <p className="mt-3 max-w-[46ch] text-base leading-relaxed text-ink-2">
              Five years teaching the game, two editing it, then designing it.
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

          <Block index={2} label="Reach">
            <dl>
              <Field label="Email">
                <Out href={`mailto:${site.email}`}>{site.email}</Out>
              </Field>
              <Field label="Elsewhere">
                {elsewhere.map((place, i) => (
                  <Fragment key={place.label}>
                    {i > 0 && <span className="text-ink-3"> &middot; </span>}
                    <Out href={place.href}>{place.label}</Out>
                  </Fragment>
                ))}
              </Field>
              <Field label="Studied">{site.education}</Field>
              <Field label="Based in">{site.location}</Field>
            </dl>
          </Block>
        </div>

        {/* The pictures. `order-first` below `lg` only: on one column the
            photograph is the first thing on the page, which is what a page
            about a person opens with; in two columns the DOM order is already
            the reading order and the property has nothing to do. */}
        <div className="order-first flex min-w-0 flex-col gap-4 lg:order-none">
          <figure className="m-0">
            {/* The photograph, as a photograph. It was painted as a field of
                dots — the treatment every other picture on the source site
                arrives through — and the owner's call is that a portrait is
                not the place for it: a face is the one image on a site that
                has to be read as itself.

                Square, because the file is: it is an 800-square circle-masked
                portrait, and a 4:5 box would letterbox a fifth of the column
                in nothing. The two slots beneath it are square for the same
                reason, so the picture column is one rhythm rather than three
                shapes. The mask does the work a border-radius would. */}
            <Image
              src="/portrait/kenny.png"
              alt="Kenny Olajide"
              width={800}
              height={800}
              sizes="(min-width: 1024px) 28rem, 92vw"
              priority
              className="aspect-square w-full object-contain"
            />
            <figcaption className="mt-2 font-mono text-2xs uppercase tracking-wider text-ink-3">
              Stand-in, pending a real portrait
            </figcaption>
          </figure>

          {/* The two that have not arrived. Sized as a pair so the column has a
              shape now that will not move when the files land. */}
          <div className="grid grid-cols-2 gap-4">
            <Slot ratio="1 / 1" brief="At the board — playing or teaching" />
            <Slot ratio="1 / 1" brief="At work — screen, desk, or studio" />
          </div>
        </div>
      </div>

      <footer className="mt-16">
        <FooterLine />
      </footer>
    </main>
  );
}

/**
 * A frame with nothing in it yet, and the brief for what goes there.
 *
 * Dashed rather than solid, because a solid hairline in this system is a rule
 * and a rule means "these two things are different", not "this is missing". The
 * brief is set in the same mono the record labels use: the slot is a row of the
 * record that happens to be the size of a picture.
 */
function Slot({ ratio, brief }: { ratio: string; brief: string }) {
  return (
    <div
      className="flex items-end rounded-[4px] border border-dashed border-line p-3"
      style={{ aspectRatio: ratio }}
    >
      <p className="font-mono text-2xs uppercase leading-snug tracking-wider text-ink-3">
        {brief}
      </p>
    </div>
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
 * One row of the record: an uppercase mono label in a fixed column, its value
 * beside it, a dotted rule under the pair.
 *
 * The label column is fixed so every value starts on one edge — a label column
 * that sizes to its content puts three values at three indents and the rows
 * stop being rows. Below `sm` the pair stacks: a 7rem label column inside a
 * 320px screen leaves the value nine characters.
 */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rule-b grid gap-x-4 py-2 last:bg-none sm:grid-cols-[7rem_minmax(0,1fr)]">
      <dt className="font-mono text-2xs uppercase tracking-wider text-ink-3">{label}</dt>
      <dd className="min-w-0 text-sm text-ink-2">{children}</dd>
    </div>
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
