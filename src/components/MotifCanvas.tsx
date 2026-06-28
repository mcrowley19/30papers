import { useEffect, useRef } from "react";
import { MOTIFS, type MotifKey } from "../lib/motifs";

/**
 * Renders a generative motif on a canvas that fills its parent. Animates with
 * requestAnimationFrame only while on screen (IntersectionObserver), and draws
 * a single static frame for users who prefer reduced motion.
 */
export default function MotifCanvas({
  motif,
  seed,
  className,
}: {
  motif: MotifKey;
  seed: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const draw = MOTIFS[motif];
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

    let raf = 0;
    let start = performance.now();
    let visible = false;

    const frame = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, (now - start) / 1000, seed);
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduce) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(frame);
        } else {
          cancelAnimationFrame(raf);
          // keep last frame painted; draw once so it is never blank
          frame(performance.now());
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);

    // initial paint
    frame(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [motif, seed]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
