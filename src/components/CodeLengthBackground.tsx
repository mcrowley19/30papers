import { useEffect, useRef } from "react";
import { CELL } from "../lib/ascii";

/**
 * Animated ASCII backdrop for "Keeping Neural Networks Simple by Minimizing
 * the Description Length of the Weights" (Hinton & van Camp, 1993).
 *
 * It diagrams Minimum Description Length: on the left, a dense, noisy field of
 * full-precision weights (varied ASCII glyphs that shimmer, because the weights
 * are noisy); toward the right that field collapses into a sparse lattice of
 * 0/1 bits, the short code. The frontier between "weights" and "bits" breathes,
 * and the sparsity on the right is literally the point: fewer marks = fewer bits.
 */

const BLUE = "30,64,175"; // deep cobalt, for the full-precision weights
const ACCENT = "96,165,250"; // lighter blue, for the compressed bits

// Weight glyphs, lightest to heaviest. Varied ASCII, not dots.
const RAW = "·-=+*%#@";

function hash(x: number, y: number) {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

export default function CodeLengthBackground({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    }

    function frame(tms: number) {
      const t = tms / 1000;
      ctx!.clearRect(0, 0, width, height);

      const boundary = 0.5 + 0.06 * Math.sin(t * 0.5); // breathing frontier
      const band = 0.14; // width of the raw -> bits transition

      for (let cy = 0; cy < rows; cy++) {
        const y = (cy + 0.5) * cell;
        for (let cx = 0; cx < cols; cx++) {
          const u = (cx + 0.5) / cols;
          const x = (cx + 0.5) * cell;
          // 0 = full-precision weights, 1 = compressed bits.
          const c = clamp01((u - (boundary - band)) / (2 * band));

          // Full-precision weights: dense, noisy, shimmering.
          if (c < 0.98) {
            const n = hash(cx, cy);
            const mag =
              0.5 + 0.5 * Math.sin(t * 1.3 + n * 6.2831 + hash(cy, cx) * 6.2831);
            if (mag > 0.16) {
              const ch = RAW[Math.min(RAW.length - 1, Math.floor(mag * RAW.length))];
              const a = (1 - c) * 0.5 * (0.45 + 0.55 * mag);
              if (a > 0.04) {
                ctx!.fillStyle = `rgba(${BLUE},${a})`;
                ctx!.fillText(ch, x, y);
              }
            }
          }

          // Compressed code: sparse 0/1 bits that twinkle.
          if (c > 0.02) {
            const s = hash(cx * 1.7 + 3.1, cy * 0.9 + 1.3);
            if (s < 0.34) {
              const flip = Math.floor(t * 1.4 + s * 12) % 2;
              const a = c * 0.55;
              ctx!.fillStyle = `rgba(${ACCENT},${a})`;
              ctx!.fillText(flip ? "1" : "0", x, y);
            }
          }
        }
      }
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

    resize();
    if (reduce) {
      frame(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) frame(0);
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
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
