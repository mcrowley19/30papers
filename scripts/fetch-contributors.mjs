// Fetch contributor portraits from Wikipedia into public/contributors/.
// Names come from src/data/contributors.ts (PORTRAIT_NAMES); people without a
// Wikipedia portrait are skipped and fall back to initials on the site.
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "contributors");
await mkdir(outDir, { recursive: true });

// Parse names straight from the data file (Node can't import .ts directly).
const { readFile } = await import("node:fs/promises");
const src = await readFile(path.join(root, "src", "data", "contributors.ts"), "utf8");
const allNames = [...new Set([...src.matchAll(/"([A-Z][^"]+ [^"]+)"/g)].map((m) => m[1]))];
// Names in the AMBIGUOUS_ON_WIKIPEDIA set share a Wikipedia title with a
// different, more famous person. For those, skip Wikipedia title lookup and
// rely only on the description-verified Wikidata search.
const ambiguousBlock = src.match(/AMBIGUOUS_ON_WIKIPEDIA = new Set\(\[([^\]]*)\]\)/)?.[1] ?? "";
const ambiguous = new Set([...ambiguousBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]));
const slugify = (n) =>
  n
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]+/g, "-")
    .replace(/^-|-$/g, "");

// Wikipedia titles that differ from the person's name in our data.
const TITLE_OVERRIDES = {
  "Alex Graves": "Alex Graves (computer scientist)",
  "Jian Sun": "Jian Sun (computer scientist)",
  "Peter Grunwald": "Peter Grünwald",
  "Diederik P. Kingma": "Diederik P. Kingma",
};

const UA = "30papers-site/1.0 (contributor portrait fetch)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Only accept a Wikidata match whose description clearly marks the person as
// a researcher in our field; otherwise a same-named athlete or politician
// could slip through.
const RESEARCHER = /computer scient|machine learning|artificial intelligence|\bAI\b|deep learning|neural|research|informatic/i;

async function fetchFromWikidata(name) {
  let search;
  for (let i = 0; ; i++) {
    search = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&limit=5&search=${encodeURIComponent(name)}`,
      { headers: { "User-Agent": UA } }
    );
    if (search.status !== 429 || i >= 4) break;
    const wait = Number(search.headers.get("retry-after")) * 1000 || 20000;
    console.log(`    (rate limited, waiting ${Math.round(wait / 1000)}s)`);
    await sleep(wait);
  }
  if (!search.ok) throw new Error(`wikidata search HTTP ${search.status}`);
  const hits = (await search.json()).search ?? [];
  const hit = hits.find((h) => RESEARCHER.test(h.description ?? ""));
  if (!hit) return null;
  const ent = await fetch(
    `https://www.wikidata.org/wiki/Special:EntityData/${hit.id}.json`,
    { headers: { "User-Agent": UA } }
  );
  if (!ent.ok) throw new Error(`wikidata entity HTTP ${ent.status}`);
  const claims = (await ent.json()).entities?.[hit.id]?.claims;
  const file = claims?.P18?.[0]?.mainsnak?.datavalue?.value;
  if (!file) return null;
  const img = await fetch(
    `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=330`,
    { headers: { "User-Agent": UA } }
  );
  if (!img.ok) throw new Error(`commons image HTTP ${img.status}`);
  console.log(`    (wikidata ${hit.id}: ${hit.description})`);
  return Buffer.from(await img.arrayBuffer());
}

async function fetchPortrait(name) {
  const title = TITLE_OVERRIDES[name] ?? name;
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { headers: { "User-Agent": UA } }
  );
  if (!res.ok) throw new Error(`summary HTTP ${res.status}`);
  const data = await res.json();
  const url = data?.thumbnail?.source;
  if (!url || data.type === "disambiguation") return null;
  const img = await fetch(url, { headers: { "User-Agent": UA } });
  if (!img.ok) throw new Error(`image HTTP ${img.status}`);
  return Buffer.from(await img.arrayBuffer());
}

const { existsSync } = await import("node:fs");
for (const name of allNames) {
  const dest = path.join(outDir, `${slugify(name)}.jpg`);
  if (existsSync(dest)) {
    console.log(`  = already have ${name}`);
    continue;
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      let buf = null;
      if (!ambiguous.has(name)) {
        try {
          buf = await fetchPortrait(name);
        } catch {
          // Wikipedia page missing or throttled; Wikidata below may still hit.
        }
      }
      if (!buf) buf = await fetchFromWikidata(name);
      if (!buf) {
        console.log(`  – no portrait found: ${name}`);
      } else {
        await writeFile(dest, buf);
        console.log(`  ✓ ${name}`);
      }
      break;
    } catch (err) {
      console.log(`  ✗ ${name} (attempt ${attempt}): ${err.message}`);
      await sleep(1500 * attempt);
    }
  }
  await sleep(2500);
}
