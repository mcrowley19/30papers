// Best-effort PDF to readable HTML. Extracts text with pdfjs, detects a two
// column gutter, recovers lines and reading order, joins lines into paragraphs
// (with dehyphenation), strips running headers/footers and page numbers, and
// inserts missing word spaces. Math and complex layout will not survive
// perfectly; this is a fallback for PDF-only papers.

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
  if (num && t.length >= 6) return num[1].includes(".") ? "h3" : "h2";
  // "Chapter 3" / "Appendix A" — set larger than the body, so a body line that
  // merely opens with the word (or a wrapped TOC fragment) doesn't qualify.
  if (
    /^(chapter|appendix|section)\s+[\dA-Za-z]/i.test(t) &&
    t.length < 60 &&
    h > medianH * 1.15 &&
    !/[.!?]\s/.test(t) &&
    !/[.!?]$/.test(t)
  ) {
    return "h2";
  }
  // The usual named sections, only when the line is exactly the section word:
  // a paragraph's final word wrapped onto its own line ("experiments.") or a
  // sentence opening with one ("Results with tractable...") is body text.
  if (
    /^(abstract|introduction|conclusions?|references|acknowledge?ments?|related work|discussion|background|methods?|experiments?|results?|preliminaries|appendix|bibliography|preface|contents)$/i.test(t.replace(/:$/, "")) &&
    /^\p{Lu}/u.test(t)
  ) {
    return "h2";
  }
  // Display equations also come out as short lines with tall glyphs, so the
  // large-type rule refuses anything that looks like mathematics.
  if (
    h > medianH * 1.18 &&
    t.length < 55 &&
    /^[\p{Lu}\p{N}]/u.test(t) &&
    !/[.;:,]$/.test(t) &&
    !/[=+→←≤≥∑∏∫√−±·|]|\p{Script=Greek}/u.test(t)
  ) {
    return "h3";
  }
  return null;
}

