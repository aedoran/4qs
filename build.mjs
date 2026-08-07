import { readFile, writeFile, mkdir, rm, readdir, copyFile } from "node:fs/promises";
import { marked } from "marked";
import matter from "gray-matter";

const OUT = "dist";

const css = `:root {
  color-scheme: light dark;
  --ink: #33383d;
  --ink-soft: #565f66;
  --muted: #7c848b;
  --bg: #ffffff;
  --bg-tint: #f4f5f6;
  --line: #d9dcdf;
  --panel: #c5c5c5;
  --cool: #b7bcc1;
  --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --serif: Charter, "Iowan Old Style", Georgia, Cambria, "Times New Roman", serif;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font: 18px/1.7 var(--serif);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
main { max-width: 42rem; margin: 0 auto; padding: clamp(2.5rem, 6vw, 5rem) 1.25rem 6rem; }
a { color: var(--ink); text-underline-offset: 2px; text-decoration-thickness: 1px; }
a:hover { text-decoration: none; }
h1 { font-family: var(--sans); font-size: clamp(1.7rem, 5vw, 2.2rem); line-height: 1.2; margin: 0 0 1.5rem; letter-spacing: -0.01em; }
h2 { font-family: var(--sans); font-size: clamp(1.25rem, 3.5vw, 1.5rem); line-height: 1.3; margin: 2.75rem 0 1rem; }
p { margin: 0 0 1.25rem; }
hr { border: 0; border-top: 1px solid var(--line); margin: 2.5rem 0; }
blockquote { margin: 1.5rem 0; padding-left: 1rem; border-left: 3px solid var(--cool); color: var(--ink-soft); }
code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.9em; }
.nav { font-family: var(--sans); font-size: 0.95rem; margin-bottom: 2.5rem; }
.home { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
.home p { color: var(--ink-soft); }
.home .cta { margin-top: 0.5rem; font-size: 1.05rem; }
.home .cta a { font-weight: 600; }
.home .logo { width: 88px; height: auto; margin-bottom: 1.75rem; }
.meta { font-family: var(--sans); color: var(--muted); font-size: 0.85rem; margin: -0.75rem 0 1.5rem; }
table { font-family: var(--sans); font-variant-numeric: tabular-nums; border-collapse: collapse; width: 100%; margin: 1.5rem 0; font-size: 0.95rem; }
th, td { border: 1px solid var(--line); padding: 0.5rem 0.6rem; text-align: left; vertical-align: top; }
th { background: var(--bg-tint); font-weight: 600; }
.scorecard td .note, .index .note { color: var(--muted); font-size: 0.82rem; }
.scorecard td.q { white-space: nowrap; font-weight: 600; }
.badge { font-family: var(--sans); display: inline-block; padding: 0.1rem 0.55rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; border: 1px solid var(--panel); white-space: nowrap; }
.r-strong { background: #e7f5e7; border-color: #bcdbbc; }
.r-partial { background: #fdf6e3; border-color: #e8dcae; }
.r-weak { background: #fdeaea; border-color: #e6bcbc; }
.r-absent { background: #eeeeee; border-color: #cccccc; }
.r-unrated { background: var(--bg); color: var(--muted); }
.srcs { font-size: 0.78rem; }
.srcs a { color: var(--ink-soft); }
ol.sources { font-family: var(--sans); font-size: 0.85rem; color: var(--ink-soft); }
ol.sources code { color: var(--ink); }
@media (prefers-color-scheme: dark) {
  :root {
    --ink: #d7dce1;
    --ink-soft: #a6adb4;
    --muted: #838b92;
    --bg: #1b1f23;
    --bg-tint: #262b30;
    --line: #363c42;
    --panel: #565f66;
    --cool: #565f66;
  }
  .r-strong { background: #1f3a26; border-color: #315a3c; color: #bfe6c8; }
  .r-partial { background: #3a3418; border-color: #5a5024; color: #ecd9a4; }
  .r-weak { background: #3a2020; border-color: #5a3030; color: #e8b6b6; }
  .r-absent { background: #2c3237; border-color: #444b52; color: #c3c9cf; }
  .r-unrated { background: transparent; color: var(--muted); }
}
`;

