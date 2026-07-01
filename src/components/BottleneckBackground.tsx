import { useEffect, useRef } from "react";
import { CELL } from "../lib/ascii";

/**
 * Animated ASCII backdrop for the Variational Lossy Autoencoder section.
 *
 * It diagrams the paper: a dense field on the left (the input x) streams
 * rightward, funnels through a narrow waist (the latent z, drawn in accent),
 * then fans back out as a deliberately coarser, dimmer reconstruction (lossy).
 * Marks are monospace glyphs picked from a density ramp, so it reads as ASCII
 * halftone rather than generative noise.
 */

const INK = "30,64,175"; // deep cobalt blue, for the streaming field
const ACCENT = "96,165,250"; // lighter blue, for the latent z at the waist

// Density ramp, lightest to heaviest.
const RAMP = " ·:•●◉";

export default function BottleneckBackground({
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

    // Hourglass envelope: half-height of the stream as a fraction of the
    // viewport. Wide at the edges, pinched to a waist at the centre.
    function bandHalf(u: number) {
      const k = Math.abs(2 * u - 1); // 0 at centre, 1 at the edges
      const min = 0.05;
      const max = 0.46;
      return min + (max - min) * Math.pow(k, 1.7);
    }

    function frame(tms: number) {
      const t = tms / 1000;
      ctx!.clearRect(0, 0, width, height);

      for (let cy = 0; cy < rows; cy++) {
        const v = (cy + 0.5) / rows;
        for (let cx = 0; cx < cols; cx++) {
          const u = (cx + 0.5) / cols;
          const half = bandHalf(u);
          const dy = (v - 0.5) / half; // distance from centreline, in band units
          const waist = Math.exp(-Math.pow((u - 0.5) / 0.045, 2));
          const isLatent = waist > 0.25;

          if (Math.abs(dy) > 1.15 && !isLatent) continue;

          // Soft fade toward the band edge.
          const edge = Math.max(0, 1 - Math.abs(dy));

          // A wave travelling left -> right through the bottleneck.
          const flow = 0.5 + 0.5 * Math.sin((u * 9 - t * 1.1) * Math.PI * 2 + dy * 1.4);

          // Lossy reconstruction: dimmer and pocked with gaps past the waist.
          let loss = 1;
          if (u > 0.5) {
            loss = 0.6;
            if ((cx * 7 + cy * 13) % 3 === 0) loss *= 0.35;
          }

          let intensity = edge * flow * loss;
          if (isLatent) intensity = Math.max(intensity, 0.65 * waist);

          if (intensity < 0.07) continue;

          const lvl = Math.min(RAMP.length - 1, Math.floor(intensity * RAMP.length));
          const ch = RAMP[lvl];
          if (ch === " ") continue;

          const x = (cx + 0.5) * cell;
          const y = (cy + 0.5) * cell;
          const alpha = Math.min(0.55, (isLatent ? 0.8 : 0.5) * intensity);
          ctx!.fillStyle = `rgba(${isLatent ? ACCENT : INK},${alpha})`;
          ctx!.fillText(ch, x, y);
        }
      }
    }

    let raf = 0;
    let last = 0;
    let running = true;

    function loop(tms: number) {
      if (!running) return;
      if (tms - last >= 33) {
        // ~30fps
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

    // Only animate while the section is on screen.
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
