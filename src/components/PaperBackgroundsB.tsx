import FieldBackground, { type FieldEnv } from "./FieldBackground";
import { BLUE, ACCENT, GLOW, hash, shimmer, breathe } from "../lib/ascii";

type Props = { className?: string; dark?: boolean };

/* 12. Identity Mappings: a clean, uninterrupted signal highway (the identity
   shortcut) with small residual side-branches that leave and rejoin. */
function drawIdentity({ t, cols, rows, paint, dot }: FieldEnv) {
  // Stacked identity highways filling the full height, spanning the width and
  // reaching the edges to meet neighbours.
  const lanes = 5;
  for (let L = 0; L < lanes; L++) {
    const midY = Math.round(rows * ((L + 0.5) / lanes));
    for (let cx = 0; cx < cols; cx++) {
      const flow = shimmer(t, cx, midY);
      dot(cx, midY, 0.85, GLOW, 0.4 + 0.35 * flow);
    }
    const K = 6;
    for (let cx = 4; cx < cols; cx += K) {
      const side = Math.floor(cx / K) % 2 ? 1 : -1;
      for (let s = 1; s <= 2; s++) paint(cx + s, midY + side * (1 + s), "·", BLUE, 0.28);
      dot(cx, midY + side * 3, 0.7, ACCENT, 0.45);
    }
  }
}

/* 13. RNN Regularization: layered recurrent cells with dropout flickering out
   the non-recurrent (vertical) connections. */
function drawRnnReg({ t, cols, rows, paint, dot }: FieldEnv) {
  const step = Math.floor(t * 2);
  for (let L = 0; L < 3; L++) {
    const y = Math.round(rows * (0.3 + L * 0.2));
    for (let cx = 1; cx < cols; cx += 2) {
      const drop = hash(cx + L * 13, step) > 0.7;
      paint(cx - 1, y, "·", BLUE, 0.25);
      dot(cx, y, drop ? 0.2 : 0.9, drop ? BLUE : ACCENT, drop ? 0.15 : 0.7);
      if (L > 0 && !drop) {
        const yb = Math.round(rows * (0.3 + (L - 1) * 0.2));
        for (let yy = yb + 1; yy < y; yy++) paint(cx, yy, "·", ACCENT, 0.2);
      }
    }
  }
}

/* 14. Unreasonable Effectiveness of RNNs: characters generated one at a time,
   streaming down with a bright generation front. */
const CHARS = "abcdefghijklmnopqrstuvwxyz .,;'";
function drawCharRnn({ t, cols, rows, paint }: FieldEnv) {
  for (let cx = 0; cx < cols; cx += 2) {
    const speed = 0.6 + hash(cx, 1) * 0.8;
    const head = (t * speed * 6 + hash(cx, 3) * rows) % (rows + 8);
    for (let cy = 0; cy < rows; cy++) {
      const d = head - cy;
      if (d < 0 || d > rows * 0.5) continue;
      const ch = CHARS[Math.floor(hash(cx, cy + Math.floor(head)) * CHARS.length)];
      const front = d < 1.2;
      paint(cx, cy, ch, front ? GLOW : BLUE, front ? 0.9 : Math.max(0, 0.55 * (1 - d / (rows * 0.5))));
    }
  }
}

/* 15. Understanding LSTMs: the cell-state conveyor belt running across, with
   gates opening and closing beneath it. */
function drawLstm({ t, cols, rows, dot }: FieldEnv) {
  // Stacked conveyor belts filling the full height.
  const lanes = 4;
  for (let L = 0; L < lanes; L++) {
    const y = Math.round(rows * ((L + 0.5) / lanes));
    for (let cx = 0; cx < cols; cx++) {
      const flow = shimmer(t, cx, y);
      dot(cx, y - 2, 0.7 + 0.3 * flow, ACCENT, 0.45);
    }
    for (let cx = 8; cx < cols; cx += 8) {
      const open = breathe(t, 0.45, cx * 0.02 + L);
      for (let dy = -1; dy <= 2; dy++) dot(cx, y + dy, open, GLOW, 0.3 + 0.45 * open);
    }
  }
}

