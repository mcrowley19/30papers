/**
 * Generative, paper-specific background motifs.
 *
 * Each motif is a pure draw function `(ctx, w, h, t, seed)` that paints a
 * monochrome (white-on-transparent) animated figure themed to a paper's idea.
 * `t` is elapsed seconds; `seed` gives per-paper variation. Drawn over a near
 * black section background by MotifCanvas. No colour, no AI cliches — these are
 * the *figures* of the papers (attention matrices, conv filters, unrolled
 * recurrences, graphs, memory tapes, power laws...) rendered as halftone.
 */
export type MotifKey =
  | "attention"
  | "conv"
  | "sequence"
  | "graph"
  | "resnet"
  | "memory"
  | "scaling"
  | "latent"
  | "bits"
  | "automaton"
  | "field";

export type MotifFn = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  seed: number,
) => void;

// Small deterministic PRNG so each paper's motif is stable across frames.
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const dot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  a: number,
) => {
  if (r <= 0.15 || a <= 0.01) return;
  ctx.globalAlpha = a;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
};

/** Attention matrix: a grid of dots whose size pulses as a soft head sweeps. */
const attention: MotifFn = (ctx, w, h, t, seed) => {
  const n = 22;
  const cell = Math.min(w, h) / (n + 2);
  const ox = (w - cell * n) / 2;
  const oy = (h - cell * n) / 2;
  const r = rng(seed);
  const base: number[] = [];
  for (let i = 0; i < n * n; i++) base.push(r());
  const sweep = (Math.sin(t * 0.5) * 0.5 + 0.5) * n;
  ctx.fillStyle = "#fff";
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const b = base[row * n + col];
      // soft attention band around the sweeping query position
      const band = Math.exp(-((col - sweep) ** 2) / (2 * 9));
      const v = 0.12 + band * (0.5 + 0.5 * b);
      const x = ox + col * cell + cell / 2;
      const y = oy + row * cell + cell / 2;
      dot(ctx, x, y, (cell / 2) * v, 0.25 + v * 0.55);
    }
  }
  ctx.globalAlpha = 1;
};

/** Convolution filters: a grid of tiles each holding a tiny oriented grating. */
const conv: MotifFn = (ctx, w, h, t, seed) => {
  const cols = 9;
  const rows = Math.max(5, Math.round((cols * h) / w));
  const tile = Math.min(w / cols, h / rows);
  const ox = (w - tile * cols) / 2;
  const oy = (h - tile * rows) / 2;
  const r = rng(seed);
  ctx.fillStyle = "#fff";
  for (let ry = 0; ry < rows; ry++) {
    for (let rx = 0; rx < cols; rx++) {
      const ang = r() * Math.PI;
      const freq = 2 + Math.floor(r() * 4);
      const phase = t * (0.4 + r() * 0.8) + r() * 6;
      const cx = ox + rx * tile + tile / 2;
      const cy = oy + ry * tile + tile / 2;
      const dots = 7;
      const step = (tile * 0.74) / dots;
      for (let i = 0; i < dots; i++) {
        for (let j = 0; j < dots; j++) {
          const lx = (i - (dots - 1) / 2) * step;
          const ly = (j - (dots - 1) / 2) * step;
          const proj = lx * Math.cos(ang) + ly * Math.sin(ang);
          const v = Math.sin((proj / step) * freq * 0.5 + phase) * 0.5 + 0.5;
          dot(ctx, cx + lx, cy + ly, step * 0.42 * v, 0.16 + v * 0.5);
        }
      }
    }
  }
  ctx.globalAlpha = 1;
};

/** Unrolled recurrence: rows of nodes with a pulse travelling left to right. */
const sequence: MotifFn = (ctx, w, h, t, seed) => {
  const r = rng(seed);
  const rows = 7;
  const n = 14;
  const gapY = h / (rows + 1);
  const gapX = w / (n + 1);
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  for (let row = 0; row < rows; row++) {
    const y = gapY * (row + 1);
    const speed = 1.4 + r() * 1.2;
    const head = ((t * speed + r() * n) % (n + 4)) - 2;
    for (let i = 0; i < n; i++) {
      const x = gapX * (i + 1);
      const d = Math.abs(i - head);
      const pulse = Math.exp(-(d * d) / 2);
      if (i < n - 1) {
        ctx.globalAlpha = 0.08 + pulse * 0.4;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(gapX * (i + 2), y);
        ctx.stroke();
      }
      dot(ctx, x, y, 2 + pulse * 5, 0.2 + pulse * 0.7);
    }
  }
  ctx.globalAlpha = 1;
};

