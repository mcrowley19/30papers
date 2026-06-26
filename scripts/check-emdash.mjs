#!/usr/bin/env node
// Fails the build if an em-dash (or the horizontal-bar variant) appears in any
// site-authored copy: term definitions, blurbs, and metadata. The user asked
// for no em-dashes in the explanations; we enforce it across all hand-written
// content to be safe. Ingested paper bodies are excluded.

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const TARGETS = [
  path.join(ROOT, "src/data/papers.ts"),
  path.join(ROOT, "src/content/types.ts"),
];

const TERMS_DIR = path.join(ROOT, "src/content/terms");
const EM_DASH = /[—―]/; // — and ―

async function collectFiles() {
  const files = [...TARGETS];
  try {
    const entries = await readdir(TERMS_DIR);
    for (const e of entries) {
      if (e.endsWith(".ts")) files.push(path.join(TERMS_DIR, e));
    }
  } catch {
    /* no terms dir yet */
  }
  return files;
}

const files = await collectFiles();
let problems = 0;

for (const file of files) {
  let text;
  try {
    text = await readFile(file, "utf8");
  } catch {
    continue;
  }
  text.split("\n").forEach((line, i) => {
    if (EM_DASH.test(line)) {
      problems++;
      console.error(
        `${path.relative(ROOT, file)}:${i + 1}  em-dash found: ${line.trim()}`
      );
    }
  });
}

if (problems) {
  console.error(`\nFound ${problems} em-dash(es) in authored copy. Replace them.`);
  process.exit(1);
}
console.log("No em-dashes in authored copy.");
