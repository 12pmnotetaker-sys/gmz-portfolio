# Design handoff

How the finished design from Claude Design gets into this repo.

The scaffold was built to be replaced. Every page renders real content through
real routing, but the styling is deliberately thin, so bringing the design in is
a swap rather than a fight with existing CSS.

## The short version

1. Replace the values in `src/styles/tokens.css`. Keep the token names.
2. Move each page's markup into the matching `.astro` file, keeping the
   `import` lines and the frontmatter fence.
3. Delete the placeholder `<style>` block in the file you just restyled.
4. Run `npm run build`. It will fail loudly if a photo path or a content field
   is wrong.

Nothing else in the repo should need to change. If the design requires a
content field the schema does not have, add it in `src/content.config.ts`
first, then use it.

## Where the seams are

| What the design controls            | Where it lands                                          |
| ----------------------------------- | ------------------------------------------------------- |
| Colors, type, spacing, radii        | `src/styles/tokens.css` — change values, not names      |
| Global resets and layout primitives | `src/styles/global.css`                                 |
| Header and footer chrome            | `src/components/Header.astro`, `Footer.astro`           |
| Homepage sections                   | `src/pages/index.astro`                                 |
| Project card and grid               | `src/components/ProjectCard.astro`, `ProjectGrid.astro` |
| Project detail page                 | `src/pages/work/[...slug].astro`                        |
| Services listing and detail         | `src/pages/services/index.astro`, `[...slug].astro`     |
| Contact page and form               | `src/pages/contact.astro`                               |
| Page shell, `<head>`, skip link     | `src/layouts/BaseLayout.astro`                          |

Each component keeps its CSS in a scoped `<style>` block in the same file.
Astro scopes those to the component, so deleting one cannot leak into another.

## Bringing HTML from Claude Design into an .astro file

An `.astro` file is HTML with an optional frontmatter fence at the top. Pasting
a designed page in mostly works as-is. Four things to watch:

**Keep the frontmatter fence.** The `---` block at the top of the file is
JavaScript that runs at build time. It is where the content queries live. Paste
the design's markup _below_ it and leave the fence alone.

**Swap literal content for the data already being queried.** The scaffold
already fetches the right entries. Where the design has a hard-coded project
title, use `{project.data.title}`. Where it has a phone number, use
`{primaryPhone.display}` — never retype a phone number, address or license
number into a component. See "One fact, one home" below.

**Swap `<img>` for `<Image />`.** Astro's `<Image />` component emits responsive
WebP at build time; a plain `<img>` ships the original file. The existing usages
in `ProjectCard.astro` and `work/[...slug].astro` show the shape.

**Attribute syntax.** `class` stays `class` (not `className`). Expressions go in
single braces: `class={someVariable}`. A boolean attribute is
`hidden={isHidden}`.

## Handling a full-page HTML export

If the design arrives as a complete standalone HTML document rather than a
fragment, do not paste the whole thing into a page. Split it:

- `<head>` contents that are metadata → already handled by `SEO.astro`, skip them
- font `@font-face` / `<link>` tags → `src/styles/tokens.css` (or `public/fonts/`
  for self-hosted files, which is preferred over a third-party CDN)
- `<style>` in the head → split between `tokens.css` (values) and the relevant
  component's scoped `<style>` block
- `<body>` markup → the relevant page and component files
- inline `<script>` → an Astro `<script>` block at the bottom of the component

The `work/index.astro` filter script is an example of the last one.

## One fact, one home

`src/data/site.ts` is the only place a company fact may live. Phone numbers,
the mailing address, the CSLB number, the tagline and the service-area list are
all read from there, and the structured data in `SEO.astro` reads the same
values, so a correction reaches the Google result too.

This rule exists because the estimating system learned it the expensive way: a
contact block hardcoded in three places meant correcting one phone number left
two of them wrong. Do not retype a fact into a component, even once.

## What must survive the redesign

These are not stylistic preferences. Losing any of them is a regression:

- **The skip link** (`.skip-link` in `BaseLayout.astro`) and its focus styling.
- **Visible focus rings.** `:focus-visible` in `global.css`. If the design
  changes the ring, keep a ring.
- **Alt text on every image.** The schema requires it; do not route around it
  by dropping the attribute in a template.
- **`aria-current="page"`** on the active nav item.
- **Real heading order.** `h1` once per page, no level skipped.
- **The `prefers-reduced-motion` block** in `global.css`, if the design adds
  animation.
- **The dark-mode token block**, or a deliberate decision to remove it. Do not
  leave it half-updated, since that ships unreadable text to anyone with a dark
  preference.

## What must never appear on this site

Cost, margin, overhead, burdened labor rates, crew-day counts, contingency and
supplier pricing are internal to GMZ. They live in the estimating system and
they do not belong on a public marketing site, in a content file, in a comment
or in a commit message.

The one deliberate exception is `budgetBand` on a project: a coarse range like
`"$50k–$100k"`, shown only when `showBudgetBand: true` is set on that entry.

Client identity is also protected: project `location` is a town, never a street
address, and a testimonial does not render anywhere until `approved: true`.

## Assets still needed

- **Logo.** The green tree-badge mark, ideally as SVG. Replaces the `GMZ` block
  in `Header.astro` and `public/favicon.svg`.
- **Project photography.** Replaces `src/assets/projects/placeholder-*.jpg`.
  See `CONTENT.md`.
- **A real Open Graph image.** `public/og-default.jpg` is a generated
  placeholder.
- **Fonts**, if the design does not use system stacks.
