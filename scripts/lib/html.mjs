import * as cheerio from "cheerio";
import katex from "katex";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  FIG_DIR,
  fetchBuffer,
  sanitizeFilename,
} from "./util.mjs";

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function renderTex(tex, display) {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode: display,
      throwOnError: false,
      output: "html",
    });
  } catch {
    return escapeHtml(display ? `$$${tex}$$` : `$${tex}$`);
  }
}

// Convert MathJax-style delimiters in a blog's text into rendered KaTeX. Single
// "$" is only treated as math when the contents contain a TeX control character,
// so prices and prose are left alone.
function replaceMathInText(text) {
  let out = "";
  let i = 0;
  const n = text.length;
  let changed = false;
  while (i < n) {
    if (text.startsWith("$$", i)) {
      const j = text.indexOf("$$", i + 2);
      if (j > -1) {
        out += renderTex(text.slice(i + 2, j), true);
        i = j + 2;
        changed = true;
        continue;
      }
    }
    if (text.startsWith("\\[", i)) {
      const j = text.indexOf("\\]", i + 2);
      if (j > -1) {
        out += renderTex(text.slice(i + 2, j), true);
        i = j + 2;
        changed = true;
        continue;
      }
    }
    if (text.startsWith("\\(", i)) {
      const j = text.indexOf("\\)", i + 2);
      if (j > -1) {
        out += renderTex(text.slice(i + 2, j), false);
        i = j + 2;
        changed = true;
        continue;
      }
    }
    if (text[i] === "$") {
      const j = text.indexOf("$", i + 1);
      if (j > -1) {
        const inner = text.slice(i + 1, j);
        if (inner.length < 220 && /[\\^_{}]/.test(inner) && !/^\s|\s$/.test(inner)) {
          out += renderTex(inner, false);
          i = j + 1;
          changed = true;
          continue;
        }
      }
    }
    out += escapeHtml(text[i]);
    i++;
  }
  return changed ? out : null;
}

function renderMath($, root) {
  const skip = new Set(["code", "pre", "script", "style"]);
  root
    .find("*")
    .addBack()
    .contents()
    .each((_, node) => {
      if (node.type !== "text" || !node.data || !/[$\\]/.test(node.data)) return;
      for (let p = node.parent; p; p = p.parent) {
        if (p.type === "tag" && skip.has(p.name)) return;
      }
      const html = replaceMathInText(node.data);
      if (html !== null) $(node).replaceWith(html);
    });
}

/** arXiv / ar5iv MathML → KaTeX. React cannot render MathML in the HTML namespace. */
function convertMathMLToKatex($, root) {
  root.find("math").each((_, el) => {
    const $el = $(el);
    const tex =
      $el.find('annotation[encoding="application/x-tex"]').first().text().trim() ||
      ($el.attr("alttext") ?? "").trim();
    if (!tex) return;
    const display = $el.attr("display") === "block";
    $el.replaceWith(renderTex(tex, display));
  });
}

/** Pandoc / Jupyter HTML: <span class="math inline|display">…</span> */
function convertPandocMath($, root) {
  root.find("span.math").each((_, el) => {
    const $el = $(el);
    const tex = $el.text().trim();
    if (!tex) return;
    const display = $el.hasClass("display");
    $el.replaceWith(renderTex(tex, display));
  });
}

/**
 * Render all math in an already-ingested paper fragment to KaTeX HTML.
 * Safe to run repeatedly (idempotent on KaTeX output).
 */
export function postprocessMathInHtml(html) {
  const $ = cheerio.load(html, null, false);
  const root = $.root();
  convertMathMLToKatex($, root);
  convertPandocMath($, root);
  renderMath($, root);
  return root.html() ?? html;
}

const JUNK_SELECTORS = [
  "script",
  "style",
  "noscript",
  "nav",
  "header",
  "footer",
  "form",
  "iframe",
  "button",
  ".ltx_page_logo",
  ".ltx_page_footer",
  ".ar5iv-footer",
  ".ltx_authors",
  ".ltx_dates",
  ".ltx_role_institute",
  "#disqus_thread",
  "#comments",
  ".comments",
  ".post-meta",
  ".sharing",
  ".share",
  ".related",
  ".site-header",
  ".site-footer",
  ".navigation",
  ".sidebar",
];

function pickContainer($, mode, selectors) {
  if (mode === "arxiv") {
    const c = $("article.ltx_document").first();
    if (c.length) return c;
    const c2 = $(".ltx_page_content").first();
    if (c2.length) return c2;
  }
  for (const sel of selectors ?? []) {
    const el = $(sel).first();
    if (el.length && el.text().trim().length > 400) return el;
  }
  return $("body").first();
}

async function downloadImage(absUrl, slug, cache) {
  if (cache.has(absUrl)) return cache.get(absUrl);
  try {
    const buf = await fetchBuffer(absUrl, { retries: 1 });
    let base = sanitizeFilename(decodeURIComponent(absUrl.split("/").pop().split("?")[0]));
    if (!/\.(png|jpg|jpeg|gif|svg|webp)$/i.test(base)) base += ".png";
    const dir = path.join(FIG_DIR, slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, base), buf);
    const local = `/figures/${slug}/${base}`;
    cache.set(absUrl, local);
    return local;
  } catch {
    cache.set(absUrl, null);
    return null;
  }
}

/**
 * Clean a fetched HTML page and localise its images.
 * @returns {Promise<{ html: string, images: number }>}
 */
export async function cleanAndLocalize(rawHtml, { slug, baseUrl, mode, selectors }) {
  const $ = cheerio.load(rawHtml);
  const container = pickContainer($, mode, selectors);

  // Drop the ar5iv-rendered document title so it does not duplicate our header.
  if (mode === "arxiv") {
    container.find("h1.ltx_title_document").remove();
  }

  $(JUNK_SELECTORS.join(","), container).remove();
  $("[role=navigation]", container).remove();

  // Strip inline styles (keep math/svg intact) so nothing fights the theme.
  container.find("[style]").each((_, el) => {
    const name = el.tagName?.toLowerCase();
    if (name !== "math" && name !== "svg") $(el).removeAttr("style");
  });

  // Localise images.
  const cache = new Map();
  let imageCount = 0;
  const imgs = container.find("img").toArray();
  for (const el of imgs) {
    const $el = $(el);
    $el.removeAttr("srcset");
    $el.removeAttr("loading");
    const src = $el.attr("src");
    if (!src || src.startsWith("data:")) continue;
    let absUrl;
    try {
      absUrl = new URL(src, baseUrl).href;
    } catch {
      continue;
    }
    const local = await downloadImage(absUrl, slug, cache);
    if (local) {
      $el.attr("src", local);
      imageCount++;
    } else {
      $el.remove();
    }
  }

  // Absolutise anchors; open external links in a new tab.
  container.find("a[href]").each((_, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    if (!href || href.startsWith("#")) return;
    try {
      const abs = new URL(href, baseUrl).href;
      $el.attr("href", abs);
      $el.attr("target", "_blank");
      $el.attr("rel", "noopener noreferrer");
    } catch {
      /* leave as-is */
    }
  });

  // MathML and raw LaTeX do not survive React's HTML parser with correct layout.
  // Render everything to KaTeX so subscripts, superscripts, and display math read
  // correctly in every browser.
  convertMathMLToKatex($, container);
  convertPandocMath($, container);
  if (mode !== "arxiv") renderMath($, container);

  return { html: (container.html() ?? "").trim(), images: imageCount };
}
