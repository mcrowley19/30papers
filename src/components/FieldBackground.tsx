import { useEffect, useRef } from "react";
import { CELL, DARK_REMAP, DOTS, glyphFor } from "../lib/ascii";

/**
 * Shared engine for the paper backdrops. Handles canvas sizing, the ~30fps
 * loop, pausing off-screen, and the reduced-motion static frame, then delegates
 * the actual drawing to a per-paper `draw` function. Keeps every backdrop on
 * the same grid so they read as one continuous halftone.
 *
 * `draw` must be a stable (module-level) reference.
 */
export interface FieldEnv {
  t: number; // seconds
  cols: number;
  rows: number;
  cell: number;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  /** Draw a glyph at grid cell (cx, cy). */
  paint: (cx: number, cy: number, glyph: string, color: string, alpha: number) => void;
  /** Draw a density-ramp glyph for an intensity at grid cell (cx, cy). */
  dot: (cx: number, cy: number, intensity: number, color: string, alpha: number, ramp?: string) => void;
}

export default function FieldBackground({
  className = "",
  draw,
  cell: cellProp = CELL,
  dark = false,
}: {
  className?: string;
  draw: (env: FieldEnv) => void;
  /** Grid spacing override, e.g. a finer grid for the title wordmark. */
  cell?: number;
  /** Remap the core palette for the dark cobalt landing page. */
  dark?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cell = cellProp;
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;

    const paint = (cx: number, cy: number, glyph: string, color: string, alpha: number) => {
      if (!glyph || glyph === " " || alpha <= 0.02) return;
      const c = dark ? (DARK_REMAP[color] ?? color) : color;
      ctx!.fillStyle = `rgba(${c},${alpha > 0.95 ? 0.95 : alpha})`;
      ctx!.fillText(glyph, (cx + 0.5) * cell, (cy + 0.5) * cell);
    };
    const dot = (
      cx: number,
      cy: number,
      intensity: number,
      color: string,
      alpha: number,
      ramp = DOTS
    ) => paint(cx, cy, glyphFor(intensity, ramp), color, alpha);

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
    }

    function frame(tms: number) {
      ctx!.clearRect(0, 0, width, height);
      draw({ t: tms / 1000, cols, rows, cell, width, height, ctx: ctx!, paint, dot });
    }

    let raf = 0;
    let last = 0;
    let running = true;
    function loop(tms: number) {
      if (!running) return;
      if (tms - last >= 33) {
        frame(tms);
        last = tms;
      }
      raf = requestAnimationFrame(loop);
    }

    const redraw = () => {
      resize();
      if (reduce) frame(0);
    };

    // Layout and web fonts can settle after first paint on mobile; redraw once
    // both are ready so the title mask is not built from an empty canvas.
    redraw();
    requestAnimationFrame(redraw);
    void document.fonts?.ready.then(() => {
      redraw();
      if (!reduce) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    });
    if (!reduce) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      redraw();
    });
    ro.observe(canvas);
    const parent = canvas.parentElement;
    if (parent) ro.observe(parent);

    const io = new IntersectionObserver(
      ([e]) => {
        if (reduce) return;
        running = e.isIntersecting;
        if (running) {
          last = 0;
          raf = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [draw, cellProp, dark]);

  return <canvas ref={ref} className={`block ${className}`} aria-hidden="true" />;
}
