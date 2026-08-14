#!/usr/bin/env python3
"""
Builds the three FAQ presentation options from one shared content file.

All three render the identical 56 entries, so comparing them is a question of
structure rather than of which one happened to get the better writing. Run:

    python3 scripts/build-faq-options.py

Reads docs/faq-content.json, writes docs/faq-option-{a,b,c}.html.
"""
import html
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "docs" / "faq-content.json").read_text())
ENTRIES = DATA["entries"]
OUT = ROOT / "docs"

PHASES = [
    ("getting-started", "Getting started", "Before you have spoken to anyone."),
    ("planning-budget", "Your concept and planning budget", "The first numbers, and why they are a range."),
    ("design", "The design", "What you are buying, and what it does for the price."),
    ("firm-price", "Your firm price", "The number you can commit to, and what sits behind it."),
    ("building", "Building it", "What the weeks on site actually look like."),
    ("after", "After the build", "Handover, warranty, and the first year."),
    ("maintenance", "Maintenance", "The standing service, and what a visit does and does not cover."),
    ("bridge", "Between the two", "Where a finished garden becomes a maintained one."),
]

SORE = [
    ("range-vs-price", "Why it is a range and not a price",
     "The most common question on this page, and the one worth answering properly. "
     "A landscape price is built from a measured site and chosen materials. Until both exist, "
     "an honest number is a range, and a firm-looking number is a guess wearing a suit. "
     "The range narrows as the work gets defined, and the measuring costs you nothing."),
    ("design-fee", "Why design is paid, and what it does not do",
     "Design is its own step with its own agreement, and it is priced as a share of the "
     "construction cost. It is not folded into the build and it is not credited against it. "
     "That surprises people, so it is stated here rather than at signing: what you are buying "
     "is the plan itself, which is a thing you own and can build from."),
    ("change-orders", "Changes, and what is under the ground",
     "Almost every dispute on a landscape job starts with something nobody wrote down. "
     "The defence is not a padded price. It is a named exclusion, a written change order before "
     "any extra work starts, and being told what was found the day it is found."),
    ("timeline", "How long it takes, and how long your yard is a site",
     "Two different questions. One is how far out the schedule runs, the other is how many weeks "
     "there is a crew in your garden. Weather moves hardscape and planting, and a new garden is "
     "not finished on the last day: it is finished a season later."),
]

PHASE_LABEL = {k: t for k, t, _ in PHASES}
SORE_LABEL = {k: t for k, t, _ in SORE}
LINE_LABEL = {"design-build": "Design / Build", "maintenance": "Maintenance", "both": "Both"}

E = html.escape


def paras(text: str) -> str:
    out = []
    for block in [b.strip() for b in text.split("\n\n") if b.strip()]:
        out.append(f"<p>{E(block)}</p>")
    return "\n".join(out)


def by_phase(key):
    return [e for e in ENTRIES if e["phase"] == key]


def by_sore(key):
    return [e for e in ENTRIES if e.get("sorePoint") == key]


def flag(e, cls="flag"):
    if not e.get("needsDecision"):
        return ""
    note = E(e.get("decisionNote", "").strip())
    return (
        f'<div class="{cls}">'
        f'<span class="{cls}__tag">Needs your sign-off</span>'
        f"<p>{note}</p></div>"
    )


def search_blob(e):
    return E(f"{e['question']} {e['answer']} {PHASE_LABEL.get(e['phase'],'')}").lower()


# --------------------------------------------------------------------------
# Shared CSS pieces
# --------------------------------------------------------------------------
RESET = """
  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; }
  body { -webkit-font-smoothing: antialiased; }
  img { display: block; max-width: 100%; }
  summary::-webkit-details-marker { display: none; }
  summary { cursor: pointer; list-style: none; }
  :focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
"""

