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
 * current employment.
 */
export const IS_PLACEHOLDER = false;

export type Role = {
  role: string;
  company: string;
  from: string;
  to: string;
  /** His own description, not a rewrite. Absent where the profile gave none. */
  note?: string;
};

export const roles: Role[] = [
  {
    role: "Product Designer",
    company: "Endgame AI",
    from: "Apr 2026",
    to: "Aug 2026",
  },
  {
    role: "Product Designer",
    company: "ChessEver",
    from: "Apr 2025",
    to: "Mar 2026",
    note: "User research and competitive analysis to find the product's fit; low-to-high fidelity concepts; interfaces built for usability, accessibility and aesthetics.",
  },
  {
    role: "Content Editor",
    company: "Forward Chess",
    from: "Mar 2024",
    to: "Apr 2024",
    note: "Chess e-book conversions and imports, edited to publication standard.",
  },
  {
    role: "Content Editor",
    company: "Telebu Communications",
    from: "Nov 2022",
    to: "May 2023",
    note: "Owned the editing lifecycle from substantive edit to proofread, against the brand's voice.",
  },
  {
    role: "Technical Content Editor",
    company: "Chessable",
    from: "Feb 2021",
    to: "Jun 2022",
    note: "Imported and improved chess courses, coordinated beta tests, implemented quality control.",
  },
  {
    role: "Chess & Scrabble Instructor",
    company: "Grand Cortex Centre",
    from: "May 2017",
    to: "2022",
  },
];
