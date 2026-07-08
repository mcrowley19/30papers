// Shared grid + palette for the paper backdrops, so every section reads as one
// continuous halftone rather than a set of disjointed backgrounds. Keep the
// cell size and core blues identical across all backgrounds.
export const CELL = 15; // glyph grid spacing in px
export const BLUE = "30,64,175"; // deep cobalt
export const ACCENT = "96,165,250"; // light accent blue
export const GLOW = "150,196,255"; // brightest highlight blue

// Density ramp, lightest to heaviest, shared across backdrops.
export const DOTS = " ·:•●◉";

// Landing-page (dark cobalt ground) remap of the core palette: dim strokes go
// light periwinkle, highlights go cream, and the brightest marks go warm gold,
// so every backdrop keeps its concept but reads like retro dither art.
export const DARK_REMAP: Record<string, string> = {
  [BLUE]: "138,168,240",
  [ACCENT]: "236,226,190",
  [GLOW]: "247,209,138",
};

export function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export function hash(x: number, y: number) {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

export function glyphFor(intensity: number, ramp = DOTS) {
  return ramp[Math.min(ramp.length - 1, Math.floor(clamp01(intensity) * ramp.length))];
}

/** Slow global pulse — no spatial sweep across the canvas. */
export function breathe(t: number, speed = 0.35, phase = 0) {
  return 0.5 + 0.5 * Math.sin(t * speed + phase);
}

/** Per-cell flicker — each glyph pulses in place rather than in a travelling wave. */
export function shimmer(t: number, cx: number, cy: number, speed = 0.45) {
  return 0.5 + 0.5 * Math.sin(t * speed + hash(cx, cy) * 6.2831);
}