/* 16. Deep Speech 2: an audio waveform on the left resolving into transcribed
   characters on the right. */
const TRANSCRIPT = "the quick brown fox jumps ".split("");
function drawSpeech({ t, cols, rows, paint, dot }: FieldEnv) {
  // Three stacked waveform-to-text bands so the pattern fills the full height.
  const bands = 3;
  const split = Math.floor(cols * 0.55);
  for (let B = 0; B < bands; B++) {
    const midY = rows * ((B + 0.5) / bands);
    const amp0 = rows * (0.5 / bands) * 0.85;
    for (let cx = 0; cx < split; cx++) {
      const amp = (0.5 + 0.5 * Math.sin(cx * 0.5 + B * 2)) * Math.sin(cx * 0.13 + B) * amp0;
      const yA = Math.round(midY + amp);
      const yB = Math.round(midY - amp);
      for (let cy = Math.min(yA, yB); cy <= Math.max(yA, yB); cy++) dot(cx, cy, 0.45, BLUE, 0.28);
      dot(cx, yA, 0.9, ACCENT, 0.6);
      dot(cx, yB, 0.9, ACCENT, 0.6);
    }
    for (let cx = split; cx < cols; cx += 2) {
      if (cx - split > (t * 8 + B * 11) % (cols - split) + 6) continue;
      paint(cx, Math.round(midY), TRANSCRIPT[(cx + B * 5) % TRANSCRIPT.length], ACCENT, 0.7);
    }
  }
}

/* 17. Annotated Transformer: lines of code on the left, an attention stack of
   blocks with arcs on the right. */
function drawAnnotated({ t, cols, rows, paint, dot }: FieldEnv) {
  const codeW = Math.floor(cols * 0.42);
  for (let cy = 1; cy < rows; cy++) {
    const indent = Math.floor(hash(cy, 3) * 4);
    const len = Math.floor(codeW * (0.3 + 0.6 * hash(cy, 7)));
    const cursor = Math.floor((t * 20 + cy * 3) % (len + 8));
    for (let cx = 2 + indent; cx < len; cx++) {
      if (hash(cx, cy * 1.3) < 0.35) continue;
      const near = Math.abs(cx - cursor) < 1.5;
      paint(cx, cy, near ? "▍" : "·", near ? GLOW : BLUE, near ? 0.8 : 0.3);
    }
  }
  const bx = Math.floor(cols * 0.72);
  const blocks = 6;
  for (let b = 0; b < blocks; b++) {
    const by = Math.round(rows * (0.12 + b * 0.13));
    for (let dx = -6; dx <= 6; dx++) dot(bx + dx, by, 0.7, ACCENT, 0.5);
    const tgt = Math.floor(hash(b, Math.floor(t)) * blocks);
    const ty = Math.round(rows * (0.12 + tgt * 0.13));
    for (let s = 0; s <= 6; s++) paint(bx + 8 + s, Math.round(by + ((ty - by) * s) / 6), "·", GLOW, 0.3);
  }
}

export const IdentityMappingsBackground = (p: Props) => <FieldBackground draw={drawIdentity} {...p} />;
export const RnnRegularizationBackground = (p: Props) => <FieldBackground draw={drawRnnReg} {...p} />;
export const CharRnnBackground = (p: Props) => <FieldBackground draw={drawCharRnn} {...p} />;
export const LstmBackground = (p: Props) => <FieldBackground draw={drawLstm} {...p} />;
export const DeepSpeechBackground = (p: Props) => <FieldBackground draw={drawSpeech} {...p} />;
export const AnnotatedTransformerBackground = (p: Props) => <FieldBackground draw={drawAnnotated} {...p} />;
