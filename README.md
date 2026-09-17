# Kenny Olajide — Portfolio

A single-person portfolio for Kenny Olajide, product designer. Endgame AI and
ChessEver are the two pieces, shown the way the App Store shows them: real
icon, real screens, live rating, live seller, read from Apple's public lookup
endpoint with a committed snapshot as the floor.

Live at `https://kenny-olajide-portfolio.vercel.app`.

## What this is a port of

The design language is `portfolio-v2` — Damilare Osofisan's own portfolio —
carried across 1:1 and tailored to Kenny's information. The spec for that
switch, including everything it deliberately cut, is
`docs/superpowers/specs/2026-09-15-v3-design-language-switch.md`.

Three routes, and no others: `/`, `/about`, `/shots`.

Two deliberate departures from 1:1, both recorded in the spec:

1. **The typeface.** The source is set in Suisse Int'l, whose licence is
   per-site. This is set in **Geist** and **Geist Mono** — a neo-grotesque with
   close proportions, free under the SIL Open Font Licence. It is a one-file
   swap if a licence is ever obtained.
2. **The shots layout.** The source's twelve-track masonry feed is built for
   artwork of mixed aspect ratios. Every frame here is a 1284×2778 phone
   screenshot, so the feed was replaced with a grouped uniform gallery. The
   reasoning is written at the top of `components/shots-wall.tsx`.

## Content honesty

Nothing about Kenny's career is invented here.

- `data/experience.ts` holds six roles, five of them read from
  `linkedin.com/in/kenny-olajide-b5476216a` on 2026-09-14. The sixth — Endgame
  AI — has dates supplied by the owner directly and a **title inferred** from
  his headline and the identical title he held immediately before; his profile
  carries no Endgame entry. That provenance is recorded in the file itself.
- `SmallChess`, an unconfirmed employer name from a ZoomInfo scrape, does not
  ship. `data/placeholders.test.ts` asserts it never appears.
- Both product-design roles have **ended**. Nothing on the site may imply he is
  currently employed anywhere, and the copy is derived from the dates rather
  than written, so it cannot drift: `lib/experience.ts`'s `standing()` chooses
  the tense.
- `data/site.ts`'s `url` and `email` are still unconfirmed assumptions.

## Photographs — what to send

`public/portrait/kenny.png` is a **stand-in**, taken from Kenny's LinkedIn
photo. It is labelled as one everywhere it appears. It is also, right now, the
favicon, the home-screen icon and the OG share card, all derived from that one
file by `lib/portrait-file.ts` — so replacing it replaces all of them at once.

Three files would finish the site. In order of what they change:

| Slot | What it is | Shape | Where it lands |
| --- | --- | --- | --- |
| 1. Portrait | Head and shoulders, him looking at the camera, plain background. This is the one the icons crop, so the head must survive being 32px wide. | Square, 1200px or larger, PNG or JPG | `public/portrait/kenny.png` — replaces the stand-in |
| 2. At the board | Playing or teaching. The five years of it are the reason he is credible on chess software, and the site says so in words with nothing to show for it. | Square, 1200px or larger | `/about`, first empty slot |
| 3. At work | Screen, desk or studio. Any context that is clearly design work rather than a portrait. | Square, 1200px or larger | `/about`, second empty slot |

Black and white is not required — the portrait is painted as a dot field in the
site's own ink by `components/portrait.tsx`, and the two smaller slots are
rendered through the same panel treatment as every other photograph on the
site. Colour files are fine; they are read for luminance.

Until they arrive, the two empty slots print the brief above on the page. That
is deliberate: an empty frame that says what belongs in it is honest, and a
slot padded out with an App Store screenshot would be the site pretending
product work is photography.

## Running it

```
pnpm install
pnpm dev      # local dev server
pnpm test     # vitest — 315 tests across 33 files
pnpm lint     # eslint, flat config
pnpm build    # production build
pnpm manifest # regenerate data/assets.generated.ts after adding files to public/shots
```

Package manager is `pnpm` only — never `npm` or `yarn`.

## The design system

Monochrome, two skins, no accent hue. The ramp is the source's, carried across
whole: `--bg #fcfcfc` through `--text-1 #0f0f0f` on the light skin, `--bg
#090909` through `--text-1 #f5f5f5` on the dark. Every token lives in
`app/globals.css`.

Measured contrast, asserted in `lib/contrast.test.ts` rather than assumed:

| Ink | Light on `--bg` | Dark on `--bg` |
| --- | --- | --- |
| `--text-1` | 18.68 | 18.26 |
| `--text-2` | 7.04 | 7.08 |
| `--text-3` | 4.37 | 3.79 |

`--text-3` is **under AA on the light skin** and that is a pinned, tested fact
rather than an oversight. It is the quiet ink — labels, years, captions — and
never body copy. Pushing it to 4.5 would flatten the three-step ink ramp the
"genuinely distinct" test guards. Its floor is 3:1, held on all six
ground/skin combinations.

## Type

Six fluid steps, every one used. `lib/type-scale.test.ts` asserts no surface
smuggles in an arbitrary font size, and lists the files it governs.

## Motion

One rule, and it has been broken once per iteration of this project, so it is
written here as well as in the code:

> The `prefers-reduced-motion` block in `app/globals.css` reaches
> **CSS-declared animations only**. Anything driven by `motion`, by the Web
> Animations API, or by `requestAnimationFrame` needs its own
> `useReducedMotion()` guard. A bare `*` selector matches neither a
> script-created animation nor a `::view-transition-*` pseudo-element.

Two corollaries that cost real defects: `AnimatePresence` must outlive the
element it animates away, and a `layoutId` **is** the animation — guard it by
withholding the id from **both** halves of a pair.

## The easter egg

Type `e4` anywhere that is not a text field. A real chess position appears:
White Ka6, Qa1 against Black Ka8, White to move and mate in one. The answer is
`Qh8#` and it is the **only** mate — the position was found by enumerating
every King-and-Queen versus King arrangement and keeping only those with
exactly one mating move. `lib/chess.test.ts` carries the checker that proves it.

No move generator ships. `lib/chess.ts` holds the position and the one correct
move; the test file holds the search that validated them.

## Deployment

Vercel, project `kenny-olajide-portfolio`, from `main`.

```
pnpm build
vercel deploy --prod
```

The App Store lookup is unauthenticated and needs no key. It revalidates every
six hours; when it cannot be reached the cards fall back to the snapshot in
`data/app-store.ts`, which is a real reading one interval old rather than a
placeholder. `components/app-store-card.tsx` marks which it drew with
`data-store="live"` or `data-store="recorded"`, so the degraded path can be
verified on a live page.
