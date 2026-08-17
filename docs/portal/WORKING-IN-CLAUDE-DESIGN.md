# Working on the portal in Claude Design

A runbook for taking the portal design forward in Claude Design and getting the
result back into this repo without losing anything.

Read `README.md` in this folder first for what the design actually is. This file
is only about the mechanics of working on it.

## What is already set up

- **Project:** "Design System" on claude.ai/design, owned by you. It is a
  design-system project, which is the type the Design System pane reads.
- **Files:** five, all under `client-portal/`, uploaded verbatim from
  `docs/portal/` in this repo:
  - `the-client-path.html` — the direction
  - `concept-1-service-record.html`, `concept-2-route-card.html`,
    `concept-3-garden-year.html` — what was considered
  - `README.md` — the written direction and the open decisions
- **Cards:** four, all in a group called "Client portal". They render at
  1280 by 900 pixels.

What is **not** set up: components. The project holds four whole pages. That is
fine for reviewing and wrong for editing, which is what step 3 fixes.

## Step 1. Review the direction before touching anything

Open the **The Client Path** card and walk the five stages top to bottom in the
order they are numbered. It is built to be read that way.

Four things there are worth settling now, because everything else is downstream
of them:

1. **The four tabs.** Today, Visits, Year, Ask. Wrong number, wrong order or a
   wrong label costs almost nothing to change now and a lot later.
2. **The word "Ask".** It has to work in both languages and it has to not read
   as "support ticket". If Spanish wants a different word than a direct
   translation of the English, that is a real finding.
3. **The three cards on Today.** Next visit, waiting on you, last visit. If a
   client would want a fourth thing above the fold, say what it is.
4. **The loop.** The path returns to Today every Thursday rather than ending.
   If that framing is wrong, the whole information architecture changes.

Write the answers down anywhere. You do not need to phrase them as design
instructions.

## Step 2. Get the real logo in

This is the highest-value single change available and it is not a design
decision, it is an asset.

Every file uses the same drawn tree badge as a stand-in. Send me the real GMZ
mark as SVG, or tell me where it lives, and it lands in one place per file plus
`public/favicon.svg` and `src/components/Header.astro`. Until then everything is
off-brand in exactly the same way, which is at least consistent.

If no SVG exists, a clean PNG at 1024px or larger is enough for me to trace a
usable SVG, and that trace becomes the asset the whole site uses.

## Step 3. Have the pages broken into components

Send me one message: **"extract the client path into components."**

Right now the same button, card and chip are written four times across four
files. After extraction they exist once each, and the Design System pane can
drive them. What you get:

| Group           | Components                                                          |
| --------------- | ------------------------------------------------------------------- |
| **Foundations** | Palette, type scale, spacing, the logo lockup, the tagline          |
| **Shell**       | App bar, language switch, four-tab bar, device frame                |
| **Cards**       | Next visit, waiting on you, last visit, flagged item                |
| **Messaging**   | Bilingual message bubble, provenance chip, original-text disclosure |
| **Composer**    | The three-field request form, the "not an approval" notice          |
| **Data marks**  | Month ribbon, zone row, request state pills, visit entry            |

Foundations first is not optional. Every other component reads its colour and
type from there, so building components on top of loose values means doing the
work twice.

## Step 4. Work one component at a time

The sync between here and Claude Design is deliberately incremental. Change one
component, look at it, keep it or throw it away, then move to the next.

Do not ask for a wholesale replace of a page or the project. Each of these files
carries work that is invisible in a screenshot: the accessibility floor, the
`lang="es"` marking, the policy sentences that trace to published FAQs, and the
absence of things nobody has decided. A bulk overwrite loses all of it silently.

## Step 5. Send changes back to this repo

You do not need to learn a sync command. Tell me what changed and I do the rest:

> "I changed the waiting-on-you card in Claude Design, pull it in."

What happens on my side, in order:

1. Read the changed file from the project.
2. Land it in `docs/portal/`, or in `src/` if it is a real site component.
3. Run the gate: `npm run check`, `npm run build`, `npm run format:check`.
4. Commit and push to `claude/gmz-landscaping-client-portal-862ijx`, which
   updates PR #3.

`npm run build` is the gate for a reason. It fails on a broken image path, a bad
content reference or a schema violation, which is exactly the class of mistake a
design pass introduces.

## Step 6. Stop when a screen wants to state a policy

This is the one rule that will actually bite during design work.

If a screen needs to say a reply time, a lead time, a fee, a warranty term or
anything else a client could hold GMZ to, it is not a copy decision. It is a
policy decision, and the site already has a place for those:

1. Add or find the answer in `src/content/faqs/` with `published: false` and a
   `decisionNote` saying exactly what has to be confirmed.
2. Decide it.
3. Set `published: true`, then put it in the portal.

`npm run faq:decisions` lists what is outstanding. Three answers are currently
held back, none of them about maintenance.

## What must survive any design pass

Short list, from `CLAUDE.md` and `DESIGN-HANDOFF.md`:

- **Token names stay, values change.** Restyling means new values in
  `src/styles/tokens.css`, not new token names and not literal colours in
  components.
- **The accessibility floor.** Skip link, visible `:focus-visible` rings,
  `aria-current` on the active nav item, one `h1` per page, alt text on every
  image, the `prefers-reduced-motion` block. Dropping one is a regression, not a
  style change.
- **Both themes, defined in full.** Never a colour whose only definition sits
  inside a dark-mode block.
- **`lang="es"` on Spanish text**, so a screen reader switches voice.
- **No figures, no internal numbers.** No cost, margin, rate or crew-day count,
  and no per-visit price.
- **One fact, one home.** Phone, address, license and tagline come from
  `src/data/site.ts`. The prototypes have them literal only because they sit
  outside `src/`; anything built for real must read them.
- **House style.** No em-dashes in client-facing prose, no brand or manufacturer
  names, no raw quantities the reader did not ask for.

## What to ask me for, in your words

| You want                           | Say                                               |
| ---------------------------------- | ------------------------------------------------- |
| The pages broken into pieces       | "extract the client path into components"         |
| A change you made in Design landed | "pull the [component] change back into the repo"  |
| The real logo everywhere           | "here is the mark, swap the stand-in"             |
| A Spanish version of a screen      | "show the Ask tab with the portal set to Spanish" |
| A screen on a phone-sized canvas   | "render [screen] at 390px and show me"            |
| A shareable link for someone else  | "publish [file] as an artifact link"              |
| To know what is still undecided    | "what is blocking the portal build"               |

## Where this stops being a design problem

Six things have to be decided before any of this becomes a portal a client can
log into. They are listed at the end of `README.md`: sign-in, where the visit
data lives, who writes the visit note, what performs the translation and who
checks it, whether GMZ promises a reply time, and what billing shows.

Numbers 2 and 3 are the ones that decide whether this is worth building at all.
Every screen in the design is a view onto a record that a crew has to create on
the day, in the field, on a phone. No amount of design work substitutes for that
habit existing.
