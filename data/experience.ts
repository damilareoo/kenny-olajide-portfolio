/**
 * Kenny's role history, read from linkedin.com/in/kenny-olajide-b5476216a on
 * 2026-09-14 through the owner's own logged-in session.
 *
 * This file was a marked placeholder until that read. It no longer is — every
 * row below is his, in his own profile's wording. The vanity URL in the
 * original brief (/in/kennyolajide) returns LinkedIn's 404; this one is the
 * real profile.
 *
 * Endgame AI is the one row that did not come from LinkedIn — his profile
 * carries no Endgame entry. The owner supplied the dates directly on
 * 2026-09-14. The TITLE is an inference from his headline ("Product Designer")
 * and from the identical title he held at ChessEver immediately before; the
 * owner gave dates, not a title. If that inference is wrong it is wrong in one
 * place, here.
 *
 * The order is what the ladder shows, and the ladder is the argument: five
 * years teaching chess, then editing chess courses, then chess e-books, then
 * designing a chess product, then a second one. He did not arrive at the
 * domain as a designer looking for one.
 *
 * Both of the two most recent roles have ended — ChessEver in Mar 2026,
 * Endgame AI in Aug 2026 — so nothing here or downstream should read as
 * current employment. `lib/experience.ts` derives that rather than restating
 * it: with no period ending in "Present", `standing()` returns the most recent
 * role and the sentence around it reads "Most recently".
 *
 * ── The schema, and where it came from ──────────────────────────────────────
 *
 * The shape is `/Users/v/portfolio-v2`'s, not v2's: a `period` written as one
 * human sentence — "Apr 2026 — Aug 2026" — rather than a `from` and a `to`,
 * because that is the form the page prints and the form `lib/experience.ts`
 * parses. Nothing outside that file reads a period.
 *
 * Two fields of the source's `Role` are OPTIONAL here where the source has
 * them required, and the reason is the content-honesty rule rather than taste:
 *
 * - `location` — his profile's per-role locations were not captured in the
 *   2026-09-14 read. A city invented to satisfy a type is a fact about Kenny
 *   that nobody checked, so the field is absent on every row instead.
 * - `url` — carried only for the two companies whose sites are already
 *   asserted elsewhere in this repo. The older four have no URL recorded, and
 *   guessing a domain from a company name is the same failure one step
 *   removed.
 *
 * `note` is not in the source's schema at all. It is kept because it is his own
 * wording of what he did, read off the profile, and dropping real content to
 * match a schema would be the wrong direction of tidiness.
 */
export const IS_PLACEHOLDER = false;

export type Role = {
  role: string;
  company: string;
  /** The company's site — the row links out to it, not to LinkedIn. Absent where none is recorded. */
  url?: string;
  period: string;
  /** Absent on every row: see the note above. */
  location?: string;
  /** Contract, full-time, and so on, as LinkedIn records it. */
  engagement?: string;
  logo?: string;
  /** Set only where `logo` is the company's real artwork. See `Mark`. */
  mark?: Mark;
  /** His own description, not a rewrite. Absent where the profile gave none. */
  note?: string;
};

/**
 * What kind of drawing the `logo` file holds.
 *
 * Two kinds, because two kinds of artwork arrive and they are not measured the
 * same way. A **wordmark** spells the company's name, so its size is its cap
 * height and the site can set it to the cap height of the type around it. A
 * **symbol** spells nothing, so it has no cap height to be set from, and its
 * size comes from its own box instead. Overloading `cap` to carry both would
 * make it a lie on half the marks; a discriminant makes the next company that
 * arrives say which it brought.
 *
 * The kind decides the treatment, not only the arithmetic. A wordmark is
 * cropped out of its plate and framed; a symbol is set beside the company's
 * name in the site's own mono, because a bare shape does not say who it is.
 * See `components/company-marks.tsx`.
 */
export type Mark = Wordmark | SymbolMark;

