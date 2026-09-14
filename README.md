# Kenny Olajide — Portfolio

A single-person portfolio for Kenny Olajide, product designer. Endgame.ai and
ChessEver are the two selected pieces, shown the way the App Store shows them:
real icon, real screens, live rating, live seller, all read from Apple's
public lookup endpoint. The voice is Kenny's, first person singular.

This is a new repository with its own deployment. It is not a fork of
`portfolio-v2` and not an edit of the earlier joint Kenny-and-Damilare page.

## Placeholder content — read this before trusting anything career-shaped

Two data files in this repository are stand-ins, not facts:

- `data/experience.ts` and `data/writing.ts` both export `IS_PLACEHOLDER = true`,
  and every record in both files carries its own `placeholder: true` flag.
- **Kenny's real career history is not known to this repository.** LinkedIn
  answers HTTP 999 to automated fetches, so his profile could not be read.
- A web search surfaced fragments from a ZoomInfo scrape. Those employer names
  were deliberately **not** used anywhere in the shipped data —
  `data/placeholders.test.ts` asserts they never appear in `data/experience.ts`.
- The placeholder records are shaped exactly like real ones (same fields, same
  types), so replacing them is a content edit, never a structural one.
- `data/site.ts`'s `url` and `email` are unconfirmed assumptions, not verified
  facts about Kenny.
