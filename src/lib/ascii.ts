// Shared grid + palette for the paper backdrops, so every section reads as one
// continuous halftone rather than a set of disjointed backgrounds. Keep the
// cell size and core blues identical across all backgrounds.
export const CELL = 15; // glyph grid spacing in px
export const BLUE = "30,64,175"; // deep cobalt
export const ACCENT = "96,165,250"; // light accent blue
export const GLOW = "150,196,255"; // brightest highlight blue

// Density ramp, lightest to heaviest, shared across backdrops.
export const DOTS = " ·:•●◉";

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
