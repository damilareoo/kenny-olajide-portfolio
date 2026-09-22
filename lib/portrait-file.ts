import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The one photograph, for the three surfaces that cannot use a component.
 *
 * `app/icon.tsx`, `app/apple-icon.tsx` and `app/opengraph-image.tsx` are drawn
 * by `next/og`, which renders a small subset of CSS on the server and cannot
 * run React components, canvas, or `next/image`. So the file is read off disk
 * and inlined, and all three read it from here.
 *
 * That last part is the point. The favicon and the share card are the two
 * hardest things on a site to change quietly later, and this portrait is a
 * stand-in taken from LinkedIn pending a real photograph. Deriving all three
 * from one constant means replacing `public/portrait/kenny.png` replaces the
 * tab icon, the home-screen icon and every link preview at once, with nothing
 * else to remember.
 */
export const PORTRAIT_FILE = "public/portrait/kenny.png";

/** 200 square, black and white, supplied by the owner on 2026-09-22. */
export const PORTRAIT_SIZE = 200;

/**
 * The head, as fractions of the file, measured off the image.
 *
 * A favicon is 32 pixels across. The whole frame scaled into 32 gives the head
 * about fourteen of them and the rest to a wall, a shirt and a framed print —
 * at which size it is a grey smudge, not a person. So the icons take a square
 * window around the head instead: it is the same photograph, cropped to the one
 * part of it that can survive being that small.
 *
 * Measured 2026-09-22 off the owner-supplied portrait: the face runs roughly
 * x 88–162, y 52–150 of the 200 square, so the window opens a little wider
 * to keep the glasses whole.
 *
 * The square window can be dropped into a square box without the aspect being
 * decided twice.
 */
export const HEAD = { x: 0.38, y: 0.2, size: 0.58 };

/**
 * The file as a data URI.
 *
 * Read once per module instance rather than per request. All three routes that
 * use it are static, so in practice this happens at build time.
 */
export function portraitDataUri(): string {
  const bytes = readFileSync(join(process.cwd(), PORTRAIT_FILE));
  return `data:image/png;base64,${bytes.toString("base64")}`;
}
