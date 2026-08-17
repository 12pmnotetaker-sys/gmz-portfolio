# GMZ Portfolio

Private portfolio site for **GMZ Landscaping Inc.**, a licensed landscape
contractor on the San Francisco Peninsula. CSLB License #636636.

Built with [Astro](https://astro.build) as a static site. Content lives in
Markdown; adding a project does not require touching code.

## Status

The portfolio design from Claude Design (`GMZ Portfolio.dc.html`) is
implemented. Seven projects, the drawing-sheet index, the tabbed drawing
viewer, the drag-to-compare slider, the full-screen viewer, the walkthroughs
page and the unlock veil are all in place and building.

**The photography is real.** All 81 images and all 7 walkthrough clips are in
the repo: WebP capped at 2560px on the long edge, deduplicated, and stripped of
all metadata before they landed. [ASSETS.md](./ASSETS.md) is the current status
of every slot.

The brand assets are real as well: the GMZ mark is in
`src/assets/brand/gmz-logo.png`, and the favicon and Open Graph card are
generated from it by `npm run brand`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
```

Requires Node 20.11 or newer. `.nvmrc` pins 22.

The unlock code in development is the same as in production. It is `gate.code`
in `src/data/site.ts`. Clear it again with "Lock portfolio" in the footer.

## Commands

| Command                 | What it does                                                |
| ----------------------- | ----------------------------------------------------------- |
| `npm run dev`           | Dev server with hot reload. Drafts are visible here         |
| `npm run build`         | Type-check, then build to `dist/`. Drafts are excluded      |
| `npm run build:fast`    | Build without the type-check                                |
| `npm run preview`       | Serve the built `dist/` locally                             |
| `npm run check`         | Type-check and validate all content against the schemas     |
| `npm run placeholders`  | Generate any missing placeholder image, and write ASSETS.md |
| `npm run brand`         | Rebuild the favicon and Open Graph card from the GMZ mark   |
| `npm run format`        | Prettier over the repo                                      |
| `npm run faq:decisions` | List FAQ answers held back pending a decision               |

`npm run build` is the real gate: it fails on a type error, a content field
that does not match its schema, a missing photograph or a missing video.

`npm run placeholders` never overwrites a file that already exists, so it is
safe to run at any point and cannot clobber a real photograph.

## Private portfolio

Read this before assuming anything here is protected.

The site opens behind a veil asking for a consultation code. **That is a
courtesy screen, not access control.** Specifically:

- The code ships in the JavaScript bundle where anyone can read it.
- Every page stays directly fetchable by URL. The veil is drawn over the top of
  a page that has already been delivered.
- With JavaScript disabled the veil never appears at all. It fails open on
  purpose, because failing closed would leave a static site permanently blank.

What actually keeps the portfolio out of public view is the other half:
`robots.txt` disallows everything, every page carries `noindex`, and there is no
sitemap. That is what stops it turning up in a search result.

So: the veil is a "please don't browse this casually" sign for someone who was
sent a link. It is not a lock. **If something genuinely must not be seen by the
public, it does not belong in this repo.** For real privacy the check has to
happen at the host, before the page is served, which means Netlify password
protection or an edge function, and no public pages at all.

Both halves are one switch. `gated` in `src/layouts/BaseLayout.astro` defaults
to the `gate.enabled` flag in `src/data/site.ts`; setting `gated={false}` on a
page drops the veil and lets that page be indexed. If pages become public,
allow them in `src/pages/robots.txt.ts` and add `@astrojs/sitemap` back to
`astro.config.mjs`.

## Layout

```
src/
  assets/
    about/             About-page portraits
    brand/             Logo and the APLD mark
    portfolio/<slug>/  One folder of photography per project
  components/
    Logo.astro         The GMZ mark, at whatever height is asked for
    Header.astro       Masthead, nav, mobile drawer
    Footer.astro       Closing invitation, marks, contact strip
    Gate.astro         The unlock veil
    Drawings.astro     Tabbed "the design as it was drawn" viewer
    CompareSlider.astro  Drag-to-compare before/after
    Lightbox.astro     Full-screen viewer, one <dialog> per project page
    MediaClip.astro    A video, a Drive embed, a still, or "to come"
    SEO.astro          Title, canonical, Open Graph, structured data
    PageHeader.astro   Page head for the Answers pages
    FaqAnswer.astro    One collapsible answer
  content/
    portfolio/         One Markdown file per project
    faqs/              One per customer question
  data/
    site.ts            Company facts. The ONLY place they live
    portfolio.ts       Project queries, service stages, walkthrough index
    content.ts         FAQ queries and display labels
  layouts/
    BaseLayout.astro   Page shell: head, header, main, footer, veil
  pages/
    index.astro        The work: the project index
    work/[...slug].astro   One project
    walkthroughs.astro Every film in one place
    services.astro     The three stages and the four steps
    about.astro
    contact.astro
    faq.astro          Searchable answers
    straight-answers.astro  Same answers, objection-led
    404.astro
    robots.txt.ts      Generated
  styles/
    tokens.css         Design tokens: the palette, type scale and spacing
    global.css         Reset, fonts, and the primitives the design repeats
public/
  fonts/               Gabarito, self-hosted
  media/               Local walkthrough video
  favicon.png          Generated from the mark by `npm run brand`
  og-default.jpg       Generated from the mark by `npm run brand`
scripts/               Placeholder generation, FAQ decision report
```

## Adding content

See [CONTENT.md](./CONTENT.md). In short: put photos in
`src/assets/portfolio/<slug>/`, add a Markdown file to
`src/content/portfolio/`, run `npm run dev`.

## Company facts live in one place

Phone numbers, the mailing address, the CSLB number, the hours, the tagline and
the service-area list are all in `src/data/site.ts`. Components read from there;
nothing retypes them. The structured data in `SEO.astro` reads the same values,
so correcting a number in one place fixes the page, the footer and the search
result together.

## Configuration

| Variable                  | Purpose                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `SITE_URL`                | Production origin. Defaults to `https://www.gmzlandscape.com`. Canonical and OG URLs |
| `PUBLIC_CONTACT_ENDPOINT` | Where the consultation form posts. Unset means Netlify Forms                         |

The contact form carries `data-netlify="true"`, so **on Netlify** it is
collected without any endpoint. It posts over `fetch` and shows the thank-you
panel in place; with JavaScript off it posts normally and the host shows its own
confirmation.

**On any other host, set `PUBLIC_CONTACT_ENDPOINT`.** `data-netlify` means
nothing off Netlify, and a plain static host will answer 200 to the POST anyway,
so the thank-you panel can report success while the enquiry goes nowhere. No
client-side check can tell those two apart.

So, whichever host: **send one real submission and confirm it arrives** before
shipping. A form that silently drops a lead is worse than no form.

## Deploying

It is a static site: build and serve `dist/`. Configs for Netlify
(`netlify.toml`) and Vercel (`vercel.json`) are both included; delete whichever
you do not use. Note the form caveat above if you pick Vercel.

```
Build command:      npm run build
Publish directory:  dist
Node version:       22
```

Set `SITE_URL` in the host's environment to the real domain, or canonical tags
will point at the default.

## Before this goes live

- [ ] Confirm the production domain and set `SITE_URL`
- [x] Replace the placeholder photography, all 81 images ([ASSETS.md](./ASSETS.md))
- [x] Add the 7 local walkthrough videos to `public/media/`
- [x] Replace the placeholder logo with the real GMZ mark
- [x] Replace the favicon and the Open Graph image
- [ ] Copy the six remaining Google Drive walkthroughs into `public/media/` so
      the site does not depend on Drive sharing staying on
- [ ] Review the photography once more for anything a client would not want
      shown, since git history keeps whatever is committed
- [x] Wire up and **test** the contact form (Netlify Forms, one real
      submission confirmed end to end 2026-08-17)
- [x] Decide the About headline; GMZ chose "More than 30 years on the ground"
      (confirmed 2026-08-17)
- [x] Confirm indexing by street name is what GMZ wants (confirmed 2026-08-17)
- [ ] Decide whether the unlock veil is enough, or whether this needs real
      host-level protection
- [ ] Work through `npm run faq:decisions` and publish the held-back answers
- [ ] Confirm the service-area list in `src/data/site.ts` is accurate
- [ ] Fill in the social links in `src/data/site.ts`, or leave them empty to hide
