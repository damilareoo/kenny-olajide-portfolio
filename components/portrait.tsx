"use client";

import { useEffect, useRef, useState } from "react";
import { BAND, CEIL, paintPanel, type Panel } from "@/lib/glyph/panel";
import { autoLevel, centreMidtone, unsharp } from "@/lib/glyph/tone";

const FILE = { src: "/portrait/kenny.png", width: 800, height: 800 };

/**
 * The two ends of the window this field is sampled through, as fractions of the
 * file's width, each against the grid it was measured at.
 *
 * The file this reads is already a crop: an 800-square portrait, circle-masked,
 * head and shoulders filling most of the frame. So the window is wide — there
 * is no room in it to go looking for the subject, because the subject is all
 * there is. At 0.78 of the width a 4:5 column takes a 624 by 780 band, which is
 * very nearly the whole circle with the masked corners falling outside it.
 *
 * It still closes a little as the grid coarsens, for the reason the ramp exists
 * at all: beside the words this gets a column around 150 cells across and above
 * them on a phone a band around 80, and the same window resolved into half as
 * many cells is a coarser picture, not a smaller one. The first thing a coarser
 * picture loses is the face.
 */
const CROP = { near: { cols: 80, zoom: 0.72 }, far: { cols: 150, zoom: 0.82 } };

/**
 * The crop the grid can actually carry, as a fraction of the file's width.
 *
 * A fixed crop is the obvious thing and it is wrong, because the two layouts
 * hand this component two different grids. Beside the words it gets a column
 * about a hundred and fifty cells across; above them on a phone it gets a band
 * about eighty. The same window of the file, resolved into half as many cells,
 * is not the same picture drawn smaller — it is a coarser picture, and the
 * first thing a coarser picture loses is the face, which is the smallest thing
 * in the frame that has to survive.
 *
 * So the window closes as the grid does, and the subject keeps roughly the
 * number of cells it needs. Both ends were measured by rendering the file at
 * that exact box and looking: at a hundred and fifty cells two-fifths of the
 * width is head and shoulders with room around them, and at eighty anything
 * wider than a third leaves the head too few cells to be a head. Between them
 * it is a straight line, and outside them it is clamped — a grid finer than the
 * far end gains nothing from a wider window, and one coarser than the near end
 * cannot be rescued by a tighter one.
 */
function zoomFor(cols: number): number {
  const t = (cols - CROP.near.cols) / (CROP.far.cols - CROP.near.cols);
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  return CROP.near.zoom + (CROP.far.zoom - CROP.near.zoom) * clamped;
}

/**
 * How far apart the emitters stand here, in CSS pixels.
 *
 * `lib/glyph/panel.ts` puts them 7px apart, which is right for the field it was
 * written for: a page of shots, each read at a glance, where the lattice is a
 * texture and the photograph underneath resolves a moment later. This picture
 * has no photograph underneath to resolve into — the dots are the whole of it,
 * and at 7px a face across this column is under a hundred cells wide, which is
 * a texture rather than a likeness. Four and a half puts it near three hundred,
 * where an eye is an eye. The constant is local for the same reason the ceiling
 * is: nothing about the shots field changes.
 */
const PITCH = 4.5;

/**
 * Where that window sits in the file, as fractions of its width and height.
 *
 * Just left of centre and just above it. He is seated slightly to the left of
 * the circle with the wall and a framed print filling the right of it, so a
 * window centred on the file gives a third of its cells to a picture on a wall.
 * Lifted on the vertical for the same reason: the shirt is the largest dark
 * mass in the photograph and, read inverted, the largest lit one — centred, it
 * takes the bottom half of the field and the head shares what is left.
 */
const FOCUS = { x: 0.44, y: 0.44 };

/**
 * What the panel's own ceiling costs a picture that stays.
 *
 * `emitter` never returns more than `CEIL` — 0.62 — because the panel it was
 * written for is a *transition*: a field laid over a photograph that fades out
 * as the photograph fades in, and one that reached full ink would black the
 * picture out at the moment of handover. This field is not laid over anything.
 * It is the picture, so it is entitled to the whole ramp, and the values are
 * divided by the ceiling on the way in so `emitter`'s own multiplication puts
 * them back. Nothing in `lib/glyph/panel.ts` changes: the shots field and the
 * case reels keep the ceiling that is right for what they do.
 */
const UNCAP = 1 / CEIL;

/**
 * How hard the values are pushed away from their middle.
 *
 * Sampled and levelled, this photograph still lands most of its emitters in the
 * middle third of the ramp, and a field with no darks and no lights reads as
 * grey weather rather than as a face. The correction is a straight gain about
 * the midpoint — it costs the extremes, which this file has few of.
 *
 * It is the blunt half of the pair. A gain cannot tell his cap from the wall
 * behind it, because a global curve moves both by the same amount; that is
 * `EDGE` below, and this is only what puts the result across the whole ramp
 * afterwards.
 */
const GAIN = 1.25;

