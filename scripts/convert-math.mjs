#!/usr/bin/env node
// Re-render math in already-ingested paper HTML as KaTeX. Run after updating
// the ingestion math pipeline, or to fix papers ingested before MathML → KaTeX.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postprocessMathInHtml } from "./lib/html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const papersDir = path.join(__dirname, "..", "src", "content", "papers");

const only = process.argv
  .filter((a) => a.startsWith("--only="))
  .map((a) => a.slice("--only=".length));

let changed = 0;
for (const file of readdirSync(papersDir).filter((f) => f.endsWith(".html"))) {
  const slug = file.replace(/\.html$/, "");
  if (only.length && !only.includes(slug)) continue;

  const filePath = path.join(papersDir, file);
  const before = readFileSync(filePath, "utf8");
  const after = postprocessMathInHtml(before);
  if (after !== before) {
    writeFileSync(filePath, after);
    changed++;
    console.log(`updated ${slug}`);
  } else {
    console.log(`unchanged ${slug}`);
  }
}

console.log(`\nDone. ${changed} file(s) updated.`);
