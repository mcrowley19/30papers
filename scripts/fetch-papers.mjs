#!/usr/bin/env node
// Ingestion pipeline. Pulls each paper's full text into src/content/papers/<slug>.html,
// self-hosts its images under public/figures/<slug>/, and renders a first-page
// thumbnail into public/thumbnails/<slug>.png where a PDF is available.
//
// Usage:
//   node scripts/fetch-papers.mjs                 # all papers, skip existing
//   node scripts/fetch-papers.mjs --force         # re-ingest everything
//   node scripts/fetch-papers.mjs --only=gpipe    # one paper (repeatable)
//   node scripts/fetch-papers.mjs --no-thumbs     # skip thumbnail generation

import { existsSync } from "node:fs";
import path from "node:path";
import {
  sources,
  arxivHtmlUrl,
  arxivHtmlFallbackUrl,
  arxivPdfUrl,
} from "./lib/manifest.mjs";
import {
  ensureDirs,
  fetchText,
  fetchBuffer,
  writePaper,
  makeThumbnailFromPdf,
  sleep,
  PAPERS_DIR,
} from "./lib/util.mjs";
import { cleanAndLocalize } from "./lib/html.mjs";
import { pdfToHtml } from "./lib/pdf.mjs";

const args = process.argv.slice(2);
const force = args.includes("--force");
const noThumbs = args.includes("--no-thumbs");
const thumbsOnly = args.includes("--thumbs-only");
const onlySlugs = args
  .filter((a) => a.startsWith("--only="))
  .map((a) => a.slice("--only=".length));

const selected = onlySlugs.length
  ? sources.filter((s) => onlySlugs.includes(s.slug))
  : sources;

async function ingestArxiv(src) {
  const urls = [
    arxivHtmlUrl(src.arxivId) + "/",
    arxivHtmlFallbackUrl(src.arxivId) + "/",
  ];
  let raw, baseUrl;
  for (const u of urls) {
    try {
      raw = await fetchText(u, { retries: 2 });
      baseUrl = u;
      break;
    } catch {
      /* try next */
    }
  }
  let html = "";
  let images = 0;
  if (raw) {
    const cleaned = await cleanAndLocalize(raw, {
      slug: src.slug,
      baseUrl,
      mode: "arxiv",
    });
    html = cleaned.html;
    images = cleaned.images;
  }

  // Some papers have no HTML edition (ar5iv conversion failed and arxiv has no
  // native HTML). Fall back to extracting the PDF text.
  let viaPdf = false;
  let pdfBuf = null;
  if (html.length < 800) {
    pdfBuf = await fetchBuffer(arxivPdfUrl(src.arxivId), { retries: 2 });
    const extracted = await pdfToHtml(pdfBuf);
    html = extracted.html;
    images = 0;
    viaPdf = true;
  }
  if (html.length < 800) throw new Error("extracted body too small");
  await writePaper(src.slug, html);

  let thumb = false;
  if (!noThumbs) {
    try {
      const pdf = pdfBuf ?? (await fetchBuffer(arxivPdfUrl(src.arxivId), { retries: 1 }));
      thumb = await makeThumbnailFromPdf(src.slug, pdf);
    } catch {
      /* no thumb */
    }
  }
  return { images, thumb, chars: html.length, viaPdf };
}

async function ingestHtml(src) {
  const raw = await fetchText(src.pageUrl, { retries: 2 });
  const { html, images } = await cleanAndLocalize(raw, {
    slug: src.slug,
    baseUrl: src.pageUrl,
    mode: "html",
    selectors: src.selectors,
  });
  if (html.length < 800) throw new Error("extracted body too small");
  await writePaper(src.slug, html);
  return { images, thumb: false, chars: html.length };
}