/**
 * How much of the local difference `unsharp` adds back, and at what size.
 *
 * The amount was chosen by rendering the file at the column's real size across
 * a range of them and looking: below about 0.6 the cap and the wall behind it
 * are still one mass, and above about 1.2 the shirt breaks into noise and every
 * edge carries a halo. 0.9 is where the brim, the ear and the line of the jaw
 * arrive and nothing else does.
 *
 * The radius is in cells, so it is written as a share of the grid rather than
 * as a number. Fixed at two cells it would pick out a feature twice as large in
 * a 380px column as in a 760px one, and the picture would change character with
 * the width of the screen rather than staying the same picture drawn finer.
 * The divisor is the grid the amount was judged against.
 */
const EDGE = { amount: 0.7, per: 55 };

/**
 * Luminance to ink, inverted: a dark pixel lights an emitter.
 *
 * The same direction `panelFrom` reads in, and it is worth saying why, because
 * the argument for reading a night photograph the other way round is a good one
 * and it is wrong. Read straight, the only lit emitters would be the light
 * falling on his face and forearms — and since the cap, the shirt and the room
 * behind him are all dark, the picture would be a handful of bright fragments
 * floating on an empty field. Inverted, the mass of him is ink and the light on
 * his face is the paper it is drawn on, which is what a reader recognises as a
 * face.
 *
 * What makes that work here rather than turning the frame into one dark slab is
 * `unsharp`. The ground behind him is dark too, and separating it from him is a
 * local problem — not a question of which way up the ramp runs.
 *
 * It holds on both skins for the same reason every other panel does: the ink is
 * the page's own, so a lit emitter is dark on the light skin and light on the
 * dark one, and the figure is what is lit either way.
 */
function readInverted(
  pixels: Uint8ClampedArray,
  count: number,
): { values: Float32Array; opaque: Uint8Array } {
  const raw = new Float32Array(count);
  const opaque = new Uint8Array(count);
  let sum = 0;
  let seen = 0;
  for (let i = 0; i < count; i++) {
    const p = i * 4;
    /* A transparent pixel is not a dark pixel, and the difference is the whole
       picture. The file is circle-masked with transparent corners; read as RGB
       those corners are zeroes, which inverted is full ink, which would square
       the portrait off inside four solid blocks of emitters. */
    if (pixels[p + 3] < 128) continue;
    opaque[i] = 1;
    const value = 1 - (0.299 * pixels[p] + 0.587 * pixels[p + 1] + 0.114 * pixels[p + 2]) / 255;
    raw[i] = value;
    sum += value;
    seen++;
  }

  /* The masked cells are filled with the mean of the real ones before levelling
     and zeroed after it. They have to hold *something* while `autoLevel` and
     `centreMidtone` run, because both read the whole frame to find its extent
     and its middle — and a fifth of the array sitting at zero would stretch the
     ramp to accommodate a value that is not in the photograph. The mean is the
     one fill that moves neither statistic. `contrast` takes the mask and puts
     them back to nothing. */
  const mean = seen > 0 ? sum / seen : 0;
  for (let i = 0; i < count; i++) if (opaque[i] === 0) raw[i] = mean;

  return { values: autoLevel(raw), opaque };
}

function contrast(values: Float32Array, opaque: Uint8Array): Float32Array {
  const out = new Float32Array(values.length);
  for (let i = 0; i < values.length; i++) {
    /* Outside the mask, unlit — see `readInverted`. `unsharp` will have bled a
       little of the fill across the boundary by now, and this is what stops
       that halo becoming a ring of dots around the circle. */
    if (opaque[i] === 0) continue;
    const pushed = (values[i] - 0.5) * GAIN + 0.5;
    out[i] = (pushed < 0 ? 0 : pushed > 1 ? 1 : pushed) * UNCAP;
  }
  return out;
}

/**
 * Far enough past the field that every emitter is fully lit.
 *
 * `paintPanel` takes a wavefront position and lights each emitter by how far
 * behind the front it stands. That is what the arrival uses; here there is no
 * arrival, so the front is put beyond the last cell and the whole field paints
 * at its own values. One number is the difference between a picture dissolving
 * and a picture standing still.
 */
const LIT = 1e6;

