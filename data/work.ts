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
// source's `Product` prints them.
//
// Fields the source's schema offers and this file deliberately leaves empty:
// `stack`, `href`, `client`, and `blocks`. Nothing about how these products
// were built, or what art exists for them, has been supplied, and a case reel
// invented to fill a slot is the failure this repo's honesty rule exists to
// prevent. An absent field renders as no row at all, which is what a record
// with nothing to say should look like.

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
   * No stroke, no ground — the capture sits borderless at the tile radius.
   * For art that carries its own edge. A dark full-bleed screen wants this;
   * a pale stroke drawn round it would be the only light thing in the frame.
   * Implies no device treatment: a plain capture is never held in chrome.
   */
  plain?: true;
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
  | { kind: "text"; heading?: string; body: string[]; links?: { match: string; href: string }[] }
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
  /** The live product. Absent for work that no longer exists publicly. */
  href?: string;
  /** Who it was for, when the piece was client work. */
  client?: string;
  role?: string;
  /** Everyone else on it. See `Collaborator`; an empty list renders nothing. */
  collaborators?: Collaborator[];
  stack?: string;
  /** The Play Store listing, for Android builds. Rendered beside Live. */
  playStore?: string;
  /**
   * Shipped features with somewhere to point. Rendered as outbound links
   * under the Overview, in the site's own mono treatment — the prose names
   * the work, these say where it lives.
   */
  features?: { label: string; href: string }[];
  /**
   * Placeholder slots, drawn in the final treatments while art is pending.
   * Staged behind the fold with the rest of the reel; deleted — not filled —
   * when the real frames land, so a slot never outlives its brief.
   */
  preview?: CaseBlock[];
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
    slug: "chessever",
    title: "ChessEver",
    year: "2025",
    role: "0–1 Product Experience",
    href: "https://chessever.com",
    collaborators: [
      {
        name: "Damilare Osofisan",
        url: "https://www.linkedin.com/in/damilareoo",
      },
    ],
    oneLiner:
      "Follow professional chess tournaments live, across web and iOS, built from nothing.",
    intro: [
      "ChessEver started with a simple idea: make following chess more engaging, structured, and effortless.",
      "At the time, Follow Chess was the primary platform for following live chess broadcasts, but it was no longer available. ChessEver was born out of an opportunity to bring that experience back — and build something better.",
      "As the founding designer, I joined when there was no existing product experience to refine. There were no established design systems, user flows, or visual language. The challenge was to figure out what ChessEver should look and feel like, how people should navigate it, and what would make them want to keep coming back.",
      "I helped shape ChessEver from its earliest ideas to a shipped product.",
      "Working alongside my co-designer, @Damilare, we owned the design process across the product, working closely with the team to turn ideas into tangible experiences.",
      "Our work went beyond designing screens. We shaped the product from the ground up — from the logo, colour system, typography, and visual language to the UX, product architecture, features, and interactions.",
      "We started with almost nothing and worked through the ambiguity of building from scratch: turning conversations into concepts, concepts into prototypes, and prototypes into a functional product.",
      "Today, ChessEver has evolved from an idea into a shipped platform for following chess — built to make keeping up with the game simpler, more engaging, and more enjoyable.",
    ],
  },
  {
    slug: "endgame-ai",
    title: "Endgame AI",
    year: "2026",
    role: "Product Designer",
    href: "https://endgame.ai",
    oneLiner:
      "An iOS chess app that turns post-game analysis into something a club player can actually read.",
    intro: [
      "I helped shape how users learn and progress on Endgame.ai.",
      "From improving existing experiences to designing new features like Puzzle Run, Endgame Club Feature, Endgame Watch (Broadcast), I focused on reducing friction and making the product feel simpler, clearer, and more rewarding to use while also working on Gamifying the platform across Mobile and Web interfaces.",
      "My work spanned UX research, user flows, interaction design, wireframing, UI design, and feature development, taking ideas from concept to polished, product-ready experiences.",
    ],
    features: [
      { label: "Puzzle Run", href: "https://endgame.ai/puzzle-run" },
      { label: "Endgame Club", href: "https://endgame.ai/clubs" },
      { label: "Endgame Watch", href: "https://endgame.ai/watch" },
    ],
    /* The pending set, seated in final treatments: Hopea and Czar plates,
       the writeup between them and the web frames, then two browser frames
       for the web work. Nothing here is a placeholder — every image slot
       names its committed file, and the test below holds that. */
    preview: [
      {
        kind: "inset",
        items: [
          {
            src: "/work/endgame-ai/hopea-1.png",
            alt: "Hopea piece set on a blue board",
            caption: "Hopea",
          },
          {
            src: "/work/endgame-ai/hopea-2.png",
            alt: "Hopea piece set on a purple board",
            caption: "Hopea",
          },
        ],
      },
      {
        kind: "inset",
        items: [
          {
            src: "/work/endgame-ai/czar-1.png",
            alt: "Czar piece set on a green board",
            caption: "Czar",
          },
          {
            src: "/work/endgame-ai/czar-2.png",
            alt: "Czar piece set on a pink board",
            caption: "Czar",
          },
        ],
      },
      {
        kind: "text",
        heading: "Chess Piece Set Exploration",
        links: [
          { match: "@daomotola", href: "https://x.com/DaOmotola" },
          { match: "@Damilare", href: "https://www.linkedin.com/in/damilareoo" },
        ],
        body: [
          "With @daomotola & @Damilare",
          "Chess isn't only about the game itself. The pieces are part of the experience; their shape, character, and visual language can make the board feel more inviting.",
          "We explored how a fresh, distinctive piece set could make online chess feel more expressive and approachable, especially for people who are new to chess. Sometimes, the first thing that draws someone in is simply how beautiful the game looks.",
          "Together, we explored and developed Hopea (an Indian wood type) a custom chess piece with its own visual identity while making the board feel more modern, playful, and approachable.",
        ],
      },
      {
        kind: "inset",
        items: [
          {
            src: "/work/endgame-ai/web-1.png",
            alt: "Endgame.ai Play Online lobby on the web",
            caption: "Play lobby on endgame.ai",
          },
        ],
      },
      {
        kind: "inset",
        items: [
          {
            src: "/work/endgame-ai/web-2.png",
            alt: "Endgame.ai homepage featuring its Netflix partnership",
            caption: "Homepage with Netflix partnership",
          },
        ],
      },
    ],
  },
  {
    slug: "xd",
    title: "XD",
    year: "2025",
    role: "Product Designer",
    oneLiner:
      "A desktop storefront for PC games — catalogue, library, and community in one dark interface.",
    intro: [
      "XD is a gaming platform designed as a competitor to Steam and Epic Games, built to bring game discovery, libraries, and the broader gaming experience into one place.",
      "As the product designer, I designed the interface from the ground up, focusing on creating a clean, immersive, and intuitive experience for gamers. I worked across key areas of the platform, from navigation and game discovery to game pages, libraries, profiles, and other core interactions, while establishing a visual language that gives XD its own identity.",
      "The goal was to balance the information-rich nature of gaming platforms with a simple interface that makes discovering and getting into games feel effortless.",
    ],
    /* Eight desktop captures, three aspect-matched pairs on the card: the
       lede browses (catalogue, then library), the second pair configures
       XDGSS, and the tail pairs the tall game page with the tall news
       scroll. Plain throughout — dark full-bleed screens carry their own
       edge, and a pale stroke would be the only light thing in any of these
       frames. Specials and picks stay filed in work/ off the reel, and the
       community hub runs in the Shots strip instead. */
    blocks: [
      {
        kind: "pair",
        items: [
          {
            src: "/work/xd/01-trending-games.jpg",
            alt: "XD trending games catalogue",
            caption: "Trending",
            plain: true,
          },
          {
            src: "/work/xd/02-library.jpg",
            alt: "XD personal game library",
            caption: "Library",
            plain: true,
          },
        ],
      },
      {
        kind: "pair",
        items: [
          {
            src: "/work/xd/07-xdgss-setup.jpg",
            alt: "XD XDGSS configuration screen",
            caption: "XDGSS setup",
            plain: true,
          },
          {
            src: "/work/xd/08-xdgss-popup.jpg",
            alt: "XD Set up XDGSS dialog over sign-in",
            caption: "Set up XDGSS",
            plain: true,
          },
        ],
      },
      {
        kind: "pair",
        items: [
          {
            src: "/work/xd/05-game-detail.jpg",
            alt: "XD game detail page with reviews",
            caption: "Game page",
            plain: true,
          },
          {
            src: "/work/xd/06-community-news.jpg",
            alt: "XD community news scroll",
            caption: "Community news",
            plain: true,
          },
        ],
      },
    ],
  },
];

export function findWork(slug: string) {
  return work.find((w) => w.slug === slug);
}
