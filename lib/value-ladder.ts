/**
 * The value ladder as /system prints it.
 *
 * It lives here rather than inside the page so a test can hold it against
 * `app/globals.css`. The page shipped the pre-retune ladder for two versions —
 * eight hexes printed beside swatches drawn from the tokens they claimed to
 * name, so the swatch and the number beside it disagreed. A design-system page
 * is the one surface that cannot be wrong about the system, and "someone will
 * remember to edit both" is what was already being relied on.
 *
 * Not read out of the stylesheet at render: this page is prerendered, and a
 * `readFileSync` in a server component is only build-time by accident — Next 16
 * no longer documents a route-segment flag that pins it there. A restated
 * ladder that a test pins to the stylesheet is honest and cannot drift; a read
 * that works until the route is rendered on a machine without the source is
 * neither. See lib/value-ladder.test.ts.
 */
export type ValueRow = {
  /** The token, without the leading dashes. */
  token: string;
  /** The Tailwind background utility that paints the swatch from that token. */
  cls: string;
  /** The hex the stylesheet declares. One skin, one figure. */
  light: string;
};

export const VALUE_LADDER: readonly ValueRow[] = [
  { token: "bg", cls: "bg-bg", light: "#fcfcfc" },
  { token: "surface", cls: "bg-surface", light: "#ffffff" },
  { token: "surface-2", cls: "bg-surface-2", light: "#f3f3f3" },
  { token: "border", cls: "bg-line", light: "#dbdbdb" },
  { token: "text-3", cls: "bg-ink-3", light: "#777777" },
  { token: "text-2", cls: "bg-ink-2", light: "#575757" },
  { token: "text-1", cls: "bg-ink", light: "#0f0f0f" },
  { token: "fill-strong", cls: "bg-strong", light: "#0f0f0f" },
];