# --------------------------------------------------------------------------
# OPTION A — The Walkthrough
# --------------------------------------------------------------------------
def option_a():
    nav, body = [], []
    for i, (key, title, lede) in enumerate(PHASES, 1):
        items = by_phase(key)
        if not items:
            continue
        nav.append(
            f'<li><a href="#{key}"><span class="rail__n">{i:02d}</span>'
            f'<span class="rail__t">{E(title)}</span>'
            f'<span class="rail__c">{len(items)}</span></a></li>'
        )
        qs = "\n".join(
            f"""<details class="q" id="{E(e['id'])}">
              <summary><span class="q__mark" aria-hidden="true"></span><span>{E(e['question'])}</span></summary>
              <div class="q__body">{paras(e['answer'])}{flag(e)}</div>
            </details>"""
            for e in items
        )
        body.append(
            f"""<section class="stage" id="{key}" aria-labelledby="h-{key}">
              <div class="stage__head">
                <span class="stage__n">{i:02d}</span>
                <div>
                  <h2 id="h-{key}">{E(title)}</h2>
                  <p class="stage__lede">{E(lede)}</p>
                </div>
              </div>
              <div class="qs">{qs}</div>
            </section>"""
        )

    return f"""<title>The Walkthrough</title>
<style>
  :root {{
    --ground:#f4f6f1; --panel:#ffffff; --sunk:#e8ece2;
    --ink:#171b15; --soft:#4d5548; --faint:#79806f;
    --rule:#d3d9c9; --hair:#e4e8dc;
    --brand:#2e7d32; --brand-deep:#1b5e20; --wash:#e4efe2;
    --amber:#8a5a00; --amber-wash:#f6ecd8;
    --focus:#1b5e20;
    --serif:Georgia,'Iowan Old Style','Times New Roman',serif;
    --sans:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  }}
  @media (prefers-color-scheme:dark) {{
    :root:not([data-theme="light"]) {{
      --ground:#101309; --panel:#181c14; --sunk:#1f241a;
      --ink:#e9ede1; --soft:#aeb6a3; --faint:#828a76;
      --rule:#333a2b; --hair:#262c1f;
      --brand:#8ecb8f; --brand-deep:#b0e0b0; --wash:#1d2a1b;
      --amber:#dba746; --amber-wash:#2a2211;
      --focus:#8ecb8f;
    }}
  }}
  :root[data-theme="dark"] {{
    --ground:#101309; --panel:#181c14; --sunk:#1f241a;
    --ink:#e9ede1; --soft:#aeb6a3; --faint:#828a76;
    --rule:#333a2b; --hair:#262c1f;
    --brand:#8ecb8f; --brand-deep:#b0e0b0; --wash:#1d2a1b;
    --amber:#dba746; --amber-wash:#2a2211;
    --focus:#8ecb8f;
  }}
{RESET}
  body {{ background:var(--ground); color:var(--ink); font-family:var(--sans);
         font-size:1.0625rem; line-height:1.62; }}
  h1,h2 {{ font-family:var(--serif); font-weight:600; line-height:1.14; text-wrap:balance; }}
  p {{ text-wrap:pretty; }}

  .shell {{ max-width:78rem; margin-inline:auto; padding-inline:clamp(1.1rem,4vw,3rem); }}

  .top {{ padding-block:clamp(3rem,7vw,5.5rem) 2.5rem; border-bottom:2px solid var(--ink); }}
  .eyebrow {{ font-family:var(--mono); font-size:.7rem; letter-spacing:.18em;
              text-transform:uppercase; color:var(--brand); }}
  .top h1 {{ font-size:clamp(2.3rem,6vw,3.9rem); margin-block:.55rem .9rem; max-width:16ch; }}
  .top p {{ max-width:44rem; font-size:1.2rem; color:var(--soft); }}

  .layout {{ display:grid; gap:clamp(2rem,5vw,4rem); grid-template-columns:1fr;
             padding-block:clamp(2rem,5vw,3.5rem) 5rem; }}
  @media (min-width:62rem) {{ .layout {{ grid-template-columns:17rem 1fr; align-items:start; }} }}

  .rail {{ position:sticky; top:1.5rem; }}
  .rail h2 {{ font-family:var(--sans); font-size:.68rem; font-weight:700; letter-spacing:.14em;
              text-transform:uppercase; color:var(--faint); margin-bottom:.85rem; }}
  .rail ol {{ list-style:none; padding:0; display:flex; flex-direction:column; }}
  .rail a {{ display:grid; grid-template-columns:2.1rem 1fr auto; align-items:baseline; gap:.15rem;
             padding:.55rem .1rem; color:var(--ink); text-decoration:none;
             border-top:1px solid var(--hair); font-size:.92rem; }}
  .rail li:last-child a {{ border-bottom:1px solid var(--hair); }}
  .rail a:hover {{ color:var(--brand-deep); }}
  .rail a:hover .rail__t {{ text-decoration:underline; text-underline-offset:.25em; }}
  .rail__n {{ font-family:var(--mono); font-size:.72rem; color:var(--brand); }}
  .rail__c {{ font-family:var(--mono); font-size:.7rem; color:var(--faint); }}

  .stage + .stage {{ margin-top:clamp(2.5rem,6vw,4rem); }}
  .stage__head {{ display:grid; grid-template-columns:auto 1fr; gap:1rem;
                  padding-bottom:1rem; border-bottom:1px solid var(--rule); margin-bottom:.4rem; }}
  .stage__n {{ font-family:var(--mono); font-size:.82rem; color:var(--brand);
               padding-top:.42rem; letter-spacing:.06em; }}
  .stage__head h2 {{ font-size:clamp(1.45rem,3.2vw,2rem); }}
  .stage__lede {{ color:var(--soft); margin-top:.28rem; font-size:.98rem; }}

  .qs {{ display:flex; flex-direction:column; }}
  .q {{ border-bottom:1px solid var(--hair); }}
  .q summary {{ display:grid; grid-template-columns:1.4rem 1fr; gap:.55rem; align-items:start;
                padding:1rem .2rem; font-size:1.06rem; font-weight:600; }}
  .q summary:hover {{ color:var(--brand-deep); }}
  .q__mark {{ position:relative; width:1rem; height:1.55rem; }}
  .q__mark::before, .q__mark::after {{ content:""; position:absolute; background:var(--brand);
    transition:transform .18s ease; }}
  .q__mark::before {{ inset-inline-start:0; top:.72rem; width:.85rem; height:2px; }}
  .q__mark::after {{ inset-inline-start:.415rem; top:.3rem; width:2px; height:.85rem; }}
  .q[open] .q__mark::after {{ transform:scaleY(0); }}
  .q__body {{ padding:0 .2rem 1.35rem 1.95rem; display:flex; flex-direction:column; gap:.85rem;
              max-width:42rem; color:var(--soft); }}
  .q__body p {{ font-size:1rem; }}

  .flag {{ background:var(--amber-wash); border-inline-start:3px solid var(--amber);
           padding:.75rem .95rem; border-radius:0 3px 3px 0; }}
  .flag__tag {{ display:block; font-family:var(--mono); font-size:.62rem; letter-spacing:.12em;
                text-transform:uppercase; color:var(--amber); margin-bottom:.3rem; }}
  .flag p {{ font-size:.9rem; color:var(--ink); }}

  .foot {{ border-top:1px solid var(--rule); padding-block:2rem 4rem; }}
  .foot p {{ font-size:.88rem; color:var(--faint); max-width:44rem; }}
</style>

<div class="shell">
  <header class="top">
    <p class="eyebrow">GMZ Landscaping &middot; Design, Build, Maintenance</p>
    <h1>How a project actually works</h1>
    <p>From the first phone call to the season after the crew leaves. Read it in order if you
      are just starting out, or jump to the stage you are at.</p>
  </header>

  <div class="layout">
    <nav class="rail" aria-label="Stages">
      <h2>The stages</h2>
      <ol>{''.join(nav)}</ol>
    </nav>
    <main>{''.join(body)}</main>
  </div>

  <footer class="foot">
    <p>GMZ Landscaping Inc. &middot; A licensed California landscape contractor serving the
      San Francisco Peninsula. Nothing on this page is a quote. Prices come from a measured
      site and chosen materials.</p>
  </footer>
</div>
"""


