# Landing page concepts

> **Site Lines was chosen on 2026-08-17 and is now the live design.** It has
> been built out into the Astro site: `src/styles/tokens.css` carries its
> values, and the header, footer and homepage are its markup. The three files
> below stay as a record of what was decided and what was turned down.

Three directions for the GMZ homepage. They are standalone HTML comps, not
wired into the Astro build, so nothing here can break `npm run build`.

Open them straight from disk, or use the hosted links in the chat thread.

| File                                | Concept          | Position it takes                                                                               |
| ----------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| `concepts/01-groundwork.html`       | Groundwork       | Editorial portfolio. Quiet, work-led, for a client comparing GMZ against a landscape architect. |
| `concepts/02-site-lines.html`       | Site Lines       | Dark and structural. For a client who needs to know GMZ can carry a big job.                    |
| `concepts/03-straight-answers.html` | Straight Answers | Trust-led conversion, built on the FAQ content and the free first visit.                        |

These are three different arguments for the same company, not three palettes.
Picking one is picking which argument the homepage makes first.

## Brand, as actually found

The mark came from `GMZ_Logo_color.png` in Drive (the `orale.agency` original).
Sampled off that file, the brand is exactly two colors:

| Role          | Hex       | Where it is in the mark        |
| ------------- | --------- | ------------------------------ |
| Badge green   | `#008C41` | Border ring and the tree panel |
| Wordmark navy | `#002B37` | "GMZ" and "Landscaping"        |

The tree is **negative space**, not a white shape. It shows whatever sits
behind the mark, which is why the knockout works on a dark ground without a
second artwork file.

Assets added to the repo:

- `src/assets/brand/gmz-logo.png` — trimmed master, navy wordmark, for light grounds
- `src/assets/brand/gmz-logo-knockout.png` — white wordmark, for dark grounds

They live under `src/assets/` rather than `public/` so Astro's `<Image />`
optimises them. The header serves the mark at roughly 5kB instead of the 33kB
master.

### The palette question, settled

`tokens.css` used to set `--gmz-green: #2e7d32` and `--gmz-ink: #222222`,
sourced from the bid documents. Neither matched the logo. The logo values
won, because the site has to look like the truck and the business card.
`tokens.css` now carries `#008C41` and `#002B37` and is the only place either
appears.

If the bid documents should have won instead, change those two values and
nothing else: every component reads the tokens.

## What is real and what is not

Everything factual on these pages reads from what is already in the repo:
phone numbers, the mailing address, CSLB #636636, the service-area towns, the
tagline, and the service and project copy.

Deliberately absent:

- **No testimonials.** The only entry is `approved: false`, so no quote may
  render anywhere.
- **No "licensed and insured."** `faqs/licensed-and-insured.md` is still
  `published: false`, so the insurance wording is not settled. The pages cite
  the CSLB number only, which is a settled fact in `site.ts`.
- **No cost, margin, rates or crew-day counts.**
- **No photography.** The green plates are honest stand-ins and each carries a
  "Photography pending" tag. Real photos will change how all three read, and
  concept 1 depends on them most.

The three-step "what happens" sequence on concepts 1 and 3 is taken from the
published answers in `what-happens-on-first-call.md` and
`does-site-visit-cost.md`, so it states no policy that is not already agreed.

## Type

Fonts are embedded as subset woff2 data URIs, so each file is self-contained
and needs no network. All are SIL Open Font License; the license texts are in
`concepts/font-licenses/`.

- **Groundwork** — Young Serif with Instrument Sans
- **Site Lines** — Big Shoulders Bold with Work Sans
- **Straight Answers** — National Park Bold with Work Sans

National Park is the US park-signage face, which is the register the Straight
Answers page is written in.

In the built site the Site Lines faces are **self-hosted** rather than
inlined, in `public/fonts/`, per the handoff's preference over a CDN. Only
Big Shoulders and Work Sans ship; the other two faces exist solely in the
comps above.

## What was carried into the site

Following `DESIGN-HANDOFF.md`:

- `src/styles/tokens.css` holds the Site Lines values. **Every token name is
  unchanged**, which is why nothing needed a find-and-replace: the components
  were already reading tokens, so the palette swap reached all 18 pages.
- `global.css` gained two heading registers. `h1`/`h2` are the display voice,
  condensed and uppercase. `h3`/`h4` stay in the body face, because they land
  on FAQ questions that run a full sentence and condensed uppercase would make
  those a chore. It also holds `.label` and `.surveyline`, the two pieces of
  furniture the design repeats.
- `Header.astro`, `Footer.astro` and `index.astro` are Site Lines markup.
  `ProjectCard.astro` picked up the registration marks so `/work` speaks the
  same language.
- The dark-mode media query is **gone on purpose**, not half-updated. The
  design is already dark and a marketing site presents one identity. The
  reasoning is written into `tokens.css` so nobody re-adds it by reflex.
- Services gained an optional `pullQuote` field. The homepage's "the part you
  never see" section reads it, so those claims live with the service they
  belong to instead of being retyped into the page.

The accessibility floor is intact: skip link, visible `:focus-visible` rings,
one `h1` per page, `aria-current` on the active nav item, alt text on every
image, and the `prefers-reduced-motion` block. The nav wraps on narrow screens
rather than collapsing into a drawer, so there is still no JS to unpick and
nobody loses navigation on a phone.

## Still outstanding

- A proper **SVG** of the mark. Tracing the PNG produced a badge whose interior
  filled inverted, so the PNG is what ships. The SVG is still worth having and
  is best exported from the original vector artwork rather than traced.
- `public/favicon.svg` and `public/og-default.jpg` are still the generated
  placeholders, and both now clash with a dark site.
- **Photography.** Every plate is still a generated placeholder, and the
  homepage hero is now the most valuable one to replace: it is the first thing
  a visitor sees and it is currently an abstract stand-in marked
  "photography pending" on its face. Drop a real photograph in at
  `src/assets/hero/placeholder-hero.jpg` and rewrite `heroAlt` at the top of
  `src/pages/index.astro` to describe it. Nothing else changes.
  A wide frame works best: it is cropped to roughly 2:1 on a desktop and the
  lower third is darkened so the headline can sit on it.
- The contact form only renders when `PUBLIC_CONTACT_ENDPOINT` is set. It has
  been checked against the dark palette and reads correctly, but it is still
  not wired to anything.
- `src/data/content.ts` spells "defence" in the change-orders lede; the rest of
  the site is US English.
