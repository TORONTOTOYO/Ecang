import { test } from "node:test";
import { strict as assert } from "node:assert";
import { createServer } from "vite";
import { normalize } from "./contentUtils.js";
import { DEFAULT_SECTION_ORDER, normalizeSectionOrder } from "./sections.js";

test("keeps saved ordering while restoring missing, duplicate, or unknown sections", () => {
  assert.deepEqual(normalize({}).sectionOrder, DEFAULT_SECTION_ORDER);
  const saved = ["work", "about", "work", "obsolete"];
  const expected = ["work", "about", "home", "offCamera", "certifications", "contact"];
  assert.deepEqual(normalize({ sectionOrder: saved }).sectionOrder, expected);
  assert.deepEqual(normalizeSectionOrder(null), DEFAULT_SECTION_ORDER);
  assert.deepEqual(normalize(JSON.parse(JSON.stringify({ sectionOrder: expected }))).sectionOrder, expected);
});

test("renders enabled sections and navigation in the saved order", async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { renderPage } = await vite.ssrLoadModule("/src/entry-server.jsx");
    const content = normalize({
      sectionOrder: ["work", "about", "home", "contact"],
      sections: { home: true, about: true, work: true, contact: true, offCamera: false, certifications: false },
    });
    const { html } = renderPage(content, "home");
    const main = html.slice(html.indexOf("<main>"), html.indexOf("</main>"));
    assert.ok(main.indexOf('id="work"') < main.indexOf('id="about"'));
    assert.ok(main.indexOf('id="about"') < main.indexOf('id="home"'));
    assert.ok(main.indexOf('id="home"') < main.indexOf('id="contact"'));
    assert.ok(!main.includes('id="certifications"'));
    const header = html.slice(html.indexOf("<header"), html.indexOf("</header>"));
    const nav = header.slice(header.indexOf("<ul"), header.indexOf("</ul>"));
    assert.ok(nav.indexOf('href="#work"') < nav.indexOf('href="#about"'));
    assert.ok(nav.indexOf('href="#about"') < nav.indexOf('href="#home"'));
    assert.ok(header.includes("nav-in-flow"));
  } finally {
    await vite.close();
  }
});
