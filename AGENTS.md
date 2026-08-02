# AGENTS.md

Guidance for agents working in this repo.

## What this is

A single-essay static site. One Markdown source is compiled to two HTML pages
plus a stylesheet. No framework, no client-side JS, no runtime — just a build
script that renders Markdown and wraps it in an HTML template.

## Layout

```
docs/essay.md   ← the content. Edit this to change the essay.
build.mjs       ← the whole build: Markdown → HTML, inline CSS, page template.
package.json    ← "build" script + marked dependency.
vercel.json     ← deploy config (buildCommand, outputDirectory: dist).
dist/           ← generated output. Git-ignored. NEVER edit by hand.
```

There is no `src/`, `index.html`, or `style.css` in the repo root — those live
inside `build.mjs` as template strings and are emitted into `dist/`.

## How to work with it

- **Change the essay** → edit `docs/essay.md`. It is standard Markdown parsed by
  `marked`. Headings (`##`) become the section structure of the essay page.
- **Change layout, `<head>`, page titles/descriptions** → edit the `page()`
  function and the two `writeFile` calls in `build.mjs`.
- **Change styling** → edit the `css` template string in `build.mjs` (design is
  deliberately black-on-white; the dark-mode block is intentionally a no-op).
- **Never edit `dist/`.** It is wiped (`rm`) and regenerated on every build.

## Build & verify

```
npm install      # first time only; installs marked
npm run build    # runs build.mjs → writes dist/{index,essay}.html + style.css
```

The build is the smoke test. After any change, run `npm run build` and confirm
it prints `Built: dist/index.html dist/essay.html dist/style.css` with no error,
then open `dist/essay.html` to eyeball the rendered result. Deploy is handled by
Vercel using `vercel.json` (`cleanUrls: true`, so `/essay` serves `essay.html`).

## Conventions

- ES modules (`"type": "module"`), Node built-ins (`node:fs/promises`).
- Keep the toolchain minimal — a lone `marked` dependency is the point. Do not
  add a framework, bundler, or CSS pipeline without a real reason.
- Prose edits go in `docs/essay.md`; structural/presentation edits go in
  `build.mjs`. Keep that split.

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
program and you build "a detector installed backwards": it fires on the honest
and stays silent for the fraud. (Related idea: Japanese *shinrai* — trust in a
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
