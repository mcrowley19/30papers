import FieldBackground, { type FieldEnv } from "./FieldBackground";
import { BLUE, ACCENT, GLOW, hash } from "../lib/ascii";

type Props = { className?: string };

/* 23. Neural MT: a soft alignment matrix between two sequences, a shimmering
   near-diagonal of attention. */
function drawNMT({ t, cols, rows, dot }: FieldEnv) {
  const gx0 = Math.floor(cols * 0.14);
  const gy0 = Math.floor(rows * 0.14);
  const W = Math.floor(cols * 0.72);
  const H = Math.floor(rows * 0.72);
  for (let iy = 0; iy <= H; iy++) {
    for (let ix = 0; ix <= W; ix++) {
      const u = ix / W;
      const v = iy / H;
      const align = Math.exp(-Math.pow((v - (u + 0.06 * Math.sin(u * 6 + t))) / 0.12, 2));
      if (align < 0.15) continue;
      const shimmer = 0.6 + 0.4 * Math.sin(u * 10 - t * 3);
      dot(gx0 + ix, gy0 + iy, align, align > 0.6 ? GLOW : ACCENT, 0.22 + 0.55 * align * shimmer);
    }
  }
}

/* 24. Pointer Networks: an output head that points back at a selected input
   position, cycling through the inputs. */
function drawPointer({ t, cols, rows, paint, dot }: FieldEnv) {
  const N = 12;
  const inY = Math.round(rows * 0.1);
  const xs: number[] = [];
  for (let i = 0; i < N; i++) xs.push(Math.round(cols * (0.1 + (0.8 * i) / (N - 1))));
  for (let i = 0; i < N; i++) dot(xs[i], inY, 0.9, BLUE, 0.55);
  const outY = Math.round(rows * 0.9);
  const outX = Math.round(cols * 0.5);
  const sel = Math.floor(t * 0.8) % N;
  dot(outX, outY, 1, GLOW, 0.9);
  const steps = Math.round(Math.hypot(outX - xs[sel], outY - inY)) + 1;
  for (let s = 0; s <= steps; s++)
    paint(Math.round(outX + ((xs[sel] - outX) * s) / steps), Math.round(outY + ((inY - outY) * s) / steps), "·", ACCENT, 0.5);
  dot(xs[sel], inY, 1, GLOW, 0.95);
}

/* 25. Neural Message Passing: a molecular graph with messages pulsing along
   its bonds between atoms. */
function drawMessagePassing({ t, cols, rows, paint, dot }: FieldEnv) {
  const N = 8;
  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) nodes.push({ x: cols * (0.2 + 0.6 * hash(i, 5)), y: rows * (0.2 + 0.6 * hash(i, 9)) });
  const edges: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    edges.push([i, (i + 1) % N]);
    edges.push([i, (i + 3) % N]);
  }
  for (const [i, j] of edges) {
    const a = nodes[i];
    const b = nodes[j];
    const steps = Math.round(Math.hypot(a.x - b.x, a.y - b.y)) + 1;
    for (let s = 0; s <= steps; s += 2)
      paint(Math.round(a.x + ((b.x - a.x) * s) / steps), Math.round(a.y + ((b.y - a.y) * s) / steps), "·", BLUE, 0.18);
    const mp = (t * 0.5 + (i * 3 + j) * 0.13) % 1;
    dot(Math.round(a.x + (b.x - a.x) * mp), Math.round(a.y + (b.y - a.y) * mp), 1, GLOW, 0.8);
  }
  for (const n of nodes) dot(Math.round(n.x), Math.round(n.y), 1, ACCENT, 0.85);
}

/* 26. Scaling Laws: power-law lines (straight on a log-log plot) with a point
   travelling down each as loss falls. */
function drawScaling({ t, cols, rows, paint, dot }: FieldEnv) {
  for (let gx = 0; gx < cols; gx += 8) for (let cy = 0; cy < rows; cy++) paint(gx, cy, "·", BLUE, 0.06);
  for (let gy = 0; gy < rows; gy += 6) for (let cx = 0; cx < cols; cx++) paint(cx, gy, "·", BLUE, 0.06);
  const lines = [
    { m: 0.5, b: 0.15 },
    { m: 0.65, b: 0.32 },
    { m: 0.42, b: 0.5 },
  ];
  lines.forEach((ln, li) => {
    for (let cx = Math.floor(cols * 0.1); cx < cols * 0.92; cx++) {
      const y = Math.round(rows * (ln.b + ln.m * (cx / cols)));
      if (y < 0 || y >= rows) continue;
      dot(cx, y, 0.9, ACCENT, 0.6);
      dot(cx, y - 1, 0.4, ACCENT, 0.2);
    }
    const u = 0.1 + ((t * 0.15 + li * 0.3) % 0.82);
    dot(Math.round(cols * u), Math.round(rows * (ln.b + ln.m * u)), 1, GLOW, 0.95);
  });
}

/* 27. GPipe: pipeline stages (rows) processing micro-batches that flow through
   as a diagonal wavefront. */
function drawGPipe({ t, cols, rows, dot }: FieldEnv) {
  const S = 6;
  const stageH = rows / S;
  const nb = 8;
  const bw = Math.max(3, Math.floor(cols / (nb + S)));
  for (let s = 0; s < S; s++) {
    const y0 = Math.round(s * stageH + 2);
    const y1 = Math.round((s + 1) * stageH - 2);
    for (let b = 0; b < nb; b++) {
      const tx = (((b + s) * bw + Math.floor(t * bw * 1.2)) % (cols + bw * 2)) - bw;
      for (let cx = tx; cx < tx + bw - 1; cx++) {
        if (cx < 0 || cx >= cols) continue;
        for (let cy = y0; cy <= y1; cy++) dot(cx, cy, 0.8, b % 2 ? ACCENT : BLUE, 0.5);
      }
    }
  }
}

export const NeuralMtBackground = (p: Props) => <FieldBackground draw={drawNMT} {...p} />;
export const PointerNetworksBackground = (p: Props) => <FieldBackground draw={drawPointer} {...p} />;
export const MessagePassingBackground = (p: Props) => <FieldBackground draw={drawMessagePassing} {...p} />;
export const ScalingLawsBackground = (p: Props) => <FieldBackground draw={drawScaling} {...p} />;
export const GPipeBackground = (p: Props) => <FieldBackground draw={drawGPipe} {...p} />;