/** Message-passing graph: nodes with pulses running along edges. */
const graph: MotifFn = (ctx, w, h, t, seed) => {
  const r = rng(seed);
  const N = 26;
  const nodes = Array.from({ length: N }, () => ({
    x: r() * w,
    y: r() * h,
  }));
  const edges: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    // connect each node to its 2 nearest neighbours
    const d = nodes
      .map((p, j) => ({ j, d: (p.x - nodes[i].x) ** 2 + (p.y - nodes[i].y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d);
    edges.push([i, d[0].j], [i, d[1].j]);
  }
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  edges.forEach(([a, b], k) => {
    const p = nodes[a];
    const q = nodes[b];
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
    // travelling pulse
    const f = (t * 0.5 + k * 0.13) % 1;
    dot(ctx, p.x + (q.x - p.x) * f, p.y + (q.y - p.y) * f, 2.2, 0.7);
  });
  nodes.forEach((p) => dot(ctx, p.x, p.y, 3, 0.6));
  ctx.globalAlpha = 1;
};

/** Residual blocks with clean bypass rails beside the transform path. */
const resnet: MotifFn = (ctx, w, h, t, seed) => {
  const r = rng(seed);
  const lanes = 4;
  const blocks = 6;
  const laneW = w / (lanes + 1);
  const gapY = h / (blocks + 1);
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  for (let l = 0; l < lanes; l++) {
    const x = laneW * (l + 1);
    const phase = r() * blocks;
    for (let b = 0; b < blocks; b++) {
      const y = gapY * (b + 1);
      const pulse = Math.exp(-((((t * 1.5 + phase) % blocks) - b) ** 2) / 0.6);
      const bw = laneW * 0.34;
      const bh = gapY * 0.32;

      // transform block
      ctx.globalAlpha = 0.18 + pulse * 0.5;
      ctx.lineWidth = 1.4;
      ctx.strokeRect(x - bw / 2, y - bh / 2, bw, bh);

      // vertical residual stream and squared-off bypass
      ctx.globalAlpha = 0.09 + pulse * 0.28;
      ctx.beginPath();
      ctx.moveTo(x, y - gapY * 0.48);
      ctx.lineTo(x, y - bh / 2);
      ctx.moveTo(x, y + bh / 2);
      ctx.lineTo(x, y + gapY * 0.48);
      ctx.stroke();

      ctx.globalAlpha = 0.1 + pulse * 0.45;
      ctx.beginPath();
      ctx.moveTo(x - bw / 2, y - bh / 2);
      ctx.lineTo(x - laneW * 0.3, y - bh / 2);
      ctx.lineTo(x - laneW * 0.3, y + bh / 2);
      ctx.lineTo(x - bw / 2, y + bh / 2);
      ctx.stroke();

      dot(ctx, x, y, 2 + pulse * 4, 0.25 + pulse * 0.6);
    }
  }
  ctx.globalAlpha = 1;
};

/** Memory tape: a row of cells with a read/write head sweeping across. */
const memory: MotifFn = (ctx, w, h, t, seed) => {
  const r = rng(seed);
  const cells = 18;
  const rows = 6;
  const cw = w / (cells + 1);
  const gapY = h / (rows + 1);
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  for (let row = 0; row < rows; row++) {
    const y = gapY * (row + 1);
    const head = (t * 2 + r() * cells) % cells;
    for (let c = 0; c < cells; c++) {
      const x = cw * (c + 1);
      ctx.globalAlpha = 0.14;
      ctx.lineWidth = 1;
      ctx.strokeRect(x - cw * 0.36, y - gapY * 0.22, cw * 0.72, gapY * 0.44);
      const active = Math.exp(-((c - head) ** 2) / 1.2);
      const v = (Math.sin(c * 1.7 + row) * 0.5 + 0.5) * (0.3 + active);
      dot(ctx, x, y, cw * 0.26 * v, 0.2 + active * 0.7);
    }
  }
  ctx.globalAlpha = 1;
};

/** Scaling laws: a power-law line on log-log axes with points settling onto it. */
const scaling: MotifFn = (ctx, w, h, t, seed) => {
  const r = rng(seed);
  const padL = w * 0.14;
  const padB = h * 0.16;
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  // axes
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, h * 0.12);
  ctx.lineTo(padL, h - padB);
  ctx.lineTo(w - w * 0.1, h - padB);
  ctx.stroke();
  // power-law trend (straight on log-log)
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(padL, h * 0.2);
  ctx.lineTo(w - w * 0.1, h - padB);
  ctx.stroke();
  // points settling toward the line
  const settle = Math.min(1, t / 3);
  for (let i = 0; i < 90; i++) {
    const fx = r();
    const x = padL + fx * (w - w * 0.1 - padL);
    const onLine = h * 0.2 + fx * (h - padB - h * 0.2);
    const scatter = (r() - 0.5) * h * 0.32 * (1 - settle);
    dot(ctx, x, onLine + scatter, 2.2, 0.55);
  }
  ctx.globalAlpha = 1;
};

/** Latent sampling: a Gaussian cloud pinched through a narrow code bottleneck. */
const latent: MotifFn = (ctx, w, h, t, seed) => {
  const r = rng(seed);
  const cx = w * 0.5;
  const cy = h * 0.5;
  const left = w * 0.22;
  const right = w * 0.78;
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 1;

  for (let i = 0; i < 96; i++) {
    const a = r() * Math.PI * 2;
    const rad = Math.sqrt(r()) * Math.min(w, h) * 0.32;
    const px = left + Math.cos(a) * rad * 0.74;
    const py = cy + Math.sin(a) * rad;
    const lane = r() * 2 - 1;
    const phase = (t * (0.18 + r() * 0.18) + r()) % 1;
    const mx = px + (cx - px) * phase;
    const my = py + (cy + lane * h * 0.07 - py) * phase;
    const decodeX = cx + (right - cx) * phase;
    const decodeY = cy + lane * h * 0.07 + Math.sin(phase * Math.PI + a) * h * 0.08;

    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(cx, cy + lane * h * 0.07, decodeX, decodeY);
    ctx.stroke();

    dot(ctx, phase < 0.5 ? mx : decodeX, phase < 0.5 ? my : decodeY, 1.8 + r() * 1.7, 0.22 + phase * 0.35);
  }

  ctx.globalAlpha = 0.36;
  ctx.strokeRect(cx - w * 0.035, cy - h * 0.22, w * 0.07, h * 0.44);
  dot(ctx, cx, cy, 5 + Math.sin(t * 1.4) * 1.2, 0.55);
  ctx.globalAlpha = 1;
};

/** Compression: bit columns collapse into shorter code words. */
const bits: MotifFn = (ctx, w, h, t, seed) => {
  const r = rng(seed);
  const cols = 28;
  const rows = 14;
  const sx = w / (cols + 1);
  const sy = h / (rows + 1);
  const fold = Math.sin(t * 0.45) * 0.5 + 0.5;
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const keep = r() > 0.38 || x < cols * (0.28 + fold * 0.22);
      const targetX = w * 0.5 + (x - cols / 2) * sx * (0.28 + (1 - fold) * 0.42);
      const px = sx * (x + 1) * (1 - fold) + targetX * fold;
      const py = sy * (y + 1);
      const v = keep ? 0.45 + r() * 0.55 : 0.1;
      if ((x + y + Math.floor(r() * 3)) % 2 === 0) {
        dot(ctx, px, py, sx * 0.11 * v, 0.18 + v * 0.45);
      } else {
        ctx.globalAlpha = 0.12 + v * 0.32;
        ctx.fillRect(px - sx * 0.055, py - sy * 0.22 * v, sx * 0.11, sy * 0.44 * v);
      }
    }
  }

  ctx.globalAlpha = 0.18;
  ctx.lineWidth = 1;
  for (let x = 0; x < 5; x++) {
    const px = w * (0.38 + x * 0.06);
    ctx.beginPath();
    ctx.moveTo(px, h * 0.16);
    ctx.lineTo(px, h * 0.84);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

/** Coffee automaton: local binary cells mix, coarsen, and settle. */
const automaton: MotifFn = (ctx, w, h, t, seed) => {
  const r = rng(seed);
  const cols = 42;
  const rows = Math.max(24, Math.round((cols * h) / w));
  const cell = Math.min(w / cols, h / rows);
  const ox = (w - cols * cell) / 2;
  const oy = (h - rows * cell) / 2;
  const age = Math.sin(t * 0.22) * 0.5 + 0.5;
  ctx.fillStyle = "#fff";

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const swirl = Math.sin(x * 0.33 + y * 0.21 + seed * 0.01);
      const local = Math.sin((x + y) * 0.8 + t * 0.8) * 0.18;
      const mixed = Math.sin((x - cols / 2) * 0.12 + (y - rows / 2) * 0.1 + t * 0.35);
      const v = (swirl * (1 - age) + mixed * age + local + r() * 0.35) > 0.18 ? 1 : 0;
      if (!v) continue;
      dot(ctx, ox + (x + 0.5) * cell, oy + (y + 0.5) * cell, cell * (0.16 + age * 0.08), 0.16 + age * 0.38);
    }
  }
  ctx.globalAlpha = 1;
};

