# v3 — Design language switch

Date: 2026-09-15
Status: approved for planning
Supersedes the visual half of both prior specs. What survives from them is
listed in §6; everything else about how the site looks is replaced.

## 0. What happened

The owner looked at v2 and said, plainly, that he is not a fan of the design
language. The instruction is to switch to the language of
`portfolio-v2-6uw8wumuj-damilares-projects-fc682e5f.vercel.app` — Damilare's own
portfolio — **1:1**, tailored to Kenny's information, and to cut the site to
three routes.

This is not "inspired by". The source is on this machine at
`/Users/v/portfolio-v2` and is the specification. Where this document and that
codebase disagree, the codebase wins.

## 1. Scope

**Three routes, and no others:** `/` (home), `/about`, `/shots`.

**Explicitly cut**, by instruction: the instrument wall and every live widget
(now-playing, steps, weather), `/colophon`, `/changelog`, `/system`. The
instruments are the most distinctive thing in the source and they are still out
— they report on Damilare's life, not Kenny's, and a borrowed pulse is worse
than no pulse.

**The repository and the URL do not change.** The site keeps
`github.com/damilareoo/kenny-olajide-portfolio` and
`kenny-olajide-portfolio.vercel.app`. This is a replacement of what is inside,
not a new project.

## 2. Typeface — the one deliberate divergence from 1:1

The source is set in **Suisse Int'l**, a commercial typeface from Swiss
Typefaces whose licence is per-site. Copying its six woff2 files into a second
public repository on a different domain would very likely exceed whatever
licence covers damilareoo.xyz, and that is a letter rather than a bug.

The owner chose a free near-match. The site is set in **Geist** and **Geist
Mono** — a neo-grotesque with proportions close to Suisse, free under the SIL
Open Font Licence.

This is the only place the site knowingly departs from 1:1, it is recorded
here, and it is a one-file swap: replacing the font binding restores Suisse if
a licence is ever obtained.

## 3. What gets carried across from the source

Verbatim where it can be, adapted only where Kenny's facts differ.

- **The token system.** `app/globals.css` — the monochrome ramp (`--bg #fcfcfc`
  through `--text-1 #0f0f0f`, and the dark skin), the six-step fluid type
  scale, the rule/pixel tokens. Not the v2 palette read off dejiajetomobi.com
  and jakub.kr; that palette goes.
- **The home's shape.** A lockup — `'Kenny Olajide` — a claim in his own words,
  then the record as a running sentence with company marks set inline where the
  names would be, then the work, numbered, in the order `data/work.ts` lists it.
  No selected-work grid, no asymmetric column split, no hero at display size.
- **`SiteNav`, `FooterLine`, `Product`, `CompanyMark`, `GlyphIcon`,
  `GlyphText`,** and the glyph engine under `lib/glyph/` that draws them. The
  dot-matrix icon language is part of the look and stays even though the
  instruments it also served do not.
- **The App Store card.** `components/app-store-card.tsx` and `lib/app-store.ts`
  — Kenny's two pieces are both iOS apps, which is exactly the case the source
  built that card for.
- **`/about`'s shape** — the record, the role ladder, the portrait.
- **`/shots`** — the masonry feed, its column-fill arithmetic in
  `lib/shots-layout.ts`, and its tested bucketing.

## 4. Kenny's information, in the source's schemas

The source's `Role` carries `role, company, url, period, location, engagement?,
logo?, mark?` — a different shape from v2's. His six roles are re-expressed in
it. `period` is a single string like `"Apr 2026 — Aug 2026"`, parsed by
`lib/experience.ts`, which throws on a malformed one.

| Role | Company | Period |
| --- | --- | --- |
| Product Designer | Endgame AI | Apr 2026 — Aug 2026 |
| Product Designer | ChessEver | Apr 2025 — Mar 2026 |
| Content Editor | Forward Chess | Mar 2024 — Apr 2024 |
| Content Editor | Telebu Communications | Nov 2022 — May 2023 |
| Technical Content Editor | Chessable | Feb 2021 — Jun 2022 |
| Chess & Scrabble Instructor | Grand Cortex Centre | May 2017 — Dec 2022 |

Five came from `linkedin.com/in/kenny-olajide-b5476216a`; Endgame's dates came
from the owner directly and its title is an inference from his headline and the
identical title he held immediately before. That provenance stays recorded in
the data file.

**Company marks.** `public/companies/endgame.png` and `chessever.png` already
exist in the source — Damilare worked at both — and are the two Kenny's most
recent roles need. The older four have no artwork here; a role with no `logo`
is set in the site's own mono by `CompanyMark`, which is the source's own
designed fallback, not a gap.

**No open roles.** Both of his product-design roles have ended, so
`standing()` resolves to the most recent rather than to a current post, and the
sentence reads "Most recently a product designer at Endgame AI". Nothing on the
site may imply he is currently employed anywhere.

## 5. `/shots`

Fourteen real screenshots, pulled from the two App Store listings at 1290px:
eight from Endgame AI, six from ChessEver. They are the products' own design
work, which is what a shots page on a product designer's site should hold.

The source's feed is built for artwork of mixed aspect ratios and buckets by
measured cell height. These are all 1284×2778 portrait, so the fill is uniform
— correct, but worth knowing it is not exercising the bucketing the way mixed
art would.

## 6. What survives from v1 and v2

Not visual, and all of it stays:

- **Content honesty.** `data/writing.ts` is gone with the route, but nothing
  about Kenny may be invented, the portrait remains a labelled placeholder, and
  the guard against the unverified `SmallChess` employer stays.
- **The real 404s.** `dynamicParams = false` on any dynamic route that sits
  behind a loading state.
- **The contrast harness.** Re-pointed at the source's ramp — the figures
  change, the discipline does not.
- **Reduced motion.** The CSS block reaches CSS-declared animation only;
  anything JS-driven guards itself. `AnimatePresence` outlives its child. A
  `layoutId` is guarded by withholding the id.
- **The chess easter egg.** `lib/chess.ts` and its overlay, triggered by typing
  `e4`, solving Ka6/Qa1 vs Ka8 with the unique `Qh8#`. It is Kenny's, it was
  asked for by name, and it does not belong to either design language. Its
  board is re-drawn in the new tokens.
- **The correct LinkedIn URL**, and the test that keeps it correct.

## 7. Out of scope

The instruments, the colophon, the changelog, the system page, a writing
surface, an accent colour, analytics, a contact form. And Suisse Int'l, until
somebody holds a licence for it.
