import FieldBackground, { type FieldEnv } from "./FieldBackground";
import { BLUE, ACCENT, GLOW, hash } from "../lib/ascii";

type Props = { className?: string };

/* 18. Relational Reasoning: a set of objects with all-pairs relation lines
   pulsing between them. */
function drawRelational({ t, cols, rows, paint, dot }: FieldEnv) {
  const N = 7;
  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i < N; i++) nodes.push({ x: cols * (0.15 + 0.7 * hash(i, 1)), y: rows * (0.15 + 0.7 * hash(i, 2)) });
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + (i * 3 + j) * 0.7);
      const steps = Math.round(Math.hypot(a.x - b.x, a.y - b.y));
      for (let s = 0; s <= steps; s += 2)
        paint(Math.round(a.x + ((b.x - a.x) * s) / steps), Math.round(a.y + ((b.y - a.y) * s) / steps), "·", BLUE, 0.1 + 0.2 * pulse);
    }
  }
  for (const n of nodes) dot(Math.round(n.x), Math.round(n.y), 1, ACCENT, 0.85);
}

/* 19. Neural Turing Machines: a memory tape with a read/write head that a
   controller drives back and forth. */
function drawNTM({ t, cols, rows, paint, dot }: FieldEnv) {
  // Stacked memory tapes filling the height, with a read/write head column that
  // runs the full height (the controller).
  const tapes = 5;
  const head = Math.round(2 + (Math.sin(t * 0.5) * 0.5 + 0.5) * (cols - 6));
  for (let yy = 0; yy < rows; yy++) paint(head, yy, "·", ACCENT, 0.18);
  for (let L = 0; L < tapes; L++) {
    const tapeY = Math.round(rows * ((L + 0.5) / tapes));
    for (let cx = 2; cx < cols - 2; cx++) {
      const val = 0.4 + 0.4 * Math.sin(cx * 0.5 + Math.sin(cx * 0.13 + L) * 2);
      dot(cx, tapeY, val, BLUE, 0.3);
    }
    for (let dy = -1; dy <= 1; dy++) dot(head, tapeY + dy, 1, GLOW, 0.8);
  }
}

/* 20. Order Matters: a set of elements up top, mapped by crossing lines to a
   reordered set below; the permutation shifts over time. */
function drawOrder({ t, cols, rows, paint, dot }: FieldEnv) {
  const N = 10;
  const topY = Math.round(rows * 0.12);
  const botY = Math.round(rows * 0.88);
  const xs: number[] = [];
  for (let i = 0; i < N; i++) xs.push(Math.round(cols * (0.1 + (0.8 * i) / (N - 1))));
  const perm = [...Array(N).keys()];
  const seed = Math.floor(t * 0.3);
  for (let i = N - 1; i > 0; i--) {
    const j = Math.floor(hash(i, seed) * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < N; i++) {
    dot(xs[i], topY, 1, ACCENT, 0.8);
    dot(xs[perm[i]], botY, 1, BLUE, 0.7);
    const ax = xs[i];
    const bx = xs[perm[i]];
    for (let s = 0; s <= botY - topY; s++) paint(Math.round(ax + ((bx - ax) * s) / (botY - topY)), topY + s, "·", BLUE, 0.16);
  }
}

/* 21. Relational Recurrent Networks: a column of memory slots interacting via
   self-attention arcs that shift over time. */
function drawRelRecurrent({ t, cols, rows, paint, dot }: FieldEnv) {
  const M = 6;
  const slotsY: number[] = [];
  for (let i = 0; i < M; i++) slotsY.push(Math.round(rows * (0.15 + (0.7 * i) / (M - 1))));
  // Two mirrored slot columns in the side margins (the centre is covered by
  // the thumbnail); attention arcs bow toward the interior but stay in-margin.
  for (const slotX of [Math.round(cols * 0.16), Math.round(cols * 0.84)]) {
    const inward = slotX < cols / 2 ? 1 : -1;
    for (let i = 0; i < M; i++) {
      for (let j = 0; j < M; j++) {
        if (i === j) continue;
        const w = 0.5 + 0.5 * Math.sin(t * 1.2 + i * 1.3 - j * 0.7);
        if (w < 0.6) continue;
        const y0 = slotsY[i];
        const y1 = slotsY[j];
        const steps = Math.abs(y1 - y0) + 1;
        for (let s = 0; s <= steps; s++) {
          const y = Math.round(y0 + ((y1 - y0) * s) / steps);
          const arc = inward * Math.sin((s / steps) * Math.PI) * Math.abs(j - i) * 2;
          paint(Math.round(slotX + arc), y, "·", ACCENT, 0.1 + 0.25 * (w - 0.6));
        }
      }
    }
    for (let i = 0; i < M; i++) dot(slotX, slotsY[i], 1, GLOW, 0.8);
  }
}

/* 22. Attention Is All You Need: a row of tokens with self-attention arcs from
   a sweeping query token, weighted by attention strength. */
function drawAttention({ t, cols, rows, paint, dot }: FieldEnv) {
  const N = Math.min(14, Math.floor(cols / 6));
  const y = Math.round(rows * 0.5);
  const xs: number[] = [];
  for (let i = 0; i < N; i++) xs.push(Math.round(cols * (0.08 + (0.84 * i) / (N - 1))));
  const q = Math.floor(t * 0.6) % N;
  for (let i = 0; i < N; i++) {
    const w = 0.5 + 0.5 * Math.sin((i - q) * 0.9 + t * 0.5) * Math.exp(-Math.abs(i - q) * 0.15);
    const ax = xs[q];
    const bx = xs[i];
    const steps = Math.abs(bx - ax) + 1;
    const height = rows * 0.28 * Math.min(1, (Math.abs(i - q) / N) * 2);
    const up = (i + q) % 2 ? -1 : 1;
    for (let s = 0; s <= steps; s++)
      paint(Math.round(ax + ((bx - ax) * s) / steps), Math.round(y + up * Math.sin((s / steps) * Math.PI) * height), "·", ACCENT, 0.08 + 0.3 * w);
  }
  for (let i = 0; i < N; i++) dot(xs[i], y, 1, i === q ? GLOW : BLUE, i === q ? 0.95 : 0.6);
}

export const RelationalReasoningBackground = (p: Props) => <FieldBackground draw={drawRelational} {...p} />;
export const NeuralTuringBackground = (p: Props) => <FieldBackground draw={drawNTM} {...p} />;
export const OrderMattersBackground = (p: Props) => <FieldBackground draw={drawOrder} {...p} />;
export const RelationalRecurrentBackground = (p: Props) => <FieldBackground draw={drawRelRecurrent} {...p} />;
export const AttentionBackground = (p: Props) => <FieldBackground draw={drawAttention} {...p} />;