const NAV = `<p class="nav"><a href="/">Home</a> &middot; <a href="/essay.html">Essay</a> &middot; <a href="/institutions/">Institutions</a> &middot; <a href="/methodology.html">Methodology</a></p>`;

function page({ title, description = "", body, home = false }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>${description ? `\n<meta name="description" content="${description}">` : ""}
<link rel="stylesheet" href="/style.css">
<link rel="icon" type="image/svg+xml" href="/4qs_square.svg">
<link rel="icon" type="image/png" href="/4qs_square.png">
<link rel="apple-touch-icon" href="/4qs_square.png">
</head>
<body>
<main${home ? ' class="home"' : ""}>
${body}
</main>
</body>
</html>
`;
}

// --- Rubric ---------------------------------------------------------------
const QUESTIONS = [
  ["incentives", "Incentives", "Who pays them, and for what?"],
  ["corrections", "Corrections", "Can you see the mistakes and the fixes?"],
  ["verification", "Verification", "Can someone outside verify the claims?"],
  ["exit", "Exit", "Can you leave?"],
];
const RATINGS = {
  strong: { label: "Strong", cls: "r-strong" },
  partial: { label: "Partial", cls: "r-partial" },
  weak: { label: "Weak", cls: "r-weak" },
  absent: { label: "Absent", cls: "r-absent" },
  unrated: { label: "Unrated", cls: "r-unrated" },
};

function badge(entry, key) {
  if (key === "exit" && entry.by_design) {
    return `<span class="badge r-absent" title="No exit, by design">None &middot; by design</span>`;
  }
  const r = RATINGS[entry.rating] || RATINGS.unrated;
  return `<span class="badge ${r.cls}">${r.label}</span>`;
}

function srcLinks(ids, sources) {
  if (!ids || !ids.length) return "";
  const links = ids
    .map((id) => (sources[id] ? `<a href="${sources[id]}">${id}</a>` : id))
    .join(", ");
  return ` <span class="srcs">[${links}]</span>`;
}

function scorecardTable(data) {
  const sc = data.scorecard;
  const rows = QUESTIONS.map(([key, label, q]) => {
    const e = sc[key];
    return `<tr><td class="q">${label}<div class="note">${q}</div></td><td>${badge(e, key)}</td><td>${e.note || ""}${srcLinks(e.sources, data.sources)}</td></tr>`;
  }).join("\n");
  return `<table class="scorecard"><thead><tr><th>Question</th><th>Rating</th><th>Why</th></tr></thead><tbody>\n${rows}\n</tbody></table>`;
}

function sourcesSection(sources) {
  const ids = Object.keys(sources || {});
  if (!ids.length) return "";
  const items = ids
    .map((id) => `<li><code>${id}</code> &mdash; <a href="${sources[id]}">${sources[id]}</a></li>`)
    .join("\n");
  return `<h2>Sources</h2>\n<ol class="sources">\n${items}\n</ol>`;
}

// --- Validation -----------------------------------------------------------
const REQUIRED = ["name", "slug", "sector", "type", "jurisdiction", "summary", "last_reviewed", "scorecard", "sources"];

function validate(data, file) {
  const errors = [];
  for (const k of REQUIRED) {
    if (data[k] == null) errors.push(`${file}: missing '${k}'`);
  }
  const sc = data.scorecard || {};
  for (const [key] of QUESTIONS) {
    const e = sc[key];
    if (!e) {
      errors.push(`${file}: scorecard.${key} missing`);
      continue;
    }
    if (!RATINGS[e.rating]) {
      errors.push(`${file}: scorecard.${key}.rating '${e.rating}' is not a valid rating`);
    }
    const byDesign = key === "exit" && e.by_design === true;
    if (e.rating !== "unrated" && !byDesign && (!e.sources || !e.sources.length)) {
      errors.push(`${file}: scorecard.${key} rating '${e.rating}' needs at least one source`);
    }
    for (const id of e.sources || []) {
      if (!data.sources || !data.sources[id]) {
        errors.push(`${file}: scorecard.${key} cites source '${id}' not defined in sources map`);
      }
    }
  }
  return errors;
}

// --- Load institutions ----------------------------------------------------
const INST_DIR = "docs/institutions";
const files = (await readdir(INST_DIR)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

const institutions = [];
const allErrors = [];
for (const f of files) {
  const raw = await readFile(`${INST_DIR}/${f}`, "utf8");
  const { data, content } = matter(raw);
  const errs = validate(data, f);
  if (errs.length) allErrors.push(...errs);
  else institutions.push({ data, content, file: f });
}
if (allErrors.length) {
  console.error("Validation failed:\n" + allErrors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
institutions.sort((a, b) => a.data.name.localeCompare(b.data.name));

// --- Render ---------------------------------------------------------------
await rm(OUT, { recursive: true, force: true });
await mkdir(`${OUT}/institutions`, { recursive: true });

await writeFile(`${OUT}/style.css`, css);
await copyFile("4qs_square.svg", `${OUT}/4qs_square.svg`);
await copyFile("4qs_square.png", `${OUT}/4qs_square.png`);

const md = await readFile("docs/essay.md", "utf8");
const machineryMd = await readFile("docs/existing_machinery.md", "utf8");
await writeFile(
  `${OUT}/essay.html`,
  page({
    title: "4 Questions Essay",
    description: "An essay on how to trust institutions.",
    body: `<p class="nav"><a href="/">&larr; Home</a></p>\n${marked.parse(md)}\n<hr id="existing-machinery">\n${marked.parse(machineryMd)}`,
  })
);

const methodologyMd = await readFile("docs/methodology.md", "utf8");
await writeFile(
  `${OUT}/methodology.html`,
  page({
    title: "Methodology",
    description: "How institutions are rated on the four questions.",
    body: `${NAV}\n${marked.parse(methodologyMd)}`,
  })
);

for (const { data, content } of institutions) {
  const header = `<h1>${data.name}</h1>\n<p>${data.summary}</p>\n<p class="meta">${data.sector} &middot; ${data.type} &middot; ${data.jurisdiction} &middot; reviewed ${data.last_reviewed} &middot; confidence ${data.confidence || "n/a"}</p>`;
  const body = `${NAV}\n${header}\n${scorecardTable(data)}\n${marked.parse(content)}\n${sourcesSection(data.sources)}`;
  await writeFile(
    `${OUT}/institutions/${data.slug}.html`,
    page({ title: `${data.name} — 4 Questions`, description: data.summary, body })
  );
}

// Institutions index
const indexRows = institutions
  .map(({ data }) => {
    const cells = QUESTIONS.map(([key]) => `<td>${badge(data.scorecard[key], key)}</td>`).join("");
    return `<tr><td><a href="/institutions/${data.slug}.html">${data.name}</a><div class="note">${data.sector}</div></td>${cells}</tr>`;
  })
  .join("\n");
const indexTable = `<table class="index"><thead><tr><th>Institution</th><th>Incentives</th><th>Corrections</th><th>Verification</th><th>Exit</th></tr></thead><tbody>\n${indexRows}\n</tbody></table>`;
await writeFile(
  `${OUT}/institutions/index.html`,
  page({
    title: "Institutions — 4 Questions",
    description: "Institutions rated on incentives, corrections, verification, and exit.",
    body: `${NAV}\n<h1>Institutions</h1>\n<p>Each institution is rated on the four structural questions. Ratings are never summed. See the <a href="/methodology.html">methodology</a>.</p>\n${indexTable}`,
  })
);

// Home
await writeFile(
  `${OUT}/index.html`,
  page({
    title: "Four Questions",
    description: "An essay on how to trust institutions.",
    home: true,
    body: `<img class="logo" src="/4qs_square.svg" alt="Four Questions logo" width="88" height="88">
<h1>Four Questions</h1>
<p>An essay on how to trust the things that aren't people.</p>
<p class="cta"><a href="/essay.html">Read the essay &rarr;</a></p>
<p class="cta"><a href="/essay.html#existing-machinery">Existing machinery &rarr;</a></p>`,
  })
);

console.log(`Built: ${OUT}/ (${institutions.length} institution page(s) + essay, methodology, index)`);
