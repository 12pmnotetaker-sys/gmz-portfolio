# Adding content

Everything on this site that changes is a Markdown file in `src/content/`.
Adding a project means adding one file and some photos; no code changes.

## Adding a project

**1. Put the photos in `src/assets/projects/`.**

Name them after the project so they stay findable:

```
src/assets/projects/
  atherton-courtyard-hero.jpg
  atherton-courtyard-terrace.jpg
  atherton-courtyard-before.jpg
```

Shoot or export landscape, around 2000px wide. The build generates every
smaller size and the WebP versions, so there is no need to resize by hand and
no reason to upload a 12MB file straight off the camera.

**2. Create `src/content/projects/<slug>.md`.**

The file name becomes the URL: `atherton-courtyard.md` → `/work/atherton-courtyard`.

```markdown
---
title: 'Atherton Courtyard'
summary: 'One or two sentences. Shows on the card and under the project title.'
location: Atherton, CA
completed: 2026-05-20
serviceLine: design-build
disciplines:
  - hardscape
  - planting
hero:
  src: ../../assets/projects/atherton-courtyard-hero.jpg
  alt: 'A stone terrace with a low seat wall, planted beds behind it.'
gallery:
  - src: ../../assets/projects/atherton-courtyard-before.jpg
    alt: 'The side yard before work, a strip of patchy lawn along a fence.'
    phase: before
  - src: ../../assets/projects/atherton-courtyard-terrace.jpg
    alt: 'The finished terrace seen from the house.'
    caption: 'The terrace, set on a compacted base.'
    phase: after
featured: true
order: 1
duration: seven weeks
---

The body of the file. Plain Markdown. This is where the story of the project
goes: what was there, what was built, and anything worth knowing about how.
```

**3. Run `npm run dev` and look at it.**

If a field is wrong, the build says so by name. A missing photo, a discipline
that is not on the list, a summary over 300 characters: all of these fail the
build rather than shipping broken.

### Quote a value if it contains a colon

`summary: A courtyard: a terrace and a wall` is invalid YAML, because the
second colon starts a new key. Wrap any value containing `:` in double quotes.
When in doubt, quote it.

## The fields

### Required

| Field         | What it is                                            |
| ------------- | ----------------------------------------------------- |
| `title`       | Project name, as it should read on the page           |
| `summary`     | One or two sentences, max 300 characters              |
| `location`    | **Town only.** Never a street address                 |
| `completed`   | `YYYY-MM-DD`. Sets the default ordering, newest first |
| `serviceLine` | `design-build` or `maintenance`                       |
| `disciplines` | One or more. Drives the filter chips on `/work`       |
| `hero`        | `src` plus `alt`. The card and social image           |

Valid disciplines: `hardscape`, `planting`, `irrigation`, `drainage`,
`fencing`, `lighting`, `lawn`, `grading`, `concrete`, `masonry`. To add one,
edit `DISCIPLINES` in `src/content.config.ts` and add a label in
`DISCIPLINE_LABELS` in `src/data/content.ts`.

### Optional

| Field            | Default | What it does                                                  |
| ---------------- | ------- | ------------------------------------------------------------- |
| `gallery`        | empty   | More photos. Each needs `alt`; `caption` and `phase` optional |
| `featured`       | `false` | Shows on the homepage. Keep this to a handful                 |
| `order`          | `0`     | Sort weight among featured items; lower sorts first           |
| `duration`       | —       | Plain words, e.g. `six weeks`                                 |
| `budgetBand`     | —       | A coarse range, e.g. `"$50k–$100k"`                           |
| `showBudgetBand` | `false` | Must be `true` for `budgetBand` to render                     |
| `draft`          | `false` | Visible in `npm run dev`, invisible in production             |
| `testimonial`    | —       | Slug of a file in `src/content/testimonials/`                 |
| `seo`            | —       | `title`, `description`, `noindex` overrides                   |

`phase` on a gallery photo is `before`, `during` or `after`.

## Alt text

Every photo needs it, and the build enforces it. Describe what is in the frame
for someone who cannot see it:

- Not: `"Atherton project"` — that is the title, not a description
- Not: `"photo of a patio"` — "photo of" is noise, and "a patio" is not specific
- Yes: `"A flagstone terrace with a low seat wall along one edge, planted beds behind."`

## Adding a testimonial

`src/content/testimonials/<slug>.md`:

```markdown
---
author: Jane Doe
location: Menlo Park, CA
quote: "The quote itself, in the client's own words."
approved: true
project: menlo-park-front-garden
featured: true
order: 1
---
```

**`approved` defaults to `false` and nothing renders until it is `true`.** Set
it only once the client has agreed, in writing, to be quoted publicly with the
name shown in `author`. A quote given in a text message is not permission to
publish it.

## Adding a service

`src/content/services/<slug>.md`. Same idea; the fields are in
`src/content.config.ts`. `order` controls where it sits in the listing,
`highlights` are the bullets, and `relatedProjects` is a list of project slugs.

## Changing a phone number, address or license number

Not here. Those live in `src/data/site.ts`, once, and every page reads them
from there.

## What does not go on this site

Cost, margin, overhead, labor rates, crew-day counts and supplier pricing are
internal. They belong in the estimating system. The only price-shaped thing
that may appear is `budgetBand`, and only on a project that opts in.

Street addresses do not go on this site either. `location` is a town.
