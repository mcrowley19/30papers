import FieldBackground, { type FieldEnv } from "./FieldBackground";
import { hash, clamp01 } from "../lib/ascii";

/**
 * The landing wordmark: "30 papers" rendered as the same animated glyph
 * halftone the paper backdrops use. The text is rasterized once per size into
 * an offscreen mask, then each grid cell inside the letterforms is drawn with
 * the shared density ramp, with a light sweep travelling across the word.
 */
const TEXT = "30 papers";

let maskKey = "";
let mask: Float32Array = new Float32Array(0);

function buildMask(cols: number, rows: number) {
  const key = `${cols}x${rows}:${document.fonts?.status ?? ""}`;
  if (key === maskKey) return;
  maskKey = key;
  mask = new Float32Array(cols * rows);

  // Supersample: rasterize at S px per grid cell, then average coverage per
  // cell, so the letterforms stay crisp on the coarse glyph grid.
  const S = 4;
  const off = document.createElement("canvas");
  off.width = cols * S;
  off.height = rows * S;
  const octx = off.getContext("2d");
  if (!octx) return;

  octx.textAlign = "center";
  octx.textBaseline = "middle";
  octx.fillStyle = "#fff";
  // A little tracking keeps neighbouring letters from fusing on the grid.
  octx.letterSpacing = `${S * 4}px`;
  // Largest size that fits the grid with a small margin.
  let size = Math.floor(rows * S * 0.8);
  do {
    octx.font = `700 ${size}px Geist, Inter, system-ui, sans-serif`;
    size -= S;
  } while (size > 4 && octx.measureText(TEXT).width > cols * S * 0.94);
  // Fill plus a stroke of the same colour fattens the strokes so letter faces
  // are several cells wide on the coarse glyph grid.
  octx.strokeStyle = "#fff";
  octx.lineWidth = S * 1.6;
  octx.fillText(TEXT, (cols * S) / 2, (rows * S) / 2);
  octx.strokeText(TEXT, (cols * S) / 2, (rows * S) / 2);

  const data = octx.getImageData(0, 0, cols * S, rows * S).data;
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      let sum = 0;
      for (let sy = 0; sy < S; sy++)
        for (let sx = 0; sx < S; sx++)
          sum += data[((cy * S + sy) * cols * S + cx * S + sx) * 4 + 3];
      mask[cy * cols + cx] = sum / (S * S * 255);
    }
  }
}

// Depth of the 3D extrusion, in grid cells (down-right diagonal).
const DEPTH = 4;

// Classic ASCII density ramp for the letter faces (instead of the dot ramp).
const CHARS = " .:-=+*#%@";

// Retro-dither palette on the paper-white ground: a periwinkle sky with warm
// gold clouds and sun rays, and the wordmark in deep cobalt with a gold
// extruded flank.
const SKY = "30,64,175";
const SKY_DEEP = "138,160,222";
const CLOUD = "205,152,68";
const COBALT = "16,31,92";
const GOLD = "205,152,68";

function drawTitle({ t, cols, rows, dot, ctx, cell }: FieldEnv) {
  buildMask(cols, rows);
  // No ground fill here: the landing page itself provides the deep cobalt
  // ground, so this canvas only paints the dither, rays, and wordmark.
  const at = (cx: number, cy: number) =>
    cx < 0 || cy < 0 || cx >= cols || cy >= rows ? 0 : mask[cy * cols + cx];
  const ccx = cols * 0.5;
  const ccy = rows * 0.55;

  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const v = at(cx, cy);
      const n = hash(cx * 1.7, cy * 2.3);

      // Letter face: a translucent solid cobalt fill under a near-solid glyph,
      // so the word reads as solid pixel-art shapes with dither texture.
      if (v >= 0.3) {
        const shimmer = 0.93 + 0.07 * Math.sin(cx * 0.3 + cy * 0.45 + t * 1.4 + n * 5);
        ctx.fillStyle = `rgba(${COBALT},${0.42 * v})`;
        ctx.fillRect(cx * cell, cy * cell, cell, cell);
        dot(cx, cy, 0.85 + 0.15 * v, COBALT, clamp01(0.96 * shimmer), CHARS);
        continue;
      }

      // Gold extrusion: the letter shape repeated down-right, receding.
      let d = 0;
      for (let k = 1; k <= DEPTH; k++) {
        if (at(cx - k, cy - k) >= 0.3) {
          d = k;
          break;
        }
      }
      if (d > 0) {
        const recede = 1 - (d - 1) / DEPTH;
        ctx.fillStyle = `rgba(${GOLD},${0.16 + 0.12 * recede})`;
        ctx.fillRect(cx * cell, cy * cell, cell, cell);
        dot(cx, cy, 0.55 + 0.35 * recede, GOLD, 0.6 + 0.35 * recede, CHARS);
        continue;
      }

      // Dithered sky: sun rays fanning out from behind the word, with slow
      // drifting cloud banks, all drawn as a dense halftone.
      const ang = Math.atan2(cy - ccy, cx - ccx);
      const ray = Math.pow(0.5 + 0.5 * Math.sin(ang * 11 + t * 0.1), 3);
      const cloud =
        0.5 +
        0.28 * Math.sin(cx * 0.075 + t * 0.06 + Math.sin(cy * 0.3) * 1.4) * Math.cos(cy * 0.18 - t * 0.03) +
        0.22 * Math.sin(cx * 0.21 - t * 0.05 + cy * 0.13) +
        0.18 * (n - 0.5);
      if (cloud > 0.72) {
        // Gold cloud puffs against the periwinkle.
        dot(cx, cy, 0.35 + (cloud - 0.72) * 2.2, CLOUD, 0.45 + (cloud - 0.72) * 1.3, CHARS);
      } else {
        // Cobalt texture over the pale ground, deepest along the rays.
        const depth = clamp01(0.3 + 0.6 * ray + 0.25 * (cloud - 0.4));
        dot(cx, cy, 0.25 + 0.55 * depth, ray > 0.45 ? SKY : SKY_DEEP, 0.2 + 0.45 * depth, CHARS);
      }
    }
  }
}

export default function TitleAscii({ className = "" }: { className?: string }) {
  // A finer grid than the backdrops so the letterforms carry enough detail.
  return <FieldBackground draw={drawTitle} cell={9} className={className} />;
}
