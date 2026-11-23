import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createServer, loadEnv } from "vite";
import { defaultContent } from "../src/content/defaultContent.js";
import { normalize } from "../src/content/contentUtils.js";

const root = process.cwd();
const dist = resolve(root, "dist");
const env = loadEnv("production", root, "");

function decodeValue(value = {}) {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue.fields);
  return null;
}

function decodeFields(fields = {}) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}

async function loadContent() {
  const { VITE_FIREBASE_API_KEY: apiKey, VITE_FIREBASE_PROJECT_ID: projectId } = env;
  if (!apiKey || !projectId) return normalize(defaultContent);

  try {
    const url = new URL(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/content/site`);
    url.searchParams.set("key", apiKey);
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return normalize(defaultContent);
    const document = await response.json();
    return normalize(decodeFields(document.fields));
  } catch {
    console.warn("Prerender could not fetch public Firestore content; using default content.");
    return normalize(defaultContent);
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function createDocument(template, rendered, content, page) {
  const title = page === "cv"
    ? `${content.profile.name} | ${content.cv.headline}`
    : `${content.profile.name} | ${content.profile.role}`;
  const description = page === "cv"
    ? content.cv.summary || content.profile.intro
    : content.profile.intro;
  const json = JSON.stringify({ content, page, mode: rendered.mode }).replace(/</g, "\\u003c");
  const markup = template
    .replace("<title>Erica | Actress and Film Portfolio</title>", `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace('<div id="root"></div>', `<div id="root">${rendered.html}</div><script id="prerender-data" type="application/json">${json}</script>`);

  if (!markup.includes("id=\"prerender-data\"")) {
    throw new Error("Could not inject prerendered markup into dist/index.html.");
  }
  return markup;
}

const content = await loadContent();
const vite = await createServer({
  mode: "production",
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { renderPage } = await vite.ssrLoadModule("/src/entry-server.jsx");
  const template = await readFile(resolve(dist, "index.html"), "utf8");
  for (const page of ["home", "cv"]) {
    const rendered = renderPage(content, page);
    const html = createDocument(template, rendered, content, page);
    const output = page === "home" ? resolve(dist, "index.html") : resolve(dist, "cv", "index.html");
    await mkdir(resolve(dist, page === "home" ? "" : "cv"), { recursive: true });
    await writeFile(output, html);
    console.log(`Prerendered /${page === "home" ? "" : "cv/"}`);
  }
} finally {
  await vite.close();
}