import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { marked } from "marked";

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
@media (prefers-color-scheme: dark) {
  /* keep it black on white per design; do nothing */
}
`;

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

const md = await readFile("docs/essay.md", "utf8");
const essayHtml = marked.parse(md);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

await writeFile(`${OUT}/style.css`, css);

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

await writeFile(
  `${OUT}/essay.html`,
  page({
    title: "4 Questions Essay",
    description: "An essay on how to trust institutions.",
    body: `<p class="nav"><a href="/">&larr; Home</a></p>
${essayHtml}`,
  })
);

console.log("Built:", `${OUT}/index.html`, `${OUT}/essay.html`, `${OUT}/style.css`);