/**
 * Where a company's wordmark actually sits inside its `logo`.
 *
 * An OG plate is mostly margin, and the margin is not the same on any two of
 * them. These numbers are what let each plate be scaled until its wordmark
 * reaches a shared cap height, and they are measured off the file rather than
 * estimated. Every figure is a ratio to the plate's *height*, width included,
 * so one scale factor drives both axes. Cap height rather than bounding box:
 * cap height is what the eye measures a wordmark by.
 *
 * Carried across from the source repository unchanged, because the file they
 * describe — `public/companies/endgame.png` — is the same file.
 */
export type Wordmark = {
  kind: "wordmark";
  /** The plate's pixel dimensions, as the file carries them. */
  plate: [width: number, height: number];
  /** The wordmark's cap height ÷ the plate's height. */
  cap: number;
  /** The wordmark's full width ÷ the plate's height. */
  width: number;
  /**
   * The wordmark's full height ÷ the plate's height — ascenders, descenders
   * and anything floating above them, not just the caps. The tile is sized off
   * the tallest of these, so a mark can never be cropped by the box that is
   * meant to hold it.
   */
  height: number;
};

/**
 * A mark that is a shape rather than a name: the whole file is the artwork.
 *
 * There is nothing here to locate, which is the point of the second kind. A
 * symbol has no plate to crop it out of, no ground to hide and no clear space
 * that belongs to someone else's layout — ChessEver's file is the mark, edge to
 * edge, on a genuinely transparent ground. So the only figure recorded is the
 * box the file arrives in, and that is here so the aspect ratio is read off the
 * file rather than retyped beside it.
 *
 * No size figure, deliberately. How large a symbol should print next to type is
 * a judgement about how the two read together, not a measurement of this file,
 * so it is made once for every symbol in `components/company-marks.tsx` rather
 * than per company here.
 *
 * Presence is still the switch. A role with no `mark` has no artwork the site
 * can use, whatever `logo` happens to point at, and its name is set in mono
 * instead of cropping product art into the shape of a logo.
 */
export type SymbolMark = {
  kind: "symbol";
  /** The file's pixel dimensions, as it carries them. */
  box: [width: number, height: number];
};

export const roles: Role[] = [
  {
    role: "Product Designer",
    company: "Endgame AI",
    url: "https://endgame.ai",
    period: "Apr 2026 — Aug 2026",
    /* The company's own Open Graph plate, carried across from the source
       repository along with the measurements that crop it. Kenny's two most
       recent employers are the two this site holds artwork for; the older four
       have none, and `CompanyMark` sets those in the site's own mono, which is
       the designed fallback rather than a gap. */
    logo: "/companies/endgame.png",
    mark: {
      kind: "wordmark",
      plate: [1200, 630],
      cap: 75 / 630,
      width: 596 / 630,
      height: 108 / 630,
    },
  },
  {
    role: "Product Designer",
    company: "ChessEver",
    url: "https://chessever.com",
    period: "Apr 2025 — Mar 2026",
    note: "User research and competitive analysis to find the product's fit; low-to-high fidelity concepts; interfaces built for usability, accessibility and aesthetics.",
    /* A symbol rather than a wordmark, so it declares that and carries its box
       instead of a cap height it has not got. */
    logo: "/companies/chessever.png",
    mark: { kind: "symbol", box: [501, 500] },
  },
  {
    role: "Content Editor",
    company: "Forward Chess",
    period: "Mar 2024 — Apr 2024",
    note: "Chess e-book conversions and imports, edited to publication standard.",
  },
  {
    role: "Content Editor",
    company: "Telebu Communications",
    period: "Nov 2022 — May 2023",
    note: "Owned the editing lifecycle from substantive edit to proofread, against the brand's voice.",
  },
  {
    role: "Technical Content Editor",
    company: "Chessable",
    period: "Feb 2021 — Jun 2022",
    note: "Imported and improved chess courses, coordinated beta tests, implemented quality control.",
  },
  {
    role: "Chess & Scrabble Instructor",
    company: "Grand Cortex Centre",
    /* The profile gave a bare year for the end of this one — "2022" — and
       `lib/experience.ts` parses a month or throws. Dec 2022 is the month the
       v3 spec's own table records, and it is the reading a bare closing year
       carries: the role ran through that year. It is the one date on this page
       that is a reading rather than a transcription, and it is written down
       here so it is not mistaken for one. */
    period: "May 2017 — Dec 2022",
  },
];