# --------------------------------------------------------------------------
# OPTION B — The Answer Desk
# --------------------------------------------------------------------------
def option_b():
    topics = [(k, t) for k, t, _ in PHASES if by_phase(k)]
    chips = "".join(
        f'<button type="button" class="chip" data-topic="{k}">{E(t)}'
        f'<span class="chip__n">{len(by_phase(k))}</span></button>'
        for k, t in topics
    )
    rows = "".join(
        f"""<details class="row" id="{E(e['id'])}" data-topic="{E(e['phase'])}"
             data-line="{E(e['serviceLine'])}" data-blob="{search_blob(e)}">
          <summary>
            <span class="row__q">{E(e['question'])}</span>
            <span class="row__meta">
              <span class="tag tag--{E(e['phase'])}">{E(PHASE_LABEL.get(e['phase'],''))}</span>
              {'<span class="tag tag--flag">sign-off</span>' if e.get('needsDecision') else ''}
            </span>
          </summary>
          <div class="row__a">{paras(e['answer'])}{flag(e)}</div>
        </details>"""
        for e in ENTRIES
    )

    return f"""<title>The Answer Desk</title>
<style>
  :root {{
    --ground:#fbfcfa; --panel:#ffffff; --sunk:#f0f2ec; --edge:#e3e7dc;
    --ink:#14170f; --soft:#4a5145; --faint:#767d6c;
    --brand:#2e7d32; --brand-deep:#1b5e20; --wash:#e6f1e4;
    --amber:#87590a; --amber-wash:#f7eeda;
    --focus:#1b5e20;
    --serif:Georgia,'Iowan Old Style','Times New Roman',serif;
    --sans:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  }}
  @media (prefers-color-scheme:dark) {{
    :root:not([data-theme="light"]) {{
      --ground:#0e100b; --panel:#161a12; --sunk:#1c2117; --edge:#2e3427;
      --ink:#ebeee4; --soft:#aab29e; --faint:#7f8773;
      --brand:#8ecb8f; --brand-deep:#b2e2b2; --wash:#1c2a1a;
      --amber:#dda948; --amber-wash:#2a2210;
      --focus:#8ecb8f;
    }}
  }}
  :root[data-theme="dark"] {{
    --ground:#0e100b; --panel:#161a12; --sunk:#1c2117; --edge:#2e3427;
    --ink:#ebeee4; --soft:#aab29e; --faint:#7f8773;
    --brand:#8ecb8f; --brand-deep:#b2e2b2; --wash:#1c2a1a;
    --amber:#dda948; --amber-wash:#2a2210;
    --focus:#8ecb8f;
  }}
{RESET}
  body {{ background:var(--ground); color:var(--ink); font-family:var(--sans);
         font-size:1rem; line-height:1.58; }}
  .shell {{ max-width:60rem; margin-inline:auto; padding-inline:clamp(1rem,3.5vw,2.25rem);
            padding-bottom:5rem; }}

  .masthead {{ padding-block:clamp(2.25rem,5vw,3.5rem) 1.25rem; }}
  .masthead h1 {{ font-family:var(--serif); font-size:clamp(1.9rem,4.5vw,2.7rem);
                  font-weight:600; line-height:1.12; }}
  .masthead p {{ margin-top:.5rem; color:var(--soft); max-width:38rem; }}

  .sr {{ position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%);
         white-space:nowrap; }}
  .deck {{ position:sticky; top:0; z-index:5; background:var(--ground);
           padding-block:.9rem; border-bottom:1px solid var(--edge); }}
  .search {{ position:relative; display:block; }}
  .search input {{ width:100%; font:inherit; font-size:1.02rem; color:var(--ink);
    background:var(--panel); border:1px solid var(--edge); border-radius:3px;
    padding:.72rem .9rem .72rem 2.3rem; }}
  .search input::placeholder {{ color:var(--faint); }}
  .search svg {{ position:absolute; inset-inline-start:.75rem; top:50%; translate:0 -50%;
                 width:1rem; height:1rem; stroke:var(--faint); fill:none; stroke-width:2; }}

  .filters {{ display:flex; flex-wrap:wrap; gap:.35rem; margin-top:.7rem; align-items:center; }}
  .chip {{ font:inherit; font-size:.78rem; padding:.24rem .6rem; border-radius:2px; cursor:pointer;
    background:var(--panel); border:1px solid var(--edge); color:var(--soft);
    display:inline-flex; gap:.35rem; align-items:baseline; }}
  .chip:hover {{ border-color:var(--brand); color:var(--ink); }}
  .chip[aria-pressed="true"] {{ background:var(--brand); border-color:var(--brand); color:var(--ground); }}
  .chip__n {{ font-family:var(--mono); font-size:.65rem; opacity:.7; }}
  .chip--reset {{ margin-inline-start:auto; border-style:dashed; }}

  .count {{ font-family:var(--mono); font-size:.72rem; letter-spacing:.08em;
            text-transform:uppercase; color:var(--faint); padding-block:1rem .35rem; }}

  .row {{ border-bottom:1px solid var(--edge); }}
  .row[hidden] {{ display:none; }}
  .row summary {{ display:flex; flex-wrap:wrap; gap:.35rem .8rem; align-items:baseline;
                  justify-content:space-between; padding:.78rem .1rem; }}
  .row summary:hover .row__q {{ color:var(--brand-deep); text-decoration:underline;
                                text-underline-offset:.22em; }}
  .row__q {{ font-weight:600; font-size:1rem; flex:1 1 20rem; }}
  .row[open] .row__q {{ color:var(--brand-deep); }}
  .row__meta {{ display:flex; gap:.3rem; flex:none; }}
  .tag {{ font-family:var(--mono); font-size:.6rem; letter-spacing:.09em; text-transform:uppercase;
          padding:.15em .45em; border-radius:2px; background:var(--sunk); color:var(--faint);
          white-space:nowrap; }}
  .tag--flag {{ background:var(--amber-wash); color:var(--amber); }}
  .row__a {{ padding:0 .1rem 1.15rem 0; display:flex; flex-direction:column; gap:.75rem;
             max-width:44rem; color:var(--soft); }}
  .row__a p {{ font-size:.97rem; text-wrap:pretty; }}

  .flag {{ background:var(--amber-wash); border-inline-start:3px solid var(--amber);
           padding:.7rem .9rem; border-radius:0 3px 3px 0; }}
  .flag__tag {{ display:block; font-family:var(--mono); font-size:.6rem; letter-spacing:.12em;
                text-transform:uppercase; color:var(--amber); margin-bottom:.28rem; }}
  .flag p {{ font-size:.88rem; color:var(--ink); }}

  .empty {{ padding:2.5rem 0; color:var(--faint); }}
  .empty[hidden] {{ display:none; }}
  .empty strong {{ color:var(--ink); display:block; font-size:1.05rem; margin-bottom:.3rem; }}

  mark {{ background:var(--wash); color:inherit; padding:0 .1em; border-radius:2px; }}
</style>

<div class="shell">
  <header class="masthead">
    <h1>Questions, answered</h1>
    <p>Everything people ask us, in one place. Search it, or filter by where you are in a
      project. Fifty-six answers, no forms to fill in first.</p>
  </header>

  <div class="deck">
    <label class="search">
      <span class="sr">Search the answers</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input type="search" id="q" placeholder="Search: warranty, deposit, how long, plants&hellip;"
             autocomplete="off" aria-label="Search the answers">
    </label>
    <div class="filters" role="group" aria-label="Filter by stage">
      {chips}
      <button type="button" class="chip chip--reset" id="reset">Clear</button>
    </div>
  </div>

  <p class="count" id="count" role="status">Showing all {len(ENTRIES)} answers</p>

  <main id="list">{rows}</main>

  <div class="empty" hidden id="empty">
    <strong>Nothing matches that.</strong>
    <p>Try a shorter word, or clear the filters. If it is not here, call us and ask.</p>
  </div>
</div>

<script>
  const input = document.getElementById('q');
  const rows = [...document.querySelectorAll('.row')];
  const chips = [...document.querySelectorAll('.chip[data-topic]')];
  const count = document.getElementById('count');
  const empty = document.getElementById('empty');
  const reset = document.getElementById('reset');
  const total = rows.length;
  let topic = null;

  function apply() {{
    const term = input.value.trim().toLowerCase();
    let shown = 0;
    for (const row of rows) {{
      const okTopic = !topic || row.dataset.topic === topic;
      const okTerm = !term || row.dataset.blob.includes(term);
      const show = okTopic && okTerm;
      row.hidden = !show;
      if (show) shown++;
      if (!show) row.open = false;
    }}
    empty.hidden = shown > 0;
    if (!term && !topic) count.textContent = `Showing all ${{total}} answers`;
    else count.textContent = `${{shown}} of ${{total}} ${{shown === 1 ? 'answer' : 'answers'}}`;
  }}

  input.addEventListener('input', apply);
  for (const chip of chips) {{
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {{
      topic = topic === chip.dataset.topic ? null : chip.dataset.topic;
      for (const c of chips) c.setAttribute('aria-pressed', String(c.dataset.topic === topic));
      apply();
    }});
  }}
  reset.addEventListener('click', () => {{
    input.value = ''; topic = null;
    for (const c of chips) c.setAttribute('aria-pressed', 'false');
    apply(); input.focus();
  }});
  document.addEventListener('keydown', (e) => {{
    if (e.key === '/' && document.activeElement !== input) {{ e.preventDefault(); input.focus(); }}
  }});
</script>
"""


