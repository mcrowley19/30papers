import { useEffect, useRef } from "react";
import { CELL, BLUE, ACCENT, DARK_REMAP } from "../lib/ascii";

/**
 * Animated ASCII backdrop for the Kolmogorov Complexity chapter.
 *
 * An elementary cellular automaton (Rule 110, which is Turing-complete) evolves
 * from a single seed cell: a handful of rule bits plus one starting cell unfold,
 * generation by generation, into an intricate, endlessly varied pattern. That is
 * Kolmogorov complexity made visible -- the whole elaborate image has a tiny
 * description ("rule 110, this seed, N steps"), so its apparent complexity hides
 * a very short program. It scrolls as new generations are computed.
 */

const RULE = 110;

function nextGen(cur: Uint8Array, cols: number) {
  const next = new Uint8Array(cols);
  for (let i = 0; i < cols; i++) {
    const l = cur[(i - 1 + cols) % cols];
    const c = cur[i];
    const r = cur[(i + 1) % cols];
    const pattern = (l << 2) | (c << 1) | r;
    next[i] = (RULE >> pattern) & 1;
  }
  return next;
}

export default function KolmogorovBackground({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
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

    // Generation buffer: index 0 is the newest row (top).
    let buffer: Uint8Array[] = [];
    let N = 0;

    function build() {
      N = rows + 3;
      let cur = new Uint8Array(cols);
      cur[Math.floor(cols * 0.68)] = 1; // a single seed cell
      const warm = cols + N; // evolve enough to fill the torus, then keep last N
      const gens: Uint8Array[] = [];
      for (let g = 0; g < warm; g++) {
        gens.push(cur);
        cur = nextGen(cur, cols);
      }
      buffer = gens.slice(warm - N).reverse(); // newest first
    }

    function advance() {
      buffer.unshift(nextGen(buffer[0], cols));
      buffer.pop();
    }

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
      build();
    }

    let off = 0; // scroll offset in px, 0..cell

    function render() {
      ctx!.clearRect(0, 0, width, height);
      for (let i = 0; i < buffer.length; i++) {
        const row = buffer[i];
        const yc = (i - 1) * cell + off + cell / 2;
        if (yc < -cell || yc > height + cell) continue;
        // Start crisply at the top edge (butting against the section above);
        // only soft-feather the bottom edge.
        const edge = Math.min(1, (height - yc) / (height * 0.16));
        if (edge <= 0) continue;
        for (let cx = 0; cx < cols; cx++) {
          if (!row[cx]) continue;
          const l = row[(cx - 1 + cols) % cols];
          const r = row[(cx + 1) % cols];
          const dense = l && r;
          const isolated = !l && !r;
          const ch = dense ? "◉" : "●";
          const color = isolated ? ACCENT : BLUE;
          const a = (dense ? 0.6 : 0.45) * edge;
          ctx!.fillStyle = `rgba(${dark ? DARK_REMAP[color] : color},${a})`;
          ctx!.fillText(ch, (cx + 0.5) * cell, yc);
        }
      }
    }

    let raf = 0;
    let running = true;
    let lastT = 0;
    const speed = cell * 2.4; // px per second (~2.4 generations/sec)

    function loop(tms: number) {
      if (!running) return;
      const dt = lastT ? Math.min(0.1, (tms - lastT) / 1000) : 0;
      lastT = tms;
      off += speed * dt;
      while (off >= cell) {
        advance();
        off -= cell;
      }
      render();
      raf = requestAnimationFrame(loop);
    }

    resize();
    if (reduce) render();
    else raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) render();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return;
        running = entry.isIntersecting;
        if (running) {
          lastT = 0;
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
  }, [dark]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
