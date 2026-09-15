// One model for every piece of work.
//
// The model is `/Users/v/portfolio-v2`'s, copied across with the design
// language it belongs to: `lib/case-blocks.ts`, `lib/app-reel.ts` and
// `components/product.tsx` all read these types, so the schema arrived with
// them rather than being chosen here.
//
// The CONTENT is Kenny's and is unchanged from what this repo already held.
// Two fields were renamed into the new schema and nothing was added:
// `summary` is now `oneLiner` and `body` is now `intro`, which is where the
// source's `Product` prints them. `disciplines` is the one new field with a
// value, and it says the one thing the record already said in prose.
//
// Fields the source's schema offers and this file deliberately leaves empty:
// `stack`, `href`, `client`, and `blocks`. Nothing about how these products
// were built, or what art exists for them, has been supplied, and a case reel
// invented to fill a slot is the failure this repo's honesty rule exists to
// prevent. An absent field renders as no row at all, which is what a record
// with nothing to say should look like.

export const disciplines = [
  "Product Design",
  "Interaction",
  "Identity",
  "Build",
] as const;

export type Discipline = (typeof disciplines)[number];

export type CaseMedia = {
  /** Path under public/work/<slug>/. Absent renders a labelled empty frame. */
  src?: string;
  alt?: string;
  caption?: string;
  /** Slot shape while there is no art to measure, e.g. "4 / 3". */
  ratio?: string;
  /**
   * How the artwork is presented. A screen capture reads as the thing it was
   * captured from — a hairline and a radius in the site's own tokens, never an
   * imitation of chrome and never a shadow.
   */
  frame?: "phone" | "browser";
  /**
   * One frame per case may break the column and run the full measure. Which one
   * is authored: a computed "widest image wins" would put the emphasis wherever
   * the export happened to be largest.
   */
  bleed?: true;
};

/**
 * An entry's reel is an ordered list of these. Text blocks are narrow and sit at
 * decision points, so the argument stays readable without a wall of prose
 * before the first image.
 */
export type CaseBlock =
  | ({ kind: "full" } & CaseMedia)
  | { kind: "pair"; items: [CaseMedia, CaseMedia] }
  /**
   * One or two frames held inside a tinted plate rather than bled to the
   * column edge. The plate is what lets a reel breathe — without it every
   * frame is the same size and the page reads as a contact sheet.
   */
  | {
      kind: "inset";
      items: [CaseMedia] | [CaseMedia, CaseMedia];
      tone?: "surface" | "strong";
    }
  | { kind: "text"; heading?: string; body: string[] }
  | { kind: "quote"; body: string; attribution?: string };

/**
 * Someone else who worked on the piece.
 *
 * A name is the only thing required, because the only thing the site can
 * honestly claim is that they were there. `url` is optional because some
 * people have a site and some do not, and a name that is not a link must not
 * read as a broken one. `role` is optional because on a two-person piece it is
 * usually obvious and saying it anyway is padding.
 */
export type Collaborator = {
  name: string;
  /** Their own site. Absent means the name is set as plain text, not a link. */
  url?: string;
  /** What they did, where it is worth saying. */
  role?: string;
};

export type WorkItem = {
  slug: string;
  title: string;
  oneLiner: string;
  year: string;
  disciplines: Discipline[];
  /** The live product. Absent for work that no longer exists publicly. */
  href?: string;
  /** Who it was for, when the piece was client work. */
  client?: string;
  role?: string;
  /** Everyone else on it. See `Collaborator`; an empty list renders nothing. */
  collaborators?: Collaborator[];
  stack?: string;
  /**
   * The written argument. Both sit inside the entry's fold, in one centred
   * column with the record rows between them — `intro` above, `approach`
   * below. There is no rail: the home is a single column of products, and
   * prose set beside a reel needs a second column to sit in.
   */
  intro?: string[];
  approach?: string[];
  /**
   * The reel — visual blocks only, since the prose above carries the words.
   * Work without blocks renders its record and says so plainly rather than
   * padding: the site does not pretend to depth it lacks.
   */
  blocks?: CaseBlock[];
};

/**
 * The work, in the order the home shows it. The array is the order.
 *
 * Both entries are iOS apps, so both open on their App Store card rather than
 * on a frame of their own. Nothing in this file says so: which entries are apps
 * is `data/app-store.ts`'s business, because the record here is the site's own
 * words about the work and that file is Apple's words about the product.
 */
export const work: WorkItem[] = [
  {
    slug: "endgame-ai",
    title: "Endgame AI",
    year: "2026",
    role: "Product Designer",
    disciplines: ["Product Design"],
    oneLiner:
      "An iOS chess app that turns post-game analysis into something a club player can actually read.",
    intro: [
      "Endgame AI ships on the App Store as a games app from Endgame Chess Inc. The product's problem is not analysis — engines have been superhuman for thirty years — it is that engine output is written for engines.",
      "The design work is the translation layer: what a blunder cost, in a sentence, at the moment it happened.",
    ],
    collaborators: [
      { name: "Damilare Osofisan", role: "Product Design", url: "https://www.damilareoo.xyz" },
    ],
  },
  {
    slug: "chessever",
    title: "ChessEver",
    year: "2025",
    role: "0–1 Product Experience",
    disciplines: ["Product Design"],
    oneLiner:
      "Follow professional chess tournaments live, across web and iOS, built from nothing.",
    intro: [
      "ChessEver follows professional tournaments in real time — live commentary, player analytics, tournament tracking — across web and mobile.",
      "It was designed from scratch on both platforms, which meant settling what a board, a clock and a move list are on this product before any screen could be drawn.",
    ],
    collaborators: [
      { name: "Damilare Osofisan", role: "Product Design", url: "https://www.damilareoo.xyz" },
    ],
  },
];

export function findWork(slug: string) {
  return work.find((w) => w.slug === slug);
}