/**
 * Him, in the matrix, and staying there.
 *
 * Every other photograph on this site *arrives* through the dot field and
 * resolves into itself — `lib/glyph/sweep.ts` running a wavefront across a
 * canvas and fading the photograph up behind it. This one does not resolve.
 * The owner asked for the picture to carry the glyph language, and a treatment
 * that is only visible for the second and a half of its entrance is not a
 * language the page speaks; it is a transition it plays. So the field is
 * painted once and held.
 *
 * That also settles what the picture is made of. A resolved photograph is the
 * only full-colour thing this site would hold that is not a quotation of
 * somebody else's artwork — album covers and company marks keep their colours
 * because they belong to other people, and his own photograph belongs to the
 * page. Painted as emitters it is drawn in the page's own ink, on the page's
 * own ramp, and the monochrome law needs no exception for it.
 *
 * Law 4 is satisfied by there being no motion at all: the field is painted on
 * mount and repainted only when the box or the skin changes, so a page at rest
 * holds a still picture. There is no loop here and nothing for reduced motion
 * to withhold.
 *
 * This is the *panel* renderer — `lib/glyph/panel.ts`, whose emitters are one
 * size and carry tone in brightness. It is not `lib/glyph/pixel.ts`, which
 * draws the dot language behind GlyphCell, GlyphIcon and GlyphText. The two are
 * constantly mistaken for each other.
 *
 * `centreMidtone` is not optional here. The file is a night shot whose values
 * pile onto a single step; without the correction a third of the emitters land
 * on one level and the field reads as a slab rather than as a person. `unsharp`
 * is what the slab still needs after that, and the crop is what neither of them
 * could have fixed: the corrections decide how well the picture is drawn, and
 * the window decides what it is a picture of.
 */
export function Portrait({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const panelRef = useRef<Panel | null>(null);
  const [ready, setReady] = useState(false);

  /* Sample the file once, at whatever cell count the box asks for, and keep
     the values. Sampling reads the decoded image back out of a canvas, which
     taints on a cross-origin source — this file is same-origin, and it has to
     stay that way or `getImageData` throws and the picture never appears. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let live = true;
    const image = new window.Image();
    image.decoding = "async";

    const sample = () => {
      const box = host.getBoundingClientRect();
      if (!live || box.width < 2 || box.height < 2) return;

      const cols = Math.max(2, Math.round(box.width / PITCH));
      const rows = Math.max(2, Math.round(box.height / PITCH));

      /* The crop, done here rather than in CSS: the field is sampled from the
         window of the file the box should show, so the emitters are the crop
         rather than a squashed whole. Clamped to the file on both axes, so a
         very wide or very tall column asks for a window that exists. */
      const bandWidth = Math.min(FILE.width, FILE.width * zoomFor(cols));
      const bandHeight = Math.min(FILE.height, (bandWidth * box.height) / box.width);
      const sx = Math.max(0, Math.min(FILE.width - bandWidth, FILE.width * FOCUS.x - bandWidth / 2));
      const sy = Math.max(
        0,
        Math.min(FILE.height - bandHeight, FILE.height * FOCUS.y - bandHeight / 2),
      );

      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(image, sx, sy, bandWidth, bandHeight, 0, 0, cols, rows);

      const pixels = octx.getImageData(0, 0, cols, rows).data;
      /* Levelled, then centred, then separated, then spread: extent, position,
         local difference, global range — each correction taking the frame the
         one before it left, and the local one done while the values still carry
         the picture rather than the ink. */
      const { values: read, opaque } = readInverted(pixels, cols * rows);
      const levelled = centreMidtone(read);
      const radius = Math.max(1, Math.round(cols / EDGE.per));
      const values = contrast(unsharp(levelled, cols, rows, radius, EDGE.amount), opaque);
      panelRef.current = { cols, rows, values };
      setReady(true);
    };

    image.onload = sample;
    image.src = FILE.src;

    const observer = new ResizeObserver(() => {
      if (image.complete && image.naturalWidth > 0) sample();
    });
    observer.observe(host);

    return () => {
      live = false;
      observer.disconnect();
    };
  }, []);

  /* Paint. Separate from sampling because the two change for different
     reasons: the values change when the box or the file does, and the ink
     changes when the visitor switches skin — and a skin switch must not
     re-read the image. */
  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || !ready) return;

    const draw = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const box = host.getBoundingClientRect();
      if (box.width < 2 || box.height < 2) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(box.width * dpr);
      canvas.height = Math.round(box.height * dpr);
      canvas.style.width = `${box.width}px`;
      canvas.style.height = `${box.height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* The ink is read off the element rather than named, so the field is
         whatever the skin says the page's text is and a skin switch repaints
         it without this file knowing which skins exist. */
      const ink = getComputedStyle(host).color || "#0f0f0f";
      paintPanel(
        ctx,
        panel,
        { width: box.width, height: box.height, originX: 0, originY: 0 },
        LIT,
        BAND,
        ink,
      );
    };

    draw();

    const observer = new ResizeObserver(draw);
    observer.observe(host);

    /* A skin switch changes `color` on the document, not on this element's own
       style, so there is nothing to listen to but the class that carries it. */
    const skin = new MutationObserver(draw);
    skin.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      skin.disconnect();
    };
  }, [ready]);

  return (
    <div
      ref={hostRef}
      className={`relative overflow-hidden text-ink ${className}`}
      /* The picture is the page's, and what a reader who cannot see it is owed
         is what is in it — not how it was drawn. */
      role="img"
      aria-label="Kenny Olajide, smiling, in glasses and a chess-award T-shirt, drawn as a field of dots. A stand-in photograph, pending a real portrait."
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
