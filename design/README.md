# Landing page concepts

Three directions for the GMZ homepage, for Xavier to pick from. They are
standalone HTML comps, not wired into the Astro build, so nothing here can
break `npm run build`.

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

- `public/brand/gmz-logo.png` — trimmed master, navy wordmark, for light grounds
- `public/brand/gmz-logo-knockout.png` — white wordmark, for dark grounds

### One thing to settle

`src/styles/tokens.css` currently sets `--gmz-green: #2e7d32` and
`--gmz-ink: #222222`, and its comment says the palette came from the bid
documents. Neither value is the logo. Before a concept is built out, decide
which is authoritative: the bid-document green or the logo green. Whichever
wins should be the only one, in `tokens.css`, per "one fact, one home."

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

## Taking one forward

Follow `DESIGN-HANDOFF.md`. In short: the chosen concept's values go into
`src/styles/tokens.css` (names stay), the markup moves into the matching
`.astro` files, hard-coded facts get swapped for `site.ts` reads, and `<img>`
becomes `<Image />`.

Each concept already carries the accessibility floor the handoff requires: a
skip link, visible `:focus-visible` rings, one `h1`, `aria-current` on the
brand link, alt text on every image, and a `prefers-reduced-motion` block.

## Still outstanding

- A proper **SVG** of the mark. Tracing the PNG produced a badge whose interior
  filled inverted, so the PNG is what ships here. The SVG is still worth having
  and is best exported from the original vector artwork rather than traced.
- `public/favicon.svg` and `public/og-default.jpg` are still the generated
  placeholders.
- `src/data/content.ts` spells "defence" in the change-orders lede; the rest of
  the site is US English.
