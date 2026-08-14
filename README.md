# GMZ Portfolio

Portfolio website for **GMZ Landscaping Inc.**, a licensed landscape contractor
on the San Francisco Peninsula. CSLB License #636636.

Built with [Astro](https://astro.build) as a static site. Content lives in
Markdown; adding a project does not require touching code.

## Status

This is the **scaffold**. Routing, the content layer, the image pipeline and
the page structure are done and working. The visual design is being finalized
separately in Claude Design and will be brought in on top of this.

That means the styling you see is placeholder styling. It uses the GMZ brand
palette so it does not look like nothing, but it is not the design. See
[DESIGN-HANDOFF.md](./DESIGN-HANDOFF.md).

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321
```

Requires Node 20.11 or newer. `.nvmrc` pins 22.

## Commands

| Command              | What it does                                            |
| -------------------- | ------------------------------------------------------- |
| `npm run dev`        | Dev server with hot reload. Drafts are visible here     |
| `npm run build`      | Type-check, then build to `dist/`. Drafts are excluded  |
| `npm run build:fast` | Build without the type-check                            |
| `npm run preview`    | Serve the built `dist/` locally                         |
| `npm run check`      | Type-check and validate all content against the schemas |
| `npm run format`     | Prettier over the repo                                  |

`npm run build` is the real gate: it fails on a type error, a content field
that does not match its schema, a broken image path or a broken content
reference.

## Layout

```
src/
  assets/projects/     Project photography (optimized at build time)
  components/          Header, Footer, SEO, cards, page header
  content/
    projects/          One Markdown file per project
    services/          One per service
    testimonials/      One per client quote
  data/
    site.ts            Company facts. The ONLY place they live
    content.ts         Content queries and display labels
  layouts/
    BaseLayout.astro   Page shell: head, header, main, footer
  pages/
    index.astro        Home
    work/              Project index and detail pages
    services/          Service index and detail pages
    about.astro
    contact.astro
    404.astro
    robots.txt.ts      Generated, so the sitemap URL tracks the origin
  styles/
    tokens.css         Design tokens. The seam for the design handoff
    global.css         Reset and layout primitives
public/                Served as-is: favicon, OG image
scripts/               One-off utilities
```

## Adding content

See [CONTENT.md](./CONTENT.md). In short: add photos to
`src/assets/projects/`, add a Markdown file to `src/content/projects/`, run
`npm run dev`.

## Company facts live in one place

Phone numbers, the mailing address, the CSLB number, the tagline and the
service-area list are all in `src/data/site.ts`. Components read from there;
nothing retypes them. The structured data in `SEO.astro` reads the same values,
so correcting a number in one place fixes the page, the footer and the search
result together.

## Configuration

| Variable                  | Purpose                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`                | Production origin. Defaults to `https://www.gmzlandscaping.com`. Used for canonical URLs, the sitemap and Open Graph tags |
| `PUBLIC_CONTACT_ENDPOINT` | Form handler URL for the contact form                                                                                     |

**The contact form is not wired up yet.** Until `PUBLIC_CONTACT_ENDPOINT` is
set, `/contact` shows the phone numbers and email address and renders no form
at all. That is deliberate: a form that silently drops a lead is worse than no
form, and collecting leads is what this site is for.

To turn it on, pick a handler (Formspree, Netlify Forms, a Cloudflare Worker,
whatever suits the host), set the variable, and test that a submission actually
arrives before shipping it.

## Deploying

It is a static site: build and serve `dist/`. Configs for Netlify and Vercel
are included and either can be deleted.

```
Build command:      npm run build
Publish directory:  dist
Node version:       22
```

Set `SITE_URL` in the host's environment to the real domain, or canonical tags
and the sitemap will point at the default.

## Before this goes live

- [ ] Confirm the production domain and set `SITE_URL`
- [ ] Bring in the finished design ([DESIGN-HANDOFF.md](./DESIGN-HANDOFF.md))
- [ ] Replace the placeholder project photography with real photos
- [ ] Replace the placeholder logo and favicon with the GMZ mark
- [ ] Replace `public/og-default.jpg` with a real social image
- [ ] Write the About page copy in Xavier's own words
- [ ] Wire up and **test** the contact form
- [ ] Get written permission for each testimonial, then set `approved: true`
- [ ] Confirm the service-area list in `src/data/site.ts` is accurate
- [ ] Fill in the social links in `src/data/site.ts`, or leave them empty to hide
