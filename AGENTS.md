# AGENTS.md

Guidance for agents working in this repo.

## What this is

A static site with two parts: a long-form **essay** and an **institutions wiki**
that rates institutions on the essay's four questions. Markdown sources compile
to HTML plus a stylesheet. No framework, no client-side JS, no runtime — one
build script renders Markdown, parses YAML front matter, and generates the wiki
pages, scorecards, and index.

## Layout

```
docs/essay.md          ← the essay. Edit to change essay prose.
docs/methodology.md    ← the wiki's rating rubric (source of truth).
docs/institutions/     ← one Markdown file per institution (+ _template.md).
build.mjs              ← the whole build: Markdown → HTML, front-matter parsing,
                         scorecards, validation, index, inline CSS, template.
package.json           ← "build" script; deps: marked, gray-matter.
vercel.json            ← deploy config (buildCommand, outputDirectory: dist).
dist/                  ← generated output. Git-ignored. NEVER edit by hand.
```

There is no `src/`, `index.html`, or `style.css` in the repo root — those live
inside `build.mjs` as template strings and are emitted into `dist/`.

## How to work with it

- **Change the essay** → edit `docs/essay.md`. Standard Markdown parsed by
  `marked`; `##` headings become the essay's sections.
- **Add/edit an institution** → copy `docs/institutions/_template.md`, fill the
  front matter and narrative. Every rating other than `unrated` needs a source
  or the build fails. See `docs/methodology.md` for the rubric.
- **Change the rubric** → edit `docs/methodology.md` AND keep the `QUESTIONS` /
  `RATINGS` constants and `validate()` in `build.mjs` in sync.
- **Change layout, `<head>`, titles** → the `page()` function and the `writeFile`
  calls in `build.mjs`.
- **Change styling** → the `css` string in `build.mjs` (deliberately
  black-on-white; the dark-mode block is intentionally a no-op).
- **Never edit `dist/`.** It is wiped (`rm`) and regenerated on every build.

## Build & verify

```
npm install      # installs marked + gray-matter
npm run build    # runs build.mjs → writes dist/
```

The build is the smoke test, and it validates the wiki: a rating other than
`unrated` with no source, an unknown rating value, or a source id not in the
page's `sources` map fails the build with exit 1. Success prints
`Built: dist/ (N institution page(s) + essay, methodology, index)`. Preview
locally with `npx serve dist` and open `/institutions/`. Deploy is handled by
Vercel via `vercel.json` (`cleanUrls: true`, so `/essay` serves `essay.html`).

## Conventions

- ES modules (`"type": "module"`), Node built-ins (`node:fs/promises`).
- Keep the toolchain minimal — `marked` + `gray-matter` only. Do not add a
  framework, bundler, or CSS pipeline without a real reason.
- Prose edits go in `docs/*.md`; structural/presentation/validation logic goes
  in `build.mjs`. Keep that split.

## The institutions wiki

Each institution is one Markdown file in `docs/institutions/`: YAML front matter
for the structured data, Markdown below for the narrative.

- **Front matter** carries `scorecard` (the four questions `incentives`,
  `corrections`, `verification`, `exit`), a `sources` map of `id → url`, plus
  `flags`, `sector`, `type`, `last_reviewed`, `confidence`.
- **Ratings**: `strong | partial | weak | absent | unrated`. Any non-`unrated`
  rating MUST cite a source id present in `sources`, enforced at build time.
  Exit for a singular institution (central bank, court) uses `by_design: true`
  and renders "None · by design" — not a failure.
- **No overall score.** The four ratings are never summed or averaged.
- The scorecard table, sources list, and index are **generated** from the front
  matter — do not hand-write them in the page body.

---

## The essay: the Four Questions

The essay argues that we trust **institutions** using instincts evolved for
trusting **people**, and that this is a category error. The trigger it names is
cultural: after *Citizens United* (2010), "corporations are people" became the
shared frame — and once you treat a thing as a person, you trust it like one.
Social media then monetized outrage, and anthropomorphizing an institution is
the shortcut that turns a structural problem into a villain story.

**Person trust asks four questions that work for a friend but break on an
institution:** Is he sincere? Consistent? Loyal to me? Sorry when he screws up?
At institutional scale each inverts — sincerity is a marketing deliverable,
consistency punishes institutions that self-correct, loyalty to *you* is
literally corruption, and an apology costs the institution nothing. Run this
program and, at best, you learn nothing (the signals cost the same whether the
truth is good or bad) and, at worst, you read it backwards, because the fraud
invests most in seeming sincere. (Related idea: Japanese *shinrai* — trust in a
person's character — vs *anshin* — security because the structure makes betrayal
a bad move. Institutions can only produce *anshin*.)

**Replace them with four structural questions — none about character:**

1. **Can I identify the incentives?** — Who actually pays them, and for what?
   What does the arrangement make profitable, punishable, invisible? Survives
   staff turnover. *(2008 ratings agencies' issuer-pays model; 737 MAX
   self-certification; the Fed's staggered terms — "ambition counteracts
   ambition.")*
2. **Can I see the mistakes and the corrections?** — At scale, errors are a
   certainty; "have they erred?" carries no information. What matters is whether
   mistakes surface and get fixed in the open. An institution that never revises
   is dead, not honest. *(Commercial aviation's published crash investigations;
   the Catholic Church's hidden reassignment pattern; VW diesel caught by
   outside engineers; CDC mask reversal = correction machinery firing in public,
   misread as "they lied.")*
3. **Can someone outside verify the claims?** — A signal only informs if it is
   expensive to fake. Sincerity is cheap at scale, so "do they seem honest" tells
   you nothing; real, external, published verification does. *(J&J Tylenol's
   verifiable tamper-evident cap vs BP's apology ads; FTX's vibes-based trust
   with no controls.)*
4. **Can I leave?** — Person trust is secured by collateral (the relationship
   itself). Institutions hold none, so the substitute is structural: exit at
   scale — competition, alternatives, appeals. Where exit is impossible,
   trustworthiness becomes optional. *(Equifax — you are the product, you can't
   fire it; "Delete Facebook" that never moved the graph; loyalty pitches as
   lock-in.)*

**The card:** *Who pays them. What happened last time they were wrong. Who can
check from outside. Can I leave.* No question about character — that absence is
the method, because character can be performed but these four can only be built
and checked.

The essay closes optimistically: functioning institutions ("machinery, none of
it glamorous") bought humans ~2 billion extra heartbeats, and machinery —
incentives, corrections, verification, exit — is the thing we can build,
inspect, and improve.

### Editing guidance for the content

- The four-question structure is load-bearing. If you add/reorder sections in
  `docs/essay.md`, keep the "card" summary and the four `##` sections aligned.
- The essay is deliberately self-referential: it runs its own four questions on
  itself and keeps a corrections log. Preserve that reflexive framing and the
  footnoted "best number gets a caveat" honesty standard when editing.
