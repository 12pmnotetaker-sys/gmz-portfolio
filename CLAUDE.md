# GMZ Portfolio — working notes

Static Astro site for GMZ Landscaping Inc. This is the **private portfolio**
design from Claude Design, implemented: seven projects indexed by street name,
behind a consultation-code veil.

## Before changing anything

- `npm run check` validates types **and** all content against the schemas.
- `npm run build` is the gate. It fails on a broken image path, a missing video,
  a bad content reference or a schema violation, which is the point.
- `npm run placeholders` regenerates any missing placeholder image and rewrites
  ASSETS.md. It never overwrites an existing file, so it cannot clobber a real
  photograph.

## Rules that are not style preferences

**One fact, one home.** Phone numbers, the mailing address, the CSLB number, the
hours, the tagline, the founding year, the domain and the service area live in
`src/data/site.ts` and nowhere else. Never retype one into a component or a
content file. This rule exists because the GMZ estimating system had a contact
block hardcoded in three places, and correcting one phone number left two of
them wrong. The design's prototype made the same mistake in four places; do not
put it back.

**Nothing internal reaches the site.** Cost, margin, overhead, burdened labor
rates, crew-day counts, contingency and supplier pricing are internal to GMZ.
They must not appear in content, in code, in a comment or in a commit message.

**The veil is not security.** The unlock code ships in the client bundle, every
page stays fetchable by URL, and the veil fails open with JavaScript off. What
keeps the portfolio out of public view is `noindex` on every page, `Disallow: /`
in robots.txt, and no sitemap. Keep all three together: dropping one while
keeping the others ships a contradictory signal. **Never put something in this
repo that genuinely must not be public.** Real privacy needs a host-level check.
The full explanation is in the "Private portfolio" section of README.md.

**Client privacy, and the standing exception.** No house numbers, and never name
a client. Projects are indexed by **street name**, a deliberate departure from
the town-only rule the public scaffold used, and the reason this site is gated
rather than public. **Confirmed by GMZ 2026-08-17.**

It stays a real exposure, so the boundary matters: a street name plus a
photograph of the house often identifies whose garden it is. What was agreed is
the street, and nothing beyond it. Do not widen it to a house number, a client
name or a precise map reference, and if a particular project would be sensitive,
use a descriptor instead of the street.

**Undecided policy does not get published.** An FAQ answer stays
`published: false` until the underlying decision is actually made. The site must
never state a warranty term, a lead time or a fee that nobody has agreed to,
because a client will hold GMZ to whatever it said. `npm run faq:decisions`
lists what is outstanding.

**Alt text is required** by the schema, on all 81 images. Do not route around it
by dropping the attribute in a template. `label` is the visible caption and
`alt` is what a screen reader is told; they should usually differ.

**House style for client-facing prose** (from the GMZ estimating system):

- No em-dashes in body prose. Use a comma, a semicolon or a colon.
- No brand or manufacturer names. Describe the thing, not the SKU: "a smart
  Wi-Fi controller", not a named model.
- No raw quantities the reader did not ask for. "shrubs, perennials and
  grasses", not "about 165 shrubs".
- Tagline is **Design · Build · Maintenance** (set 2026-08-06). Do not revert to
  the older "Landscape · Hardscape · Fencing".

**Accessibility floor.** The skip link, visible `:focus-visible` rings (amber on
the teal chrome), `aria-current` on the active nav item, one `h1` per page, the
`prefers-reduced-motion` block, the autoplay opt-out in `MediaClip.astro`, and
the tab / slider / dialog semantics on the interactive pieces all stay. A
redesign that drops one is a regression, not a style change.

## Where things are

Projects are a content collection, `src/content/portfolio/*.md`, queried through
`src/data/portfolio.ts`. Page structure the design holds as copy rather than
content (the three service stages, the four process steps, the walkthrough
index) is in that same file. FAQ queries are in `src/data/content.ts`.

`src/styles/tokens.css` is the palette and scale; `src/styles/global.css` holds
the patterns the design repeats. Anything used by one component stays in that
component's scoped `<style>`. See DESIGN-HANDOFF.md for the full map.

## Media

The photography is real: 81 WebP images under `src/assets/`, and 7 clips in
`public/media/`. `ASSETS.md` reports the status of every slot and is regenerated
by `npm run placeholders`.

**Strip metadata on anything new.** The photographs that landed carried GPS
coordinates identifying client home addresses, and they were removed on ingest.
Astro strips metadata from the derivatives it serves, but a committed source
file keeps its own, and git history is permanent: a later deletion does not
remove it. On a site already indexed by street name, exact coordinates would be
a much sharper version of that exposure. Review before committing, not after.

The brand assets are real too. `src/assets/brand/gmz-logo.png` is the GMZ mark:
white artwork on transparent, so it is legible only on the teal chrome, which is
the only place the design puts it. All four usages read `Logo.astro`, so
replacing that one file updates the header, drawer, footer and veil together.

`public/favicon.png` and `public/og-default.jpg` are derived from the mark by
`npm run brand`. Re-run it after changing the logo rather than editing them by
hand.

Every walkthrough is a local file in `public/media/`. Six of them were Google
Drive embeds until 2026-08-17, which meant those films played only while the
Drive files stayed link-shared, and nothing at build time could catch it if
sharing was turned off. Nothing on the site depends on Drive now.

Three of those six arrived carrying GPS coordinates for the client property, plus
the phone make and model. They were transcoded to 720p with `-map_metadata -1`,
which strips every tag, before anything was committed. That is what the rule
above is for: the originals were 490 MB of camera files with location data in
them, and a commit would have put those coordinates in the history permanently.

## Settled, so nobody re-opens them

- **The domain is `gmzlandscape.com`**, with no "ing". The scaffold assumed
  `gmzlandscaping.com`, which GMZ does not own. The live Wix site has been on
  `gmzlandscape.com` throughout. Confirmed 2026-08-17.
- **Projects are indexed by street name.** See the client-privacy rule above.
  Confirmed 2026-08-17.
- **The About headline is "More than 30 years on the ground."** The founding year
  is 1994. GMZ chose the conservative phrasing over an exact count, so do not
  "correct" it to 32. Confirmed 2026-08-17.

## Open questions for GMZ

Flagged rather than decided:

- **Whether the veil is enough**, or whether this needs host-level protection.
- **The Answers pages are now `noindex`** along with everything else, so the 56
  FAQ entries no longer earn search traffic. They are still reachable behind the
  code. Setting `gated={false}` on `faq.astro` makes that page public again and
  re-enables its FAQPage structured data.

## Docs

- `DESIGN-HANDOFF.md` — where each part of the design landed, and how to bring
  in the next revision
- `ASSETS.md` — every outstanding photograph and video
- `CONTENT.md` — adding projects and FAQ answers
- `README.md` — setup, commands, the private-portfolio explanation, deploy,
  go-live checklist
