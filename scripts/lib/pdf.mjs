// Best-effort PDF to readable HTML. Extracts text with pdfjs, detects a two
// column gutter, recovers lines and reading order, joins lines into paragraphs
// (with dehyphenation), and inserts missing word spaces. Math and complex layout
// will not survive perfectly; this is a fallback for PDF-only papers.

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Build one line's text, inserting a space wherever the horizontal gap between
// successive glyph runs looks like a word break.
function buildLineText(parts) {
  parts.sort((a, b) => a.x - b.x);
  let text = "";
  let prevEnd = null;
  for (const p of parts) {
    if (prevEnd !== null) {
      const gap = p.x - prevEnd;
      // A gap wider than ~a fifth of the text height is a word space. Old PDFs
      // kern tightly, so this threshold is deliberately small.
      if (gap > p.h * 0.2 && !text.endsWith(" ") && !p.str.startsWith(" ")) {
        text += " ";
      }
    }
    text += p.str;
    prevEnd = p.x + p.w;
  }
  return text.replace(/\s+/g, " ").trim();
}

function itemsToLines(items) {
  const lines = [];
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  let current = null;
  for (const it of sorted) {
    if (!current || Math.abs(current.y - it.y) > Math.max(2, it.h * 0.6)) {
      current = { y: it.y, x: it.x, h: it.h, parts: [it] };
      lines.push(current);
    } else {
      current.parts.push(it);
      current.x = Math.min(current.x, it.x);
    }
  }
  for (const line of lines) {
    line.text = buildLineText(line.parts);
  }
  return lines.filter((l) => l.text.length > 0);
}

// Decide whether a page is two columns by looking for a consistent wide gap
// near the centre of its full-width lines. Single-column text has no such gap,
// so centred titles in single-column papers are never sliced. Returns the
// gutter x, or null for a single-column page.
function detect2ColGutter(lines, pageWidth) {
  const cands = [];
  for (const line of lines) {
    const parts = line.parts;
    if (!parts || parts.length < 4) continue;
    let maxGap = 0;
    let gapMid = 0;
    let prevEnd = parts[0].x + parts[0].w;
    for (let i = 1; i < parts.length; i++) {
      const gap = parts[i].x - prevEnd;
      if (gap > maxGap) {
        maxGap = gap;
        gapMid = (prevEnd + parts[i].x) / 2;
      }
      prevEnd = Math.max(prevEnd, parts[i].x + parts[i].w);
    }
    if (maxGap > pageWidth * 0.06 && gapMid > pageWidth * 0.3 && gapMid < pageWidth * 0.7) {
      cands.push(gapMid);
    }
  }
  if (cands.length >= 6 && cands.length >= lines.length * 0.4) {
    cands.sort((a, b) => a - b);
    return cands[Math.floor(cands.length / 2)];
  }
  return null;
}

// Classify a line as a section heading and return its tag, or null. Numbered
// section lines ("1 Introduction", "3.2 Method"), the usual named sections, and
// short lines set noticeably larger than the body are treated as headings.
function headingTag(text, h, medianH) {
  const t = text.trim();
  if (t.length === 0 || t.length > 90) return null;
  const num = t.match(/^(\d+(?:\.\d+)*)\.?\s+\p{Lu}[\p{L}\s\-:,'&]+$/u);
  if (num) return num[1].includes(".") ? "h3" : "h2";
  if (/^(chapter|appendix|section)\s+[\dA-Za-z]/i.test(t)) return "h2";
  if (
    /^(abstract|introduction|conclusions?|references|acknowledge?ments?|related work|discussion|background|methods?|experiments?|results?|preliminaries)\b/i.test(t) &&
    t.length < 60
  ) {
    return "h2";
  }
  if (h > medianH * 1.18 && t.length < 55 && /^[\p{Lu}\p{N}]/u.test(t) && !/[.;:]$/.test(t)) {
    return "h3";
  }
  return null;
}

function linesToBlocks(lines) {
  if (!lines.length) return [];
  const body = lines.filter((l) => !/^\d{1,4}$/.test(l.text)); // drop page numbers
  if (!body.length) return [];

  const gaps = [];
  for (let i = 1; i < body.length; i++) gaps.push(body[i - 1].y - body[i].y);
  const sortedGaps = gaps.filter((g) => g > 0).sort((a, b) => a - b);
  const median = sortedGaps[Math.floor(sortedGaps.length / 2)] || 12;
  const heights = body.map((l) => l.h).sort((a, b) => a - b);
  const medianH = heights[Math.floor(heights.length / 2)] || 10;
  // Use the median line start, not the minimum: a rotated arXiv watermark in the
  // left margin would otherwise make every real line look "indented" and break
  // each one into its own paragraph.
  const xs = body.map((l) => l.x).sort((a, b) => a - b);
  const leftMargin = xs[Math.floor(xs.length / 2)];

  const blocks = [];
  let buf = [];
  const flush = () => {
    if (!buf.length) return;
    let text = "";
    for (const t of buf) {
      if (text.endsWith("-")) text = text.slice(0, -1) + t; // dehyphenate
      else text = text ? text + " " + t : t;
    }
    text = text.replace(/\s+/g, " ").trim();
    if (text.length > 1) blocks.push({ tag: "p", text });
    buf = [];
  };

  for (let i = 0; i < body.length; i++) {
    const line = body[i];
    const tag = headingTag(line.text, line.h, medianH);
    if (tag) {
      flush();
      blocks.push({ tag, text: line.text.trim() });
      continue;
    }
    const prev = body[i - 1];
    const gap = i === 0 ? 0 : prev.y - line.y;
    // A first-line indent starts a paragraph only when the previous line sat at
    // the margin. Lines inside a wholly-indented block (e.g. a centred abstract)
    // are not each treated as new paragraphs.
    const indented =
      i > 0 &&
      line.x > leftMargin + line.h * 0.9 &&
      prev.x <= leftMargin + line.h * 0.9;
    if (i > 0 && (gap > median * 1.6 || indented)) flush();
    buf.push(line.text);
  }
  flush();
  return blocks;
}

export async function pdfToHtml(buffer) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;

  const allBlocks = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const items = content.items
      .filter((it) => typeof it.str === "string" && it.str.trim() !== "")
      .map((it) => ({
        str: it.str,
        x: it.transform[4],
        y: it.transform[5],
        w: it.width,
        h: Math.abs(it.transform[3]) || it.height || 10,
      }));
    if (!items.length) continue;
    const lines = itemsToLines(items);
    const gutter = detect2ColGutter(lines, viewport.width);
    if (gutter == null) {
      allBlocks.push(...linesToBlocks(lines));
    } else {
      const left = items.filter((it) => it.x + it.w / 2 < gutter);
      const right = items.filter((it) => it.x + it.w / 2 >= gutter);
      allBlocks.push(...linesToBlocks(itemsToLines(left)));
      allBlocks.push(...linesToBlocks(itemsToLines(right)));
    }
  }

  const html = allBlocks
    .map((b) =>
      b.tag === "p"
        ? `<p>${escapeHtml(b.text)}</p>`
        : `<${b.tag}>${escapeHtml(b.text)}</${b.tag}>`
    )
    .join("\n");
  return { html, pages: doc.numPages, paragraphs: allBlocks.length };
}
