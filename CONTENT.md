# Adding content

Everything on this site that changes is a Markdown file in `src/content/`.
Adding a project means adding one file and some photos; no code changes.

## Adding a project

**1. Put the photos in `src/assets/portfolio/<slug>/`.**

One folder per project, named after the slug you are about to use:

```
src/assets/portfolio/marlowe/
  marlowe-hero.jpg
  marlowe-built-entry.jpg
  marlowe-entry-full.jpg
```

Export around 1800px wide for a grid image and 2400px for a `full` crop. The
build generates every smaller size and the WebP versions, so there is no need
to resize by hand and no reason to upload a 12MB file straight off the camera.

**2. Create `src/content/portfolio/<slug>.md`.**

The file name becomes the URL: `marlowe.md` → `/work/marlowe`.

```markdown
---
name: 'Marlowe'
title: 'Courtyard living, front to back'
kicker: 'Design & Construction'
meta: 'Hillside property'
scope: ['Hardscape', 'Planting']
phase: 'Built'
summary: 'One or two sentences. Shows on the index card and under the project title.'
order: 2
hero:
  label: 'The courtyard'
  src: '../../assets/portfolio/marlowe/marlowe-hero.jpg'
  alt: 'A gravel courtyard beside a Spanish-tiled house, terracotta paving and clipped hedging.'
---
```

That is a complete, valid project. Everything below is optional.

**3. Run `npm run dev`** and check it. Then `npm run build`, which is what
actually catches mistakes.

### The fields

| Field     | Notes                                                               |
| --------- | ------------------------------------------------------------------- |
| `name`    | How the project is indexed. See "Naming" below                      |
| `title`   | The editorial headline                                              |
| `kicker`  | Small label above the name, e.g. `Conceptual Design`                |
| `meta`    | One-line descriptor shown opposite the name. **Not an address**     |
| `scope`   | The trades. Rendered as a list and joined with `·`                  |
| `phase`   | Where the job stands, in GMZ's own words                            |
| `summary` | The paragraph under the header, and the index blurb                 |
| `order`   | Index position. Explicit, because the design sets the running order |
| `hero`    | The index card image. Falls back to the first drawing when absent   |

### The optional sections

Each one appears on the project page only when it is present, in this order:

- **`walkthrough`** — the film. A `drive:` id, a local `file:`, or `pending: true`
  for footage that exists but is not in the repo. Can also carry a row of
  `clips:` and a second row of `beforeAfter:` clips.
- **`built`** — the "Finished" grid, photographed on completion.
- **`photos`** — the "Photographs" grid, more from the site.
- **`drawings`** — the tabbed set, the design as it was drawn.
- **`alternates`** — schemes that were drawn and not chosen, in named groups.
- **`compare`** — the drag-to-compare slider. One `pairs:` entry gets no tabs;
  more than one gets a tab strip.

Copy the shape from an existing project rather than working from this list.
`marlowe.md` uses every section and is the one to crib from.

## Alt text is required

Every image needs `alt`. The schema rejects the entry without it and the build
stops, which is deliberate: a portfolio that is almost entirely photographs is
unusable to anyone using a screen reader if the images are unlabelled.

`label` and `alt` do different jobs and should usually differ:

```yaml
label: 'The stairs' # the visible caption
alt: 'Flagstone treads climbing between rendered walls with stone caps, lit at the risers.'
```

"The stairs" is a fine caption and a useless alt.

## Naming, and client privacy

Projects are indexed by street name, which is how GMZ refers to jobs and what
the design was drawn around. **Never add a house number**, and keep `meta` to a
descriptor rather than an address.

Be aware of what this means: a street name plus a photograph of the house is
often enough to identify whose garden it is. That is the reason the whole
portfolio sits behind the unlock veil instead of being a public marketing site.
If a client would object to their street being named to another prospect, use a
descriptor instead of the street.

## Video

Local clips live in `public/media/` and are referenced by filename:

```yaml
walkthrough:
  note: 'A walking video of the finished yard, recorded on completion.'
  file: 'hamilton-walkthrough.mp4'
```

The path is checked at build time, the same as an image. Name a file that is not
there and the build stops.

Where the footage exists but is not in the repo yet, say so:

```yaml
walkthrough:
  note: 'A walking video of the finished yard, recorded on completion.'
  pending: true
```

That renders the design's "Walkthrough to come" panel, which is honest about
the gap rather than showing an empty frame. Swap `pending: true` for `file:`
when the mp4 lands.

**Google Drive embeds** (`drive: '<file id>'`) are a last resort, for footage
GMZ has no local copy of. They only work while the Drive file stays
link-shared, and nothing at build time can check that: revoke the share and the
player silently goes blank. Copy the file into `public/media/` when you can.

## What must never appear here

Cost, margin, overhead, burdened labor rates, crew-day counts, contingency and
supplier pricing are internal to GMZ. They live in the estimating system. Not in
a content file, not in a comment, not in a commit message.

Client identity is protected too: no house numbers, and no naming a client.

## Adding an FAQ answer

`src/content/faqs/<slug>.md`. An answer stays invisible until
`published: true`:

```markdown
---
question: 'How long does the design take?'
short: 'Design timeline'
phase: design
serviceLine: design-build
published: false
needsDecision: true
decisionNote: 'Xavier has not settled on a stated lead time.'
---

The answer, in Markdown.
```

Leave `published: false` while the underlying policy is undecided. A site that
states a warranty term or a lead time nobody agreed to is worse than a site
that stays quiet, because a client will hold GMZ to whatever it said.

`npm run faq:decisions` lists what is outstanding.
