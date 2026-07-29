import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { seo, getSeo } from "../src/seo.js";

const outputDirectory = resolve("dist");
const template = await readFile(resolve(outputDirectory, "index.html"), "utf8");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderPage(path) {
  const page = getSeo(path);
  let html = template.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);

  const metadata = [
    ["name", "description", page.description],
    ["name", "keywords", page.keywords],
    ["property", "og:title", page.title],
    ["property", "og:description", page.description],
    ["property", "og:url", page.canonicalUrl],
    ["property", "og:image", page.image],
    ["property", "og:image:alt", page.imageAlt],
    ["name", "twitter:title", page.title],
    ["name", "twitter:description", page.description],
    ["name", "twitter:image", page.image],
    ["name", "twitter:image:alt", page.imageAlt],
  ];

  for (const [selector, key, value] of metadata) {
    const pattern = new RegExp(
      `(<meta\\s+${selector}=["']${key.replace(":", "\\:")}["'][^>]*?content=["'])[^"']*(["'][^>]*>)`,
      "i",
    );
    if (pattern.test(html)) {
      html = html.replace(pattern, `$1${escapeHtml(value)}$2`);
    } else {
      html = html.replace("</head>", `    <meta ${selector}="${key}" content="${escapeHtml(value)}" />\n  </head>`);
    }
  }

  html = html.replace(
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(page.canonicalUrl)}" />`,
  );

  return html;
}

for (const path of Object.keys(seo)) {
  if (path === "/") {
    await writeFile(resolve(outputDirectory, "index.html"), renderPage(path));
    continue;
  }

  const routeDirectory = resolve(outputDirectory, path.slice(1));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(resolve(routeDirectory, "index.html"), renderPage(path));
}

console.log(`Generated SEO HTML for ${Object.keys(seo).length} routes.`);
