import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

export const execFileP = promisify(execFile);

export const ROOT = process.cwd();
export const PAPERS_DIR = path.join(ROOT, "src/content/papers");
export const FIG_DIR = path.join(ROOT, "public/figures");
export const THUMB_DIR = path.join(ROOT, "public/thumbnails");
export const TMP_DIR = path.join(ROOT, ".ingest-tmp");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export async function ensureDirs() {
  for (const d of [PAPERS_DIR, FIG_DIR, THUMB_DIR, TMP_DIR]) {
    await mkdir(d, { recursive: true });
  }
}

async function curlText(url) {
  const { stdout } = await execFileP(
    "curl",
    ["-sSL", "-A", UA, "--max-time", "60", url],
    { maxBuffer: 64 * 1024 * 1024 }
  );
  return stdout;
}

async function curlBuffer(url) {
  const { stdout } = await execFileP(
    "curl",
    ["-sSL", "-A", UA, "--max-time", "90", url],
    { maxBuffer: 128 * 1024 * 1024, encoding: "buffer" }
  );
  return stdout;
}

export async function fetchText(url, { retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "text/html,*/*" },
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.text();
    } catch (err) {
      lastErr = err;
      await sleep(500 * (attempt + 1));
    }
  }
  // Fall back to curl, which copes with TLS setups undici rejects.
  try {
    return await curlText(url);
  } catch {
    throw lastErr;
  }
}

export async function fetchBuffer(url, { retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA },
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastErr = err;
      await sleep(500 * (attempt + 1));
    }
  }
  try {
    return await curlBuffer(url);
  } catch {
    throw lastErr;
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "img";
}

/** Write the cleaned body for a paper. */
export async function writePaper(slug, html) {
  await writeFile(path.join(PAPERS_DIR, `${slug}.html`), html, "utf8");
}

/**
 * Render the first page of a PDF to public/thumbnails/<slug>.png using the
 * macOS QuickLook tool. Returns true on success.
 */
export async function makeThumbnailFromPdf(slug, pdfBuffer) {
  const tmpPdf = path.join(TMP_DIR, `${slug}.pdf`);
  await writeFile(tmpPdf, pdfBuffer);
  const outDir = path.join(TMP_DIR, `${slug}-thumb`);
  await mkdir(outDir, { recursive: true });
  try {
    await execFileP("qlmanage", [
      "-t",
      "-s",
      "2600",
      "-o",
      outDir,
      tmpPdf,
    ]);
    const produced = path.join(outDir, `${slug}.pdf.png`);
    if (existsSync(produced)) {
      // Normalize to PNG at a high-resolution card width (crisp on retina).
      await execFileP("sips", [
        "-s",
        "format",
        "png",
        "-Z",
        "2200",
        produced,
        "--out",
        path.join(THUMB_DIR, `${slug}.png`),
      ]);
      return true;
    }
  } catch {
    /* fall through */
  } finally {
    await rm(outDir, { recursive: true, force: true });
    await rm(tmpPdf, { force: true });
  }
  return false;
}