- The hero line in `app/page.tsx` ("Kenny Olajide is a product designer
  working on chess software for people who play it.") is unapproved
  placeholder copy.

None of this blocks development — routes, metadata, OG images, and loading
states around the placeholder content are real and finished. Only the words
inside them are stand-ins.

## Running it

```
pnpm install
pnpm dev      # local dev server
pnpm test     # vitest — 92 tests across 18 files, all passing
pnpm lint     # eslint, flat config
pnpm build    # production build
```

Package manager is `pnpm` only — never `npm` or `yarn`.

## The colour system

Two skins, neutrals only, no accent hue. Light is read out of
`dejiajetomobi.com`'s shipped stylesheet; dark out of `jakub.kr`'s. Both were
read directly from the CSS that ships on those sites, not sampled from
screenshots or guessed. Provenance: light `--text-2` is Deji's `.body-text`
colour, `--text-3` is his inactive `.nav-brand`, `--chip` is his
`.social-link` background; dark comes from jakub.kr's `--color-gray-background`,
`--color-gray-100/200`, `--color-gray-500/600`, `--color-gray-1200`,
`--color-text-paragraph`, `--color-gray-1100`, and `--color-gray-1000`, in that
order.

All ten tokens, read from `app/globals.css`:

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--bg` | `#ffffff` | `#101010` | The page ground |
| `--surface` | `#f0f0f0` | `#191919` | A raised card |
| `--surface-2` | `#e8e8e8` | `#222222` | A pill, an active state |
| `--border` | `#e6e6e6` | `#313131` | A hairline between things |
| `--rule` | `#d4d4d4` | `#3a3a3a` | A separator that is meant to be seen |
| `--text-1` | `#000000` | `#eeeeee` | Names, headings |
| `--text-2` | `#6c6a6a` | `#dbdbdb` | Body and paragraphs |
| `--text-3` | `#767676` | `#b5b5b5` | Inactive nav, captions, counts |
| `--text-4` | `#9a9a9a` | `#7b7b7b` | Decorative marks and disabled states — never type |
| `--chip` | `rgb(165 165 165 / 0.2)` | `rgb(255 255 255 / 0.06)` | Translucent label fill |

`--chip` is written in `rgb()` rather than as the equivalent hex-with-alpha so
that the contrast harness's hex parser skips it — it is a translucent fill,
and its effective contrast depends on what sits behind it, so a figure
measured against the token alone would be meaningless.

### Ink placement rules

Every pair was measured before any of it was built. The light skin is the
binding constraint — jakub's dark ramp clears AA almost everywhere.

- **`--text-1`** may be used on any ground: 21.00 on `--bg`, and it stays well
  clear of AA on both raised surfaces too.
- **`--text-2`** measures 5.37 on `--bg` and carries body copy there and on
  `--surface`. On `--surface-2` it measures 4.39, so it is permitted only at
  large-text sizes there.
- **`--text-3`** measures 4.54 on `--bg` and carries body copy on `--bg`
  only. It measures 3.99 on `--surface`, below AA, so on either raised
  surface it is restricted to inactive nav, captions, and counts, never body
  copy.
- **`--text-4`** measures 2.81 on `--bg` and fails AA on all three light
  grounds — it fails even the 3:1 large-text floor on all three. It is **not
  a text token**: decorative marks and disabled states only, no type on this
  site is set in it.

`lib/contrast.test.ts` enforces all four rules, including pinning the
failures (`--text-3` on `--surface`, `--text-4` everywhere) as explicit
assertions. A token cannot be nudged later without a test stating what the
nudge cost.

## Typography

Inter only, via `next/font/google`, self-hosted at build time. No second
typeface anywhere — a label and a heading are the same font doing two
different jobs.

Six-step scale: `--text-2xs`, `--text-xs`, `--text-sm` are fixed pixel-to-rem
values, and `--text-base`, `--text-lg`, `--text-xl` are fluid `clamp()`
values ramping 320px to 1280px and stopping. The three small steps are fixed
because they carry captions, labels, years and counts — type already at its
floor, which gets worse rather than better when it grows with the window.
The three large steps stop growing at roughly the point the page's measure
stops growing, past which bigger is not more readable. Both ends of every
clamp are written in `rem`, and so is the leading term of the preferred
value, so browser text-size and zoom still reach them — a preferred value in
pure `vw` would pin the size to the window and ignore the visitor's own
setting entirely.

OpenType features: `tnum` on every figure so ratings, years, and counts don't
jitter when they change; `ss02` (Inter's "Disambiguation (with zero)") for
the I/l/1 collision and the slashed zero; `case` for punctuation set beside
capitals. `cv05` is deliberately absent — it would duplicate work `ss02`
already does.

## Motion

Every animation resolves to the token set in `lib/motion.ts`: `EASE_OUT`
(`cubic-bezier(0.22, 0.61, 0.36, 1)`), `EASE_INOUT`
(`cubic-bezier(0.65, 0, 0.35, 1)`), four durations (`DUR.micro` 180ms,
`DUR.base` 420ms, `DUR.staged` 720ms, `DUR.entrance` 1200ms), `STAGGER`
(60ms, the offset between staged items arriving), and `HOLD` (200ms, how
long a finished thing rests before it leaves). Nothing hand-rolls a duration
or a curve, including Tailwind's implicit ones — `@theme inline` in
`app/globals.css` rebinds `--default-transition-duration` and
`--default-transition-timing-function` so a bare `transition-colors` lands
on the token set too.

`EASE_OUT` at `DUR.base` is borrowed verbatim from `dejiajetomobi.com`'s nav
pill transition — `width .42s cubic-bezier(.22,.61,.36,1)` — the number
carried over intact rather than eyeballed into something close.

Two rules cost real debugging time to arrive at:

- The `globals.css` reduced-motion block reaches CSS-declared animations and
  transitions only. Anything driven by the `motion` library or the Web
  Animations API (the theme toggle's View Transitions circle, for example)
  needs its own `useReducedMotion()` guard in the component — a bare `*`
  selector matches neither a script-created animation nor a
  `::view-transition-*` pseudo-element.
- A `layoutId` **is** the animation, not a setting on top of one. The guard
  for reduced motion therefore withholds the id itself rather than shortening
  a duration, and both halves of a shared-element pair (the work card's icon
  and the case header's icon, for instance) must withhold on the same
  condition — otherwise one half animates while the other snaps, which reads
  as broken rather than as reduced.

`AnimatePresence` must outlive the element it animates away — it has to wrap
the point in the tree where the element is conditionally rendered, not sit
below it, or the exit animation never gets a chance to run.

## The App Store integration

`lib/app-store.ts` reads Apple's public iTunes Lookup API
(`https://itunes.apple.com/lookup`) — no key, no auth — once every six hours
(`REVALIDATE_SECONDS = 21_600`), matching rows back to apps by `trackId`
rather than by position. Every field is merged individually over a committed
snapshot in `data/app-store.ts`, with assets under `public/apps/`: a rating
with no vote count, or an empty `screenshotUrls` array from a listing
mid-deploy, falls back to the recorded figure rather than printing a hole.
Every failure mode — refused connection, non-OK response, unparseable body,
a network-less build — ends at the same recorded floor.

A literal App Store embed is impossible: `apps.apple.com` sends
`x-frame-options: DENY` and `frame-ancestors 'none'`, so there is no iframe
to build and no widget to borrow. The card is drawn from the lookup JSON
instead, in the site's own type and ink.

The `data-source` attribute on `AppStoreMeta`'s root element (`"live"` or
`"recorded"`) is not printed anywhere in the UI. It exists so the degraded
path can be verified — point the lookup at a host that won't answer, load
the page, read the attribute — rather than argued about.

## What was ported from `/Users/v/portfolio-v2`, and why

Six things, and nothing else:

- `lib/app-store.ts` — the iTunes Lookup client, its six-hour revalidation
  reasoning, and the live/recorded merge.
- `data/app-store.ts` — the committed snapshot floor for both listings, with
  measured per-app screenshot ratios.
- The artwork proxy route (`app/api/app-store/art/[...src]/route.ts`) — keeps
  Apple's CDN behind a same-origin proxy rather than in the image
  optimiser's allowlist, so no component gets blanket permission to load
  from `mzstatic.com`.
- `public/apps/*` — real icons and screenshots already downloaded from the
  live payload.
- `lib/contrast.ts` — the harness that holds every token pair to a measured
  ratio.
- `lib/use-media-query.ts`, `lib/use-mounted.ts` — two hooks that read
  external browser state (a media query, "have I hydrated yet") through
  `useSyncExternalStore` rather than a `useState` + `useEffect` mounted flag.
  Deliberately: a `useEffect` that sets state after mount is a state write
  after paint, which either tears the frame or forces a second render; reading
  the same fact through `useSyncExternalStore` gets the server snapshot right
  on first paint and corrects it on hydration with no such write.

No component, no token value, and no typeface crosses over.

## The soft-404 trap, and its fix

`portfolio-v2` shipped a soft-404 that this project deliberately avoids
repeating: a case-page route sits behind a root `app/loading.tsx`, so Next
serves a prerendered shell and commits HTTP 200 before the page's body
streams in. If `notFound()` is only reached during that later render, the
status has already been sent and can never change to 404 — the page renders
"not found" content on a `200`.

The fix is `export const dynamicParams = false` on both dynamic routes
(`app/work/[slug]/page.tsx` and `app/writing/[slug]/page.tsx`), which moves
the decision to the router instead of the render: an unlisted slug is
rejected before the loading shell is ever served.

Verified against a production build:

```
$ pnpm build && pnpm start &
$ curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/work/nope
404
$ curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/writing/nope
404
```

## Deployment

Live: https://kenny-olajide-portfolio.vercel.app

Repository: https://github.com/damilareoo/kenny-olajide-portfolio (private)

Deployed with `vercel deploy --prod`. Verified live on first deploy: every route
returns its correct status (including real 404s at `/work/nope` and
`/writing/nope`), the OG image and icon serve real PNGs, and both case pages
report `data-source="live"` — Apple's iTunes Lookup API is answering in
production rather than the committed snapshot standing in for it.

Note on `site.url`. The sitemap and every canonical URL are built from
`site.url` in `data/site.ts`, which is currently `https://kennyolajide.com` — an
assumption, not a confirmed domain. The site is served from the Vercel URL
above. Until the real domain is settled, the sitemap advertises addresses that
may not resolve. Correcting it is a one-line edit in `data/site.ts`; nothing
else hardcodes a domain.