# --------------------------------------------------------------------------
# OPTION C — Straight Answers
# --------------------------------------------------------------------------
def option_c():
    used = set()
    sections = []
    jump = []
    for key, title, lede in SORE:
        items = by_sore(key)
        if not items:
            continue
        for e in items:
            used.add(e["id"])
        jump.append(f'<li><a href="#{key}">{E(title)}</a></li>')
        qs = "\n".join(
            f"""<details class="q" id="{E(e['id'])}">
              <summary>{E(e['question'])}</summary>
              <div class="q__body">{paras(e['answer'])}{flag(e)}</div>
            </details>"""
            for e in items
        )
        sections.append(
            f"""<section class="chapter" id="{key}" aria-labelledby="h-{key}">
              <h2 id="h-{key}">{E(title)}</h2>
              <p class="chapter__lede">{E(lede)}</p>
              <div class="qs">{qs}</div>
            </section>"""
        )

    rest = [e for e in ENTRIES if e["id"] not in used]
    groups = []
    for key, title, _ in PHASES:
        items = [e for e in rest if e["phase"] == key]
        if not items:
            continue
        qs = "\n".join(
            f"""<details class="q q--quiet" id="{E(e['id'])}">
              <summary>{E(e['question'])}</summary>
              <div class="q__body">{paras(e['answer'])}{flag(e)}</div>
            </details>"""
            for e in items
        )
        groups.append(f'<div class="group"><h3>{E(title)}</h3><div class="qs">{qs}</div></div>')

    return f"""<title>Straight Answers</title>
<style>
  :root {{
    --ground:#f2f5ee; --panel:#fbfcf8; --ink:#1a2016; --soft:#4a5544; --faint:#78826f;
    --rule:#cfd8c4; --hair:#e0e7d6;
    --brand:#1b5e20; --brand-lit:#2e7d32; --wash:#e2eddf;
    --amber:#87590a; --amber-wash:#f4ecd8;
    --focus:#1b5e20;
    --serif:Georgia,'Iowan Old Style','Times New Roman',serif;
    --sans:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  }}
  @media (prefers-color-scheme:dark) {{
    :root:not([data-theme="light"]) {{
      --ground:#11150e; --panel:#181d15; --ink:#e8ede0; --soft:#adb6a2; --faint:#818b76;
      --rule:#343c2c; --hair:#272e20;
      --brand:#98d199; --brand-lit:#b4e3b4; --wash:#1e2a1c;
      --amber:#dda948; --amber-wash:#2a2210;
      --focus:#98d199;
    }}
  }}
  :root[data-theme="dark"] {{
    --ground:#11150e; --panel:#181d15; --ink:#e8ede0; --soft:#adb6a2; --faint:#818b76;
    --rule:#343c2c; --hair:#272e20;
    --brand:#98d199; --brand-lit:#b4e3b4; --wash:#1e2a1c;
    --amber:#dda948; --amber-wash:#2a2210;
    --focus:#98d199;
  }}
{RESET}
  body {{ background:var(--ground); color:var(--ink); font-family:var(--serif);
         font-size:1.125rem; line-height:1.7; }}
  .shell {{ max-width:44rem; margin-inline:auto; padding-inline:clamp(1.15rem,5vw,2rem);
            padding-bottom:6rem; }}
  p {{ text-wrap:pretty; }}

  .opening {{ padding-block:clamp(3.5rem,9vw,7rem) 2rem; }}
  .opening .eyebrow {{ font-family:var(--sans); font-size:.68rem; letter-spacing:.2em;
    text-transform:uppercase; color:var(--brand-lit); }}
  .opening h1 {{ font-size:clamp(2.2rem,6.5vw,3.5rem); font-weight:400; line-height:1.16;
    letter-spacing:-.015em; margin-block:1rem .9rem; text-wrap:balance; }}
  .opening .intro {{ font-size:1.2rem; color:var(--soft); }}
  .opening .intro + .intro {{ margin-top:.85rem; }}

  .jump {{ margin-top:2.4rem; padding-top:1.3rem; border-top:1px solid var(--rule); }}
  .jump h2 {{ font-family:var(--sans); font-size:.66rem; font-weight:700; letter-spacing:.16em;
    text-transform:uppercase; color:var(--faint); margin-bottom:.7rem; }}
  .jump ol {{ list-style:none; padding:0; counter-reset:j;
              display:flex; flex-direction:column; gap:.42rem; }}
  .jump li {{ counter-increment:j; display:grid; grid-template-columns:1.7rem 1fr; gap:.2rem; }}
  .jump li::before {{ content:counter(j,decimal-leading-zero); font-family:var(--mono);
    font-size:.72rem; color:var(--brand-lit); padding-top:.34rem; }}
  .jump a {{ color:var(--ink); text-decoration:none; font-size:1.02rem;
             border-bottom:1px solid var(--rule); padding-bottom:.12rem; }}
  .jump a:hover {{ color:var(--brand); border-color:var(--brand); }}

  .chapter {{ padding-top:clamp(3rem,7vw,5rem); }}
  .chapter h2 {{ font-size:clamp(1.6rem,4vw,2.15rem); font-weight:400; line-height:1.2;
    text-wrap:balance; letter-spacing:-.01em; }}
  .chapter__lede {{ margin-top:.9rem; color:var(--soft); font-size:1.1rem; }}
  .chapter .qs {{ margin-top:1.9rem; border-top:1px solid var(--rule); }}

  .q {{ border-bottom:1px solid var(--hair); }}
  .q summary {{ padding:1rem 1.6rem 1rem 0; font-size:1.06rem; position:relative;
                font-family:var(--sans); font-weight:600; line-height:1.4; }}
  .q summary::after {{ content:""; position:absolute; inset-inline-end:.2rem; top:1.45rem;
    width:.5rem; height:.5rem; border-right:1.5px solid var(--brand-lit);
    border-bottom:1.5px solid var(--brand-lit); rotate:45deg; transition:rotate .18s ease; }}
  .q[open] summary::after {{ rotate:225deg; }}
  .q summary:hover {{ color:var(--brand); }}
  .q__body {{ padding-bottom:1.5rem; display:flex; flex-direction:column; gap:1rem;
              color:var(--soft); }}
  .q__body p {{ font-size:1.06rem; }}

  .flag {{ background:var(--amber-wash); border-inline-start:3px solid var(--amber);
           padding:.8rem 1rem; border-radius:0 3px 3px 0; }}
  .flag__tag {{ display:block; font-family:var(--mono); font-size:.6rem; letter-spacing:.12em;
                text-transform:uppercase; color:var(--amber); margin-bottom:.3rem; }}
  .flag p {{ font-size:.94rem; color:var(--ink); font-family:var(--sans); line-height:1.55; }}

  .everything {{ padding-top:clamp(3.5rem,8vw,6rem); }}
  .everything > h2 {{ font-size:clamp(1.5rem,3.5vw,2rem); font-weight:400; }}
  .everything > p {{ color:var(--soft); margin-top:.7rem; }}
  .group {{ margin-top:2.4rem; }}
  .group h3 {{ font-family:var(--sans); font-size:.7rem; font-weight:700; letter-spacing:.15em;
    text-transform:uppercase; color:var(--faint); padding-bottom:.5rem;
    border-bottom:1px solid var(--rule); }}
  .q--quiet summary {{ font-size:1rem; font-weight:500; }}

  .close {{ margin-top:clamp(3.5rem,8vw,6rem); padding-top:1.6rem;
            border-top:1px solid var(--rule); }}
  .close p {{ font-size:1rem; color:var(--soft); }}
  .close p + p {{ margin-top:.7rem; }}
  .close .sig {{ font-family:var(--sans); font-size:.8rem; color:var(--faint); margin-top:1.4rem; }}
</style>

<div class="shell">
  <header class="opening">
    <p class="eyebrow">GMZ Landscaping</p>
    <h1>The questions people are too polite to ask twice</h1>
    <p class="intro">Four things come up on nearly every job, and all four are easier to hear
      early than late. Here they are, answered the way we would answer them sitting in your
      garden.</p>
    <p class="intro">Everything else people ask is further down.</p>

    <nav class="jump" aria-label="Contents">
      <h2>What this covers</h2>
      <ol>{''.join(jump)}</ol>
    </nav>
  </header>

  <main>
    {''.join(sections)}

    <section class="everything" aria-labelledby="h-rest">
      <h2 id="h-rest">Everything else</h2>
      <p>Grouped by where you are in a project.</p>
      {''.join(groups)}
    </section>

    <footer class="close">
      <p>If your question is not here, it is worth a phone call. Most of what is written above
        started as something somebody asked on a first visit.</p>
      <p>Nothing on this page is a quote. A landscape price comes from a measured site and
        chosen materials, and until both exist any number is a range.</p>
      <p class="sig">GMZ Landscaping Inc. &middot; A licensed California landscape contractor
        working the San Francisco Peninsula.</p>
    </footer>
  </main>
</div>
"""


OUT.mkdir(exist_ok=True)
for name, fn in (("a", option_a), ("b", option_b), ("c", option_c)):
    path = OUT / f"faq-option-{name}.html"
    path.write_text(fn())
    print(f"wrote {path.relative_to(ROOT)}  ({len(path.read_text()):,} bytes)")

print(f"\n{len(ENTRIES)} entries rendered into all three")
print(f"{sum(1 for e in ENTRIES if e.get('needsDecision'))} flagged as needing sign-off")
