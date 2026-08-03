import { readFile, writeFile, mkdir, rm, readdir } from "node:fs/promises";
import { marked } from "marked";
import matter from "gray-matter";

const OUT = "dist";

const css = `:root { color-scheme: light; }
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: #ffffff;
  color: #111111;
  font: 18px/1.7 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
main { max-width: 42rem; margin: 0 auto; padding: clamp(2.5rem, 6vw, 5rem) 1.25rem 6rem; }
a { color: #111111; text-underline-offset: 2px; text-decoration-thickness: 1px; }
a:hover { text-decoration: none; }
h1 { font-size: clamp(1.7rem, 5vw, 2.2rem); line-height: 1.2; margin: 0 0 1.5rem; letter-spacing: -0.01em; }
h2 { font-size: clamp(1.25rem, 3.5vw, 1.5rem); line-height: 1.3; margin: 2.75rem 0 1rem; }
p { margin: 0 0 1.25rem; }
hr { border: 0; border-top: 1px solid #e5e5e5; margin: 2.5rem 0; }
blockquote { margin: 1.5rem 0; padding-left: 1rem; border-left: 3px solid #ddd; color: #333; }
code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.9em; }
.nav { font-size: 0.95rem; margin-bottom: 2.5rem; }
.home { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
.home p { color: #444; }
.home .cta { margin-top: 0.5rem; font-size: 1.05rem; }
.home .cta a { font-weight: 600; }
.meta { color: #666; font-size: 0.85rem; margin: -0.75rem 0 1.5rem; }
table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; font-size: 0.95rem; }
th, td { border: 1px solid #e5e5e5; padding: 0.5rem 0.6rem; text-align: left; vertical-align: top; }
th { background: #fafafa; font-weight: 600; }
.scorecard td .note, .index .note { color: #666; font-size: 0.82rem; }
.scorecard td.q { white-space: nowrap; font-weight: 600; }
.badge { display: inline-block; padding: 0.1rem 0.55rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; border: 1px solid #ccc; white-space: nowrap; }
.r-strong { background: #e7f5e7; border-color: #bcdbbc; }
.r-partial { background: #fdf6e3; border-color: #e8dcae; }
.r-weak { background: #fdeaea; border-color: #e6bcbc; }
.r-absent { background: #eeeeee; border-color: #cccccc; }
.r-unrated { background: #ffffff; color: #999999; }
.srcs { font-size: 0.78rem; }
.srcs a { color: #555; }
ol.sources { font-size: 0.85rem; color: #444; }
ol.sources code { color: #111; }
@media (prefers-color-scheme: dark) {
  /* keep it black on white per design; do nothing */
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

const md = await readFile("docs/essay.md", "utf8");
await writeFile(
  `${OUT}/essay.html`,
  page({
    title: "4 Questions Essay",
    description: "An essay on how to trust institutions.",
    body: `<p class="nav"><a href="/">&larr; Home</a></p>\n${marked.parse(md)}`,
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
    body: `<h1>Four Questions</h1>
<p>An essay on how to trust the things that aren't people.</p>
<p class="cta"><a href="/essay.html">Read the essay &rarr;</a></p>`,
  })
);

console.log(`Built: ${OUT}/ (${institutions.length} institution page(s) + essay, methodology, index)`);
