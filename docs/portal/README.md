# Client portal

Design work for a GMZ maintenance client portal: the place a client on a
standing maintenance account goes to see their service day, what happened on the
last visit, anything waiting on their decision, and now to reach GMZ staff in
their own language.

Everything here is a **prototype**. Standalone HTML files, the same convention as
`docs/intake-forms.html` and `docs/process-proposal.html`, so they open and
compare without running the site. Nothing is wired to data.

## The direction

`the-client-path.html` is the current direction, decided 2026-08-17. The three
earlier concepts were built as alternatives, and the answer turned out to be all
three: they are the same product at three depths, joined by one linear path, with
a fifth stage that is new.

| File                            | What it is                                                                                                                         |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `the-client-path.html`          | **The direction.** The unified flow: sign in, Today, waiting on you, decide, booked. Plus the bilingual request and message stage. |
| `concept-1-service-record.html` | Explored: the portal as a running log. Now the **Visits** tab, the history depth.                                                  |
| `concept-2-route-card.html`     | Explored: phone-first app. Now the **shell and the Today screen**.                                                                 |
| `concept-3-garden-year.html`    | Explored: the year as the spine. Now the **Year** tab, the seasonal context depth.                                                 |

The three concept files are kept as the record of what was considered. They are
not alternatives any more.

## The path

Four taps wide, and it loops rather than ending:

```
Sign in  →  Today  →  Waiting on you  →  Decide  →  Booked onto your Thursday
              ↑                                              │
              └──────────── and again next Thursday ─────────┘

Above Today, reached and returned from:
  Visits, the record   ("what happened")
  The year             ("why now")
```

A maintenance account is a loop, not a funnel. The same client walks this path
every week for years, so the design optimises for the ordinary week: most weeks
Today is two cards long and there is nothing waiting.

## Requests and messages, in two languages

The fifth stage is the new part. A client asks for something or the crew flags
something on a visit, and both land in one queue with one set of states:

```
You ask ─┐
         ├→ one queue → looked at, priced → waiting on you ─┬→ approved, booked, done
crew  ───┘                                                  └→ not now, stays on record
```

The rules the design holds to:

- **Each side writes in their own language.** The client picks English or
  Spanish for the whole portal; the crew and office write in theirs. Nobody
  composes in a second language, which is where meaning goes missing and where
  the writing stops happening at all.
- **The original is always stored.** Every message and request keeps what was
  written and the translation shown to the other side. A provenance chip names
  the language it came from and the original is one tap away, so a translation
  never passes itself off as somebody's own words.
- **Structure beats free text.** What, where, and a photo. Three short fields
  survive translation and arrive actionable; a paragraph arrives as a puzzle.
- **Numbers, dates and money are not translated prose.** Service days, quote
  references and dates render from account data in the reader's language and
  format, never through a translation.
- **A request is not an approval.** The composer says so, in the client's
  language, above the send button.
- **Urgent stays a phone call.** "Call instead" sits next to "Send it", because
  a message queue is the wrong channel for water running down a driveway.

Spanish text carries `lang="es"` so a screen reader switches voice instead of
reading Spanish with an English one.

## What every file shares

- The GMZ palette from `src/styles/tokens.css`, the Georgia and system-sans
  pairing, and the tagline **Design · Build · Maintenance**.
- The same sample account, so a comparison is between designs rather than
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
- **The client, the dates, the crew notes and the message text are invented.**
  Sample phone numbers, where a concept needs one, use the 555 range.
- **The Spanish is written as GMZ speaks it, not machine output**, but it is
  still sample text. Real strings need a bilingual pass before launch: a
  translated portal with awkward Spanish reads worse to a Spanish-speaking
  client than an English one would.
- **GMZ's own facts are literal in these files.** That is only acceptable
  because they sit outside `src/`. Whatever gets built must read the license
  number, phone and tagline from `src/data/site.ts`, per "one fact, one home".

## What still has to be decided before this gets built

Picking the shape was the smaller half.

1. **Sign-in.** The site is a static Astro build with no accounts. A portal needs
   a way for a client to prove who they are, and for GMZ staff to see any
   account.
2. **Where the data lives.** Visits, crew notes, photos, zone checks, quotes,
   approvals and now messages all have to be recorded somewhere, by the crew, on
   the day.
3. **Who writes the visit note.** Every screen here is worthless without the two
   lines a crew lead writes about what they saw. That is an operations
   commitment, not a design decision.
4. **What translates the messages, and who checks it.** The design assumes
   machine translation with the original always kept. That needs a service
   chosen, a cost understood, and a rule for what happens when a translation is
   obviously wrong. Scope and money in a mistranslated request is exactly how a
   job goes wrong.
5. **Whether GMZ promises a reply time.** Nothing in the portal promises one,
   deliberately, because nobody has decided. If a commitment gets made it belongs
   in the portal and in the FAQ at the same time, the same way any other term
   does.
6. **What billing shows.** These prototypes show a reference and a state with no
   figures. If clients should see amounts, that comes from the invoicing system
   rather than being retyped here.

Approving the design means approving the shape. Points 1 to 6 are the build.
