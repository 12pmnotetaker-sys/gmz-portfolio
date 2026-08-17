# Client portal concepts

Three design concepts for a GMZ maintenance client portal: the place a client on
a standing maintenance account goes to see their service day, what happened on
the last visit, and anything waiting on their decision.

All three are **prototypes**. They are standalone HTML files, the same convention
as `docs/intake-forms.html` and `docs/process-proposal.html`, so they can be
opened and compared without running the site. Nothing here is wired to data.

| File                            | Concept                | The organising idea                                                                      |
| ------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------- |
| `concept-1-service-record.html` | **The Service Record** | A maintenance account is a running obligation, so the portal is the log. Paper first.    |
| `concept-2-route-card.html`     | **The Route Card**     | The client asks two questions on a phone. Phone-width app, shown in three device frames. |
| `concept-3-garden-year.html`    | **The Garden Year**    | An account is one year repeating, so the year is the spine. Dark, editorial.             |

## What all three share

- The GMZ palette from `src/styles/tokens.css`, the Georgia and system-sans
  pairing, and the tagline **Design · Build · Maintenance**.
- The same sample account, so the comparison is between designs rather than
  between made-up data.
- Only maintenance policy that is already decided. Every policy sentence traces
  to an FAQ in `src/content/faqs/` with `published: true`: month to month with
  30 days' notice in writing, a fixed service day, a day rather than an arrival
  time, one set price per visit, a monthly zone-by-zone irrigation walk, work
  outside routine care quoted and approved before it happens, and an annual
  price review. Nothing states a term nobody has agreed to.
- No dollar figures. What a client pays per visit lives in their service
  agreement and in the estimating system, so billing shows a reference and a
  state and stops there.
- The accessibility floor from `CLAUDE.md`: skip link, visible focus rings,
  `aria-current` on the active nav item, one `h1` per page, alt text on every
  image, and a `prefers-reduced-motion` block. Both themes are defined in full.

## Stand-ins, flagged on each page

- **The tree badge is drawn, not the real mark.** The GMZ logo is still needed as
  SVG; see `DESIGN-HANDOFF.md`, "Assets still needed". Replacing it is a swap of
  one inline `<svg>` per file.
- **Photo slots are labelled plates**, not photographs, the same idea as
  `src/assets/projects/placeholder-*.jpg`.
- **The client, the dates and the crew notes are invented.** Sample phone
  numbers, where a concept needs one, use the 555 range.
- **GMZ's own facts are literal in these files.** That is only acceptable
  because they sit outside `src/`. Whichever concept is built must read the
  license number, phone and tagline from `src/data/site.ts`, per "one fact, one
  home".

## What still has to be decided before this gets built

Picking a design is the smaller half. A portal shows one client their own
account, which this repo cannot currently do:

1. **Sign-in.** The site is a static Astro build with no accounts. A portal needs
   a way for a client to prove who they are, and for GMZ staff to see any
   account.
2. **Where the data lives.** Visits, crew notes, photos, zone checks, quotes and
   their approvals all have to be recorded somewhere, by the crew, on the day.
   The portal is only as good as that habit.
3. **Who writes the visit note.** Every one of these concepts is worthless
   without the two lines a crew lead writes about what they saw. That is an
   operations commitment, not a design decision.
4. **What billing shows.** These prototypes deliberately show a reference and a
   state with no figures. If clients should see amounts, that comes from the
   invoicing system rather than being retyped here.

Approving a concept means approving the shape. Points 1 to 4 are the build.