/** Default: a drifting halftone field — a soft particle cloud. */
const field: MotifFn = (ctx, w, h, t, seed) => {
  const r = rng(seed);
  const N = 150;
  ctx.fillStyle = "#fff";
  for (let i = 0; i < N; i++) {
    const bx = r() * w;
    const by = r() * h;
    const sp = 0.2 + r() * 0.8;
    const x = (bx + Math.sin(t * sp + i) * 30 + w) % w;
    const y = (by + Math.cos(t * sp * 0.7 + i) * 24 + h) % h;
    const v = 0.4 + 0.6 * (Math.sin(t * sp + i) * 0.5 + 0.5);
    dot(ctx, x, y, 1.6 + v * 1.6, 0.18 + v * 0.4);
  }
  ctx.globalAlpha = 1;
};

export const MOTIFS: Record<MotifKey, MotifFn> = {
  attention,
  conv,
  sequence,
  graph,
  resnet,
  memory,
  scaling,
  latent,
  bits,
  automaton,
  field,
};

/** Which motif themes each paper. */
export const motifForSlug: Record<string, MotifKey> = {
  "variational-lossy-autoencoder": "field",
  "keeping-neural-networks-simple": "field",
  "coffee-automaton": "field",
  "first-law-of-complexodynamics": "field",
  "kolmogorov-complexity": "field",
  "mdl-principle-tutorial": "field",
  "machine-super-intelligence": "field",
  cs231n: "conv",
  alexnet: "conv",
  "deep-residual-learning": "resnet",
  "dilated-convolutions": "conv",
  "identity-mappings-resnets": "resnet",
  "rnn-regularization": "sequence",
  "unreasonable-effectiveness-of-rnns": "sequence",
  "understanding-lstms": "sequence",
  "deep-speech-2": "sequence",
  "annotated-transformer": "attention",
  "relational-reasoning": "graph",
  "neural-turing-machines": "memory",
  "order-matters": "sequence",
  "relational-recurrent-networks": "graph",
  "attention-is-all-you-need": "attention",
  "neural-machine-translation": "attention",
  "pointer-networks": "graph",
  "neural-message-passing": "graph",
  "scaling-laws": "scaling",
  gpipe: "resnet",
};

export const motifFor = (slug: string): MotifKey => motifForSlug[slug] ?? "field";

// Stable per-paper seed from the slug.
export const seedFor = (slug: string): number => {
  let s = 0;
  for (let i = 0; i < slug.length; i++) s = (s * 31 + slug.charCodeAt(i)) >>> 0;
  return (s % 100000) + 1;
};
