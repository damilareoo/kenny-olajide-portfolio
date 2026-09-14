export type WorkItem = {
  slug: string;
  title: string;
  year: string;
  role: string;
  /** One sentence for the home card. */
  summary: string;
  /** The case page's opening paragraphs. */
  body: string[];
  collaborators?: { name: string; role: string; href?: string }[];
};

export const work: WorkItem[] = [
  {
    slug: "endgame-ai",
    title: "Endgame AI",
    year: "2026",
    role: "Product Design",
    summary:
      "An iOS chess app that turns post-game analysis into something a club player can actually read.",
    body: [
      "Endgame AI ships on the App Store as a games app from Endgame Chess Inc. The product's problem is not analysis — engines have been superhuman for thirty years — it is that engine output is written for engines.",
      "The design work is the translation layer: what a blunder cost, in a sentence, at the moment it happened.",
    ],
    collaborators: [
      { name: "Damilare Osofisan", role: "Product Design", href: "https://www.damilareoo.xyz" },
    ],
  },
  {
    slug: "chessever",
    title: "ChessEver",
    year: "2025",
    role: "0–1 Product Experience",
    summary:
      "Follow professional chess tournaments live, across web and iOS, built from nothing.",
    body: [
      "ChessEver follows professional tournaments in real time — live commentary, player analytics, tournament tracking — across web and mobile.",
      "It was designed from scratch on both platforms, which meant settling what a board, a clock and a move list are on this product before any screen could be drawn.",
    ],
    collaborators: [
      { name: "Damilare Osofisan", role: "Product Design", href: "https://www.damilareoo.xyz" },
    ],
  },
];

export function findWork(slug: string) {
  return work.find((w) => w.slug === slug);
}