function linesToBlocks(lines) {
  if (!lines.length) return [];
  const body = lines;

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

  let lastHeading = null;
  for (let i = 0; i < body.length; i++) {
    const line = body[i];
    // A display-size title wrapped onto a second line ("1. Nature and
    // Measurement of" / "Intelligence") continues the heading, not the body.
    if (
      lastHeading &&
      line.h > medianH * 1.15 &&
      Math.abs(line.h - lastHeading.h) < lastHeading.h * 0.15 &&
      lastHeading.y - line.y < lastHeading.h * 1.8
    ) {
      lastHeading.block.text += ` ${line.text.trim()}`;
      lastHeading.y = line.y;
      continue;
    }
    lastHeading = null;
    const tag = headingTag(line.text, line.h, medianH);
    if (tag) {
      flush();
      const block = { tag, text: line.text.trim() };
      blocks.push(block);
      lastHeading = { block, h: line.h, y: line.y };
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
    // Styles like ICLR's separate paragraphs with extra leading rather than an
    // indent; the gap they use can be as little as ~1.4x the line spacing, so
    // the threshold sits below that.
    if (i > 0 && (gap > median * 1.35 || indented)) flush();
    buf.push(line.text);
  }
  flush();
  return blocks;
}

// Fraction of the page height treated as the header/footer band.
const EDGE_BAND = 0.1;

const isPageNumberText = (t) =>
  /^\d{1,4}$/.test(t) || /^[ivxlcdm]{1,8}$/i.test(t);

// Normalise a line for repeated header/footer matching: digits collapse so
// "Chapter 3" on one page matches "Chapter 4" on the next.
const headerKey = (t) => t.toLowerCase().replace(/\d+/g, "#").replace(/\s+/g, " ").trim();

// Running headers and footers repeat at the same spot of the page across
// several pages ("Published as a conference paper at ICLR 2017", "PREFACE",
// page numbers). A book's headers change with each chapter, so three pages at
// the same position is already conclusive; body text never repeats like that.
function stripFurniture(pages) {
  const yBucket = (y) => Math.round(y / 4);
  const furnitureKey = (line) => `${headerKey(line.text)}@${yBucket(line.y)}`;
  const pagesPerKey = new Map();
  const pagesPerRow = new Map();
  for (const page of pages) {
    const seen = new Set();
    for (const line of page.lines) {
      if (!inEdgeBand(line, page)) continue;
      for (const key of [furnitureKey(line), `row@${yBucket(line.y)}`]) {
        if (seen.has(key)) continue;
        seen.add(key);
        const map = key.startsWith("row@") ? pagesPerRow : pagesPerKey;
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    }
  }
  // A row occupied on most pages is a header/footer slot even when its text
  // changes with each section — as long as the line sits clear of the body,
  // so the first body line of a consistently-set page is never mistaken.
  const minRowPages = Math.ceil(pages.length * 0.5);
  for (const page of pages) {
    const gaps = [];
    for (let i = 1; i < page.lines.length; i++) {
      gaps.push(page.lines[i - 1].y - page.lines[i].y);
    }
    const pos = gaps.filter((g) => g > 0).sort((a, b) => a - b);
    const medianGap = pos[Math.floor(pos.length / 2)] || 12;
    const detached = (i) => {
      const line = page.lines[i];
      const inward =
        line.y > page.height / 2 ? page.lines[i + 1] : page.lines[i - 1];
      return !inward || Math.abs(line.y - inward.y) > medianGap * 1.7;
    };
    page.lines = page.lines.filter((line, i) => {
      if (!inEdgeBand(line, page)) return true;
      if (isPageNumberText(line.text)) return false;
      if ((pagesPerKey.get(furnitureKey(line)) ?? 0) >= 3) return false;
      return (pagesPerRow.get(`row@${yBucket(line.y)}`) ?? 0) < minRowPages || !detached(i);
    });
  }
}

function inEdgeBand(line, page) {
  return line.y > page.height * (1 - EDGE_BAND) || line.y < page.height * EDGE_BAND;
}

// A paragraph interrupted by a page break carries straight on: the last block
// of a page merges into the next page's first block when it clearly ends
// mid-sentence.
function endsOpen(text) {
  return !/[.!?:;'"’”)\]]$/.test(text);
}

export async function pdfToHtml(buffer) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;

  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const items = content.items
      .filter((it) => typeof it.str === "string" && it.str.trim() !== "")
      // Rotated text is marginalia (the arXiv sidebar stamp), never body text;
      // left in, it splices into whichever body line shares its y.
      .filter((it) => Math.abs(it.transform[1]) < 0.5 && Math.abs(it.transform[2]) < 0.5)
      .map((it) => ({
        str: it.str,
        x: it.transform[4],
        y: it.transform[5],
        w: it.width,
        h: Math.abs(it.transform[3]) || it.height || 10,
      }));
    if (!items.length) continue;
    pages.push({
      lines: itemsToLines(items),
      width: viewport.width,
      height: viewport.height,
    });
  }

  stripFurniture(pages);

  const allBlocks = [];
  for (const page of pages) {
    if (!page.lines.length) continue;
    const gutter = detect2ColGutter(page.lines, page.width);
    let pageBlocks;
    if (gutter == null) {
      pageBlocks = linesToBlocks(page.lines);
    } else {
      const items = page.lines.flatMap((l) => l.parts);
      const left = items.filter((it) => it.x + it.w / 2 < gutter);
      const right = items.filter((it) => it.x + it.w / 2 >= gutter);
      pageBlocks = [
        ...linesToBlocks(itemsToLines(left)),
        ...linesToBlocks(itemsToLines(right)),
      ];
    }
    const prev = allBlocks[allBlocks.length - 1];
    const first = pageBlocks[0];
    if (prev?.tag === "p" && first?.tag === "p" && endsOpen(prev.text)) {
      if (prev.text.endsWith("-")) prev.text = prev.text.slice(0, -1) + first.text;
      else prev.text += " " + first.text;
      pageBlocks.shift();
    }
    allBlocks.push(...pageBlocks);
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
