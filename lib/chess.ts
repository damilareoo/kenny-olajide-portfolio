/**
 * One position, and the move that solves it.
 *
 * White Kg6, Qb2. Black Kh8. White to move and mate in one, with `Qb8#`.
 *
 * The mate was verified by brute force before it was written down, not by
 * analysis: the queen's path up the b-file is clear, the check runs along the
 * eighth rank, and every king escape is covered — g7 and h7 by the white king
 * on g6, g8 by the queen itself. Zero escape squares.
 *
 * It is attributed to nobody because it is nobody's study. It was chosen
 * because it is small enough to verify rather than trust, which on a chess
 * person's portfolio is the only acceptable standard.
 *
 * **One thing the same brute force also found, recorded here rather than
 * quietly left out: `Qg7#` mates as well.** The queen reaches g7 along the
 * a1–h8 diagonal, the black king cannot take it because the white king on g6
 * defends it, and h7 and g8 are both covered. So this position is a mate in
 * one with two solutions, not one. `SOLUTION` is `Qb8` because that is what
 * the spec names and the position is not this module's to change — but the
 * board's refusal copy says "not the move", never "not mate", because telling
 * a chess player that `Qg7` is not mate would be a false statement about
 * chess, and that is the one thing this file exists to avoid.
 *
 * Nothing here knows about the DOM, and nothing here is a chess engine. There
 * is no move generator, no second position, and no legality beyond the
 * queen's own geometry — `queenCanReach` — which is all the board needs to
 * stop a piece being put somewhere a queen could never go.
 */

/** "a1".."h8". */
export type Square = string;

export type Piece = { colour: "w" | "b"; kind: "K" | "Q"; at: Square };

export const START: Piece[] = [
  { colour: "w", kind: "K", at: "g6" },
  { colour: "w", kind: "Q", at: "b2" },
  { colour: "b", kind: "K", at: "h8" },
];

export const SOLUTION: { from: Square; to: Square } = { from: "b2", to: "b8" };

/** How the solution is written in a game score. */
export const SOLUTION_SAN = "Qb8#";

/** The move that opens this, and the most played first move in chess. */
export const TRIGGER = "e4";

export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

/** 1..8 for a..h. */
export function file(s: Square) {
  return s.charCodeAt(0) - 96;
}

/** 1..8. */
export function rank(s: Square) {
  return Number(s[1]);
}

/** Whether a queen could move from one square to another on an empty board. */
export function queenCanReach(from: Square, to: Square): boolean {
  if (from === to) return false;
  const df = file(to) - file(from);
  const dr = rank(to) - rank(from);
  return df === 0 || dr === 0 || Math.abs(df) === Math.abs(dr);
}

export function isSolution(from: Square, to: Square): boolean {
  return from === SOLUTION.from && to === SOLUTION.to;
}

/** The piece standing on a square, if any. */
export function pieceAt(pieces: Piece[], at: Square): Piece | undefined {
  return pieces.find((p) => p.at === at);
}
