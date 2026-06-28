import { useEffect, useRef } from "react";

/**
 * The cover figure: self-attention drawn as thin line art. A row of token nodes
 * sits on a baseline; a query position sweeps across and sends faint curved
 * connections to every key, weighted like a softmax so a soft band of arcs
 * brightens around the focus. Monochrome, 1px strokes, slow. This is the figure
 * of "Attention Is All You Need", the keystone of the list, not a texture.
 *
 * Honours prefers-reduced-motion (single static frame) and only animates while
 * on screen.
 */
export default function CoverFigure({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const n = 17;
      const margin = Math.min(w * 0.16, 220);
      const span = w - margin * 2;
      const baseY = h * 0.6;
      const xs: number[] = [];
      for (let i = 0; i < n; i++) xs.push(margin + (span * i) / (n - 1));

      // Query sweeps slowly back and forth across the sequence.
      const q = (Math.sin(t * 0.16) * 0.5 + 0.5) * (n - 1);
      const sigma = 2.4;

      // Arcs from the query to every key, opacity ~ softmax around q.
      const qx = margin + (span * q) / (n - 1);
      for (let i = 0; i < n; i++) {
        const d = i - q;
        const wgt = Math.exp(-(d * d) / (2 * sigma * sigma));
        if (wgt < 0.015) continue;
        const x = xs[i];
        const lift = Math.min(h * 0.34, 60 + Math.abs(x - qx) * 0.42);
        ctx.beginPath();
        ctx.moveTo(qx, baseY);
        ctx.bezierCurveTo(qx, baseY - lift, x, baseY - lift, x, baseY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(244,243,238,${0.08 + wgt * 0.5})`;
        ctx.stroke();
      }

      // Baseline tokens: small open circles, the focused one filled.
      for (let i = 0; i < n; i++) {
        const x = xs[i];
        const d = i - q;
        const wgt = Math.exp(-(d * d) / (2 * sigma * sigma));
        ctx.beginPath();
        ctx.arc(x, baseY, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244,243,238,${0.22 + wgt * 0.6})`;
        ctx.fill();
      }

      // The query marker.
      ctx.beginPath();
      ctx.arc(qx, baseY, 3.4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(244,243,238,0.85)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    let raf = 0;
    let start = performance.now();
    let visible = true;
    const frame = (now: number) => {
      draw((now - start) / 1000);
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible && !reduce) raf = requestAnimationFrame(frame);
        else draw((performance.now() - start) / 1000);
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);
    frame(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