async function ingestPdf(src) {
  const buf = await fetchBuffer(src.pdfUrl, { retries: 2 });
  const { html, paragraphs } = await pdfToHtml(buf);
  if (html.length < 800) throw new Error("extracted text too small");
  await writePaper(src.slug, html);
  let thumb = false;
  if (!noThumbs) thumb = await makeThumbnailFromPdf(src.slug, buf);
  return { images: 0, thumb, chars: html.length, paragraphs };
}

// Regenerate just the first-page thumbnail for a paper from its PDF, without
// touching the already-ingested text. Blogs/notes have no PDF, so they keep the
// text fallback on the card.
async function regenerateThumb(src) {
  const pdfUrl =
    src.kind === "arxiv" ? arxivPdfUrl(src.arxivId) : src.pdfUrl;
  if (!pdfUrl) return { status: "skip", note: "no pdf source" };
  const buf = await fetchBuffer(pdfUrl, { retries: 2 });
  const thumb = await makeThumbnailFromPdf(src.slug, buf);
  return { status: thumb ? "ok" : "FAIL", thumb };
}

async function run() {
  await ensureDirs();
  const results = [];

  if (thumbsOnly) {
    for (const src of selected) {
      process.stdout.write(`- ${src.slug} thumbnail ... `);
      try {
        const r = await regenerateThumb(src);
        results.push({ slug: src.slug, ...r });
        console.log(r.status === "ok" ? "ok" : r.note || "no thumb");
      } catch (err) {
        results.push({ slug: src.slug, status: "FAIL", error: String(err.message || err) });
        console.log(`FAIL: ${err.message || err}`);
      }
      await sleep(300);
    }
    const made = results.filter((r) => r.status === "ok").length;
    console.log(`\nRegenerated ${made} thumbnails.`);
    return;
  }

  for (const src of selected) {
    if (src.risk === "review") {
      process.stdout.write(`- ${src.slug} [${src.kind}] (copyrighted, skipping text) ... `);
      try {
        let thumb = false;
        if (!noThumbs) {
          const pdfUrl = src.kind === "arxiv" ? arxivPdfUrl(src.arxivId) : src.pdfUrl;
          if (pdfUrl) {
            const buf = await fetchBuffer(pdfUrl, { retries: 2 });
            thumb = await makeThumbnailFromPdf(src.slug, buf);
          }
        }
        results.push({ slug: src.slug, status: "ok", images: 0, thumb, chars: 0 });
        console.log(`ok (skipped text${thumb ? ", generated thumb" : ""})`);
      } catch (err) {
        results.push({ slug: src.slug, status: "FAIL", error: String(err.message || err) });
        console.log(`FAIL: ${err.message || err}`);
      }
      await sleep(400);
      continue;
    }

    const outPath = path.join(PAPERS_DIR, `${src.slug}.html`);
    if (!force && existsSync(outPath)) {
      results.push({ slug: src.slug, status: "skip (exists)" });
      console.log(`- ${src.slug}: skipped (already present)`);
      continue;
    }
    process.stdout.write(`- ${src.slug} [${src.kind}] ... `);
    try {
      let r;
      if (src.kind === "arxiv") r = await ingestArxiv(src);
      else if (src.kind === "pdf") r = await ingestPdf(src);
      else r = await ingestHtml(src);
      results.push({ slug: src.slug, status: "ok", ...r });
      console.log(
        `ok (${r.chars} chars, ${r.images} imgs${r.thumb ? ", thumb" : ""})`
      );
    } catch (err) {
      results.push({ slug: src.slug, status: "FAIL", error: String(err.message || err) });
      console.log(`FAIL: ${err.message || err}`);
    }
    await sleep(400);
  }

  console.log("\n==== Ingestion summary ====");
  const ok = results.filter((r) => r.status === "ok");
  const failed = results.filter((r) => r.status === "FAIL");
  const skipped = results.filter((r) => r.status.startsWith("skip"));
  console.log(`ok: ${ok.length}  skipped: ${skipped.length}  failed: ${failed.length}`);
  if (failed.length) {
    console.log("\nFailed:");
    for (const f of failed) console.log(`  ${f.slug}: ${f.error}`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
