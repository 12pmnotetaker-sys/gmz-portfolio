# Design handoff

**Status: landed.** The portfolio design from Claude Design
(`GMZ Portfolio.dc.html`) is implemented. This document is now the record of
where each part of it went, and the guide for bringing in the next revision.

## What the design was, and what it became

The design was a single-file HTML/CSS/JS prototype: one component holding every
route, switching on a `route` state variable, with all styling inline and all
content in a `PROJECTS` array at the bottom of the file.

None of that structure survived, and none of it should have. What was recreated
is the visual output. The mapping:

| In the prototype                     | In this repo                                           |
| ------------------------------------ | ------------------------------------------------------ |
| `route` state, `isIndex`/`isProject` | Real routes under `src/pages/`                         |
| The `PROJECTS` array                 | `src/content/portfolio/*.md`, one file per project     |
| `FACTS`, hardcoded contact details   | `src/data/site.ts`                                     |
| `SERVICES`, `STEPS`, `WALKTHROUGHS`  | `src/data/portfolio.ts`                                |
| Inline `style="..."` on every node   | Tokens plus scoped `<style>` per component             |
| `<a href="#" onClick={go}>`          | Real `<a href>`, with `aria-current` on the active one |
| `T(id)` Google Drive thumbnails      | Local assets through Astro's `<Image />`               |
| Component state for tabs and slider  | Small vanilla scripts, one per component               |

## Where the design's parts live

| Part of the design             | File                                 |
| ------------------------------ | ------------------------------------ |
| Palette, type scale, spacing   | `src/styles/tokens.css`              |
| Kickers, rules, buttons, wells | `src/styles/global.css`              |
| Masthead, nav, mobile drawer   | `src/components/Header.astro`        |
| Footer and contact strip       | `src/components/Footer.astro`        |
| Unlock veil                    | `src/components/Gate.astro`          |
| Index hero and project index   | `src/pages/index.astro`              |
| Project page                   | `src/pages/work/[...slug].astro`     |
| Tabbed drawings viewer         | `src/components/Drawings.astro`      |
| Drag-to-compare                | `src/components/CompareSlider.astro` |
| Full-screen viewer             | `src/components/Lightbox.astro`      |
| Video, stills, "to come"       | `src/components/MediaClip.astro`     |
| Walkthroughs page              | `src/pages/walkthroughs.astro`       |
| About, Services, Contact       | the matching file in `src/pages/`    |

## The palette, and keeping it straight

Four colors doing four jobs. The design holds together as long as the jobs stay
separate:

| Token         | Value     | Job                                              |
| ------------- | --------- | ------------------------------------------------ |
| `--gmz-teal`  | `#002B37` | Chrome: header, footer, veil, inverse panels     |
| `--gmz-green` | `#008C41` | Action: links, primary buttons                   |
| `--gmz-amber` | `#F6A400` | Accent: the rule under things, button hover      |
| `--gmz-blue`  | `#0062B9` | Structure: kickers, section rules, project names |

Type is Gabarito, self-hosted from `public/fonts/`. It is a variable font, so
weights 400 to 800 all come from one file per subset. Do not add a Google Fonts
link back: the files are in the repo precisely so the site does not depend on a
third-party CDN.

## Deliberate departures from the prototype

Six places where the prototype was not copied literally, and why.

**Alt text was added everywhere.** The prototype had `alt="{{ p.name }}"` or no
alt at all. The schema now requires real alt text on all 81 images, and there is
no way around it. This is the single largest addition to the design's content.

**Company facts were lifted out.** The prototype hardcoded both phone numbers,
the email, the P.O. Box and the CSLB number in the footer, the contact page, the
mobile menu and the veil. They all read from `src/data/site.ts` now.

**Tabs, the slider and the viewer got real semantics.** The prototype's tabs
were styled buttons; they are a `tablist` with arrow-key navigation now. The
compare handle is a `slider` with `aria-valuenow` and keyboard control. The
lightbox is a native `<dialog>`, which brings the focus trap and Escape with it.

**Every panel renders, and only one shows.** The prototype swapped the active
image's `src`. Here all panels are in the document with `hidden` on the inactive
ones, so the first drawing and its note are readable with JavaScript off.

**The About bio was un-hardcoded.** The prototype centred that paragraph with a
fixed `463px × 323px` box and two leading `<br>`s. It is centred by the flex row
now, which holds at any width.

**Autoplay respects `prefers-reduced-motion`.** Clips still play on scroll into
view, but not for anyone who has asked for less motion. The controls work
regardless.

## Bringing in the next revision

The seams are the same as before, and the swap procedure is:

1. **Colors, type, spacing** changed → edit values in `src/styles/tokens.css`.
   Keep the names.
2. **A repeated pattern** changed (the amber rule, a button, a section head) →
   edit `src/styles/global.css` once and every page follows.
3. **One component's layout** changed → edit that component's scoped `<style>`.
4. **Content changed** → edit the Markdown, not the component.
5. **A new content field** is needed → add it to `src/content.config.ts` first,
   then use it. The schema is what makes a bad path fail the build.
6. Run `npm run build`. It will fail loudly on a broken photo path, a missing
   video or a schema violation, which is the point.

## What must survive any redesign

These are not stylistic preferences. Losing one is a regression:

- **The skip link** and its focus styling.
- **Visible focus rings.** `:focus-visible` in `global.css`, with the amber
  variant for the teal chrome. If the design changes the ring, keep a ring.
- **Alt text on every image.** The schema requires it. Do not route around it by
  dropping the attribute in a template.
- **`aria-current="page"`** on the active nav item.
- **One `h1` per page**, no level skipped.
- **The `prefers-reduced-motion` block** in `global.css`, and the autoplay opt-out
  in `MediaClip.astro`.
- **The dark-mode token block.** The design is light-only, so this is a
  deliberate derivation rather than something the design specified. Update it
  with the palette or remove it outright; do not leave it half-updated, which
  ships unreadable text to anyone with a dark preference.
- **The tab, slider and dialog semantics** listed above.

## What must never appear on this site

Cost, margin, overhead, burdened labor rates, crew-day counts, contingency and
supplier pricing are internal to GMZ. They live in the estimating system and
they do not belong on this site, in a content file, in a comment or in a commit
message.

Client identity is protected: no house numbers, and no naming a client. Note
that the portfolio indexes by street name, which is a real exposure and the
reason the whole site sits behind the veil. See CLAUDE.md.

## Assets

[ASSETS.md](./ASSETS.md) is the current status and is regenerated by
`npm run placeholders`. The 81 photographs and 7 walkthrough clips are all real, as is the GMZ mark.
The favicon and the Open Graph card are generated from the mark by
`npm run brand`.

The six Google Drive walkthroughs are live embeds. They work only while those
Drive files stay link-shared, and nothing at build time can check that. Copying
them into `public/media/` removes the dependency.
