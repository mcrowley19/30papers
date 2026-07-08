import { useEffect, useRef } from "react";
import { CELL, BLUE, ACCENT, DARK_REMAP } from "../lib/ascii";
import { useMotionReduced } from "../lib/useMotionReduced";

/**
 * Animated ASCII backdrop for "The First Law of Complexodynamics" (Aaronson,
 * 2011).
 *
 * The post's whole claim is about the shape of a curve: entropy climbs
 * monotonically to a plateau, while "complexity" (complextropy) is a hump that
 * is near-zero at the start and at equilibrium, high only in between. So the
 * backdrop is that chart, drawn as glowing halftone curves: a rising entropy
 * S-curve, a complexity hump with a blooming fill beneath it, and a vertical
 * "now" marker that sweeps across time, lighting the curves as it passes.
 */

const GLOW = "150,196,255"; // brightest blue, for the sweeping marker
const RAMP = " ·:•●◉";

function clamp(n: number, lo: number, hi: number) {
  return n < lo ? lo : n > hi ? hi : n;
}
function hash(x: number, y: number) {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

export default function ComplexodynamicsBackground({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useMotionReduced();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = reduced;
    const cell = CELL;
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.max(1, Math.floor(width * dpr));
      canvas!.height = Math.max(1, Math.floor(height * dpr));
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.font = `${cell}px "Geist Mono", ui-monospace, monospace`;

      const sectionH = height / 1.5; // matches the h-[150vh] mount
      const extra = height - sectionH; // spill above the section
      baseline = (height - sectionH * 0.15) / height; // time axis, low in paper 4
      topM = (extra - sectionH * 0.1) / height; // peaks rise up into paper 3
    }

    // Value-axis mapping (normalized canvas y). Set in resize: the canvas is
    // taller than the section and spills upward, so the time axis sits low in
    // this section and the curve peaks rise up across the seam into the coffee
    // section above.
    let topM = 0.16; // value = 1
    let baseline = 0.8; // value = 0 / time axis

    function paint(cx: number, cy: number, intensity: number, color: string, alpha: number) {
      const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(intensity * RAMP.length))];
      if (ch === " ") return;
      ctx!.fillStyle = `rgba(${dark ? (DARK_REMAP[color] ?? color) : color},${clamp(alpha, 0, 0.9)})`;
      ctx!.fillText(ch, (cx + 0.5) * cell, (cy + 0.5) * cell);
    }

    function frame(tms: number) {
      const t = tms / 1000;
      ctx!.clearRect(0, 0, width, height);
      const now = (t * 0.11) % 1; // sweeping time marker
      const lineHW = 1.5 / rows; // curve half-thickness, in normalized units

      for (let cy = 0; cy < rows; cy++) {
        const v = (cy + 0.5) / rows;
        for (let cx = 0; cx < cols; cx++) {
          const u = (cx + 0.5) / cols;

          // Entropy: monotonic S-curve. Complexity: a hump.
          const E = 1 / (1 + Math.exp(-9 * (u - 0.45)));
          const C = 0.9 * Math.exp(-Math.pow((u - 0.4) / 0.18, 2));
          const yE = baseline - E * (baseline - topM);
          const yC = baseline - C * (baseline - topM);
          const g = Math.exp(-Math.pow((u - now) / 0.06, 2)); // now-marker glow

          // Sweeping vertical marker (highest priority).
          if (Math.abs(u - now) < 1.0 / cols) {
            paint(cx, cy, 0.55, GLOW, 0.28 + 0.25 * (v < baseline ? 1 : 0));
            continue;
          }

          // Complexity curve (bright accent, lit by the marker).
          const dC = Math.abs(v - yC) / lineHW;
          if (dC < 1) {
            paint(cx, cy, 1 - dC, ACCENT, 0.4 + 0.4 * (1 - dC) + 0.45 * g);
            continue;
          }

          // Entropy curve (deep cobalt).
          const dE = Math.abs(v - yE) / lineHW;
          if (dE < 1) {
            paint(cx, cy, 1 - dE, BLUE, 0.35 + 0.4 * (1 - dE) + 0.4 * g);
            continue;
          }

          // Fill under the complexity hump: dots that bloom then thin out.
          if (v > yC && v < baseline && C > 0.05) {
            const depth = (v - yC) / (baseline - yC + 1e-6);
            const tw = 0.5 + 0.5 * Math.sin(t * 2 + hash(cx, cy) * 6.2831);
            const dens = C * (1 - 0.7 * depth) * (0.45 + 0.55 * tw);
            if (dens > 0.42) {
              paint(cx, cy, dens * 0.6, ACCENT, 0.12 + 0.22 * dens + 0.25 * g);
            }
            continue;
          }

          // Time axis baseline.
          if (Math.abs(v - baseline) < lineHW * 0.9) {
            paint(cx, cy, 0.4, BLUE, 0.18 + 0.3 * g);
          }
        }
      }
    }

    let raf = 0;
    let last = 0;
    let running = false;

    function loop(tms: number) {
      if (!running) return;
      if (tms - last >= 50) {
        frame(tms);
        last = tms;
      }
      raf = requestAnimationFrame(loop);
    }

    resize();
    if (reduce) frame(3000);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame(3000);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return;
        running = entry.isIntersecting;
        if (running) {
          last = 0;
          raf = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.2, rootMargin: "-20% 0px -20% 0px" }
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [dark, reduced]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
