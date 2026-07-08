import FieldBackground, { type FieldEnv } from "./FieldBackground";
import { BLUE, ACCENT, GLOW, hash, clamp01, breathe, shimmer } from "../lib/ascii";

type Props = { className?: string; dark?: boolean };

/* 6. MDL Tutorial: data points scattered around a model curve that threads
   through them (the model is the short description that compresses the data). */
function drawMDL({ cols, rows, paint, dot }: FieldEnv) {
  const mid = rows * 0.5;
  const amp = rows * 0.26;
  const yOf = (u: number) => mid + amp * Math.sin(u * 3.1) * Math.cos(u * 1.7);
  for (let cx = 0; cx < cols; cx++) {
    const cy = Math.round(yOf(cx / cols));
    dot(cx, cy, 0.95, ACCENT, 0.75);
    dot(cx, cy - 1, 0.4, ACCENT, 0.22);
    dot(cx, cy + 1, 0.4, ACCENT, 0.22);
  }
  const N = Math.floor(cols * 0.7);
  for (let i = 0; i < N; i++) {
    const u = hash(i * 1.3, 7.1);
    const cx = Math.floor(u * cols);
    const res = (hash(i, 2.2) - 0.5) * amp * 2.4;
    const base = yOf(u);
    const cy = Math.round(base + res);
    if (cy < 0 || cy >= rows) continue;
    const dir = res > 0 ? -1 : 1;
    for (let k = 2; k < Math.abs(res); k += 2) paint(cx, Math.round(base + res + dir * k), "·", BLUE, 0.1);
    paint(cx, cy, "●", BLUE, 0.6);
  }
}

/* 7. Machine Super Intelligence: one agent at the centre, concentric rings of
   environments; its reach pulses outward across them. */
function drawMSI({ t, cols, rows, paint, dot }: FieldEnv) {
  const cxr = cols * 0.5;
  const cyr = rows * 0.5;
  const maxR = Math.min(cols, rows) * 0.5;
  const reach = (0.45 + 0.45 * Math.sin(t * 0.3)) * maxR;
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const r = Math.hypot(cx - cxr, cy - cyr);
      if (r < 2 || r % 3.2 > 0.9) continue;
      const lit = r < reach;
      const wave = shimmer(t, cx, cy);
      dot(cx, cy, lit ? 0.9 : 0.4, lit ? ACCENT : BLUE, (lit ? 0.6 : 0.28) * (0.6 + 0.4 * wave));
    }
  }
  paint(Math.round(cxr), Math.round(cyr), "◉", GLOW, 0.95);
}

/* 8. CS231n: an image field with a convolution kernel window raster-scanning
   across it. */
function drawConv({ t, cols, rows, paint, dot }: FieldEnv) {
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const val = 0.5 + 0.35 * Math.sin(cx * 0.3) * Math.cos(cy * 0.25);
      dot(cx, cy, clamp01(val), BLUE, 0.33);
    }
  }
  const step = Math.floor(t * 10);
  const kx = step % cols;
  const ky = (Math.floor(step / cols) * 2) % rows;
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) paint(kx + dx, ky + dy, "◉", ACCENT, 0.7);
  paint(kx, ky, "◉", GLOW, 0.95);
}

/* 9. AlexNet: stacked layers, the image on the left abstracting into feature
   activations, a signal flowing through, a single class cell winning. */
function drawAlexNet({ t, cols, rows, dot }: FieldEnv) {
  const nLayers = 5;
  for (let L = 0; L < nLayers; L++) {
    const xc = Math.floor(((L + 0.5) / nLayers) * cols);
    const w = Math.max(2, Math.floor((cols / nLayers) * 0.42));
    const density = L === 0 ? 0.85 : 0.5 - L * 0.06;
    const flow = breathe(t, 0.35, L * 0.9);
    for (let cy = 0; cy < rows; cy++) {
      for (let dx = -w; dx <= w; dx++) {
        const cx = xc + dx;
        if (cx < 0 || cx >= cols) continue;
        const a = hash(cx * 1.1, cy * 1.3 + L);
        if (a > density) continue;
        const win = L === nLayers - 1 && Math.abs(cy - rows * 0.42) < 1.2;
        dot(cx, cy, win ? 1 : 0.5 + 0.4 * a, win ? GLOW : BLUE, (win ? 0.95 : 0.4) * (0.5 + 0.5 * flow));
      }
    }
  }
}

/* 10. ResNet: a signal highway of layer blocks, with skip-connection arcs
   bypassing each block. */
function drawResNet({ t, cols, rows, paint, dot }: FieldEnv) {
  // Stacked residual lanes filling the full height (a deep stack of layers), so
  // it spans the width and reaches the top/bottom edges to meet its neighbours.
  const lanes = 5;
  for (let L = 0; L < lanes; L++) {
    const midY = Math.round(rows * ((L + 0.5) / lanes));
    for (let cx = 0; cx < cols; cx++) {
      const pulse = shimmer(t, cx, midY);
      dot(cx, midY, 0.5 + 0.4 * pulse, BLUE, 0.45);
    }
    const K = 6;
    for (let cx = 3 + (L % 2) * 3; cx < cols; cx += K) {
      for (let dy = -2; dy <= 2; dy++) dot(cx, midY + dy, 0.8, ACCENT, 0.55);
      for (let s = 0; s <= K; s++) {
        const ax = cx - K + s;
        if (ax < 0) continue;
        paint(ax, midY - Math.round(3 + 2 * Math.sin((s / K) * Math.PI)), "·", ACCENT, 0.28);
      }
    }
  }
}

/* 11. Dilated Convolutions: a sample lattice whose spacing (dilation) grows,
   expanding the receptive field. */
function drawDilated({ t, cols, rows, dot }: FieldEnv) {
  const cxr = Math.round(cols * 0.5);
  const cyr = Math.round(rows * 0.5);
  const dil = 1 + Math.floor((t * 0.4) % 4);
  for (let gy = -5; gy <= 5; gy++) {
    for (let gx = -8; gx <= 8; gx++) {
      const cx = cxr + gx * dil;
      const cy = cyr + gy * dil;
      if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) continue;
      const center = gx === 0 && gy === 0;
      const pulse = breathe(t, 0.35, Math.abs(gx) + Math.abs(gy));
      dot(cx, cy, center ? 1 : 0.7, center ? GLOW : ACCENT, (center ? 0.9 : 0.5) * (0.5 + 0.5 * pulse));
    }
  }
}

export const MdlBackground = (p: Props) => <FieldBackground draw={drawMDL} {...p} />;
export const MachineSuperIntelligenceBackground = (p: Props) => <FieldBackground draw={drawMSI} {...p} />;
export const Cs231nBackground = (p: Props) => <FieldBackground draw={drawConv} {...p} />;
export const AlexNetBackground = (p: Props) => <FieldBackground draw={drawAlexNet} {...p} />;
export const ResNetBackground = (p: Props) => <FieldBackground draw={drawResNet} {...p} />;
export const DilatedBackground = (p: Props) => <FieldBackground draw={drawDilated} {...p} />;
