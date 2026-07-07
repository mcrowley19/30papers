/**
 * Capture the TitleAscii canvas to WebP for mobile — pixel-identical to the
 * desktop halftone renderer at a fixed hero aspect ratio.
 *
 * Usage: node scripts/capture-wordmark.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public");
const baseUrl = process.argv[2] ?? "http://localhost:5176";

const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
// Home hero height at sm+: h-[58vh]
const HERO_HEIGHT = Math.round(DESKTOP_VIEWPORT.height * 0.58);

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: DESKTOP_VIEWPORT,
    deviceScaleFactor: 2,
  });

  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60_000 });

  const canvas = page.locator("header h1 canvas");
  await canvas.waitFor({ state: "visible", timeout: 30_000 });

  // Let fonts load and the halftone settle on a representative frame.
  await page.waitForFunction(
    () => {
      const c = document.querySelector("header h1 canvas");
      if (!c || !c.width) return false;
      const ctx = c.getContext("2d");
      if (!ctx) return false;
      const { data } = ctx.getImageData(0, 0, c.width, c.height);
      for (let i = 3; i < data.length; i += 64) if (data[i] > 20) return true;
      return false;
    },
    { timeout: 30_000 }
  );
  await page.waitForTimeout(500);

  const box = await canvas.boundingBox();
  if (!box) throw new Error("Canvas has no layout box");

  const mobilePath = path.join(outDir, "wordmark-mobile.png");
  await page.screenshot({
    path: mobilePath,
    type: "png",
    clip: {
      x: box.x,
      y: box.y,
      width: box.width,
      height: Math.min(box.height, HERO_HEIGHT),
    },
  });

  console.log(`Wrote ${mobilePath} (${Math.round(box.width)}×${Math.round(box.height)} css px @2x)`);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
