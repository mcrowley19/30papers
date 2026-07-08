import { useEffect, useRef } from "react";
import { CELL, hash } from "../lib/ascii";
import { useMotionReduced } from "../lib/useMotionReduced";

/**
 * Halftone ASCII backdrop for "The Coffee Automaton" (Aaronson, Carroll &
 * Ouellette, 2014).
 *
 * Not line art: a dense grid of varied glyphs, each picked from a tonal density
 * ramp, builds up a fully shaded coffee mug (barrel body with roundness
 * lighting, coffee surface, handle, saucer). Steam rises from the rim, widens
 * and curls into turbulent eddies, then dissipates -- the paper's rise and fall
 * of complexity, mapped onto the vertical steam column. The mug is static, so
 * it is rendered once; only the steam band repaints each frame.
 */

// Density ramp, light -> dark. Varied glyphs give the dithered, tonal look.
const RAMP = " .'^\":;~=+ox*?%#@█▓";

const DEEP = [22, 52, 150]; // dark, dense areas
const LIGHT = [150, 196, 255]; // highlights
const STEAM_GLOW = [165, 208, 255];

function clamp(n: number, lo: number, hi: number) {
  return n < lo ? lo : n > hi ? hi : n;
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function CoffeeAutomatonBackground({
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
    const cell = CELL; // shared grid so all backdrops read as one continuation
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;

    // Mug geometry in pixels, set on resize.
    let cx = 0;
    let top = 0; // rim y
    let bot = 0; // saucer y
    let cupH = 0;
    let cupHalf = 0;
    let steamRows = 0; // grid rows above the rim (the animated band)

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

      // The canvas is 1.5x the section tall and anchored to the section bottom,
      // so it spills half a section upward into the section above. Derive the
      // section height from the measured canvas height (no innerHeight guess),
      // and pin the mug to the section bottom so it can never drift off-canvas.
      const sectionH = height / 1.5; // keep in sync with the h-[150vh] mount
      cupHalf = Math.min(width, sectionH) * 0.15;
      cupH = cupHalf * 2.3;
      // Keep the whole cup (body + handle) on-screen with a margin, but as far
      // right as it fits.
      cx = Math.min(width * 0.8, width - (cupHalf * 1.02 + cupH * 0.36) - cell * 2);
      bot = height - sectionH * 0.1; // base ~90% down the section
      top = bot - cupH;
      steamRows = Math.max(0, Math.floor(top / cell)); // steam fills up into the section above
    }

    // Shaded darkness (0..1) of the mug at a pixel. 0 = nothing here.
    function mugTone(px: number, py: number) {
      let d = 0;

      // Body: tapered barrel with left-lit roundness.
      const s = (py - top) / cupH; // 0 rim .. 1 base
      if (s >= 0 && s <= 1) {
        const hw = cupHalf * (1 - 0.16 * s) * (0.97 + 0.06 * Math.sin(s * Math.PI));
        const nx = (px - cx) / hw;
        if (Math.abs(nx) <= 1) {
          const round = Math.sqrt(1 - nx * nx); // 1 centre -> 0 edge
          // Mostly solid so the cup reads as a silhouette; subtle left-lit
          // roundness on top of a high base darkness.
          const bd = 0.7 + 0.2 * nx + 0.08 * (1 - round);
          d = Math.max(d, clamp(bd, 0.5, 0.96));
        }
      }

      // Rim opening / coffee surface ellipse.
      {
        const ex = (px - cx) / cupHalf;
        const ey = (py - top) / (cupHalf * 0.36);
        const r2 = ex * ex + ey * ey;
        if (r2 <= 1) {
          const lip = r2 > 0.72 ? 0.42 : 0; // lighter lip ring
          d = Math.max(d, clamp(0.9 - 0.22 * ey - lip, 0.18, 0.97));
        }
      }

      // Handle ring on the right.
      {
        const hx = px - (cx + cupHalf * 1.02);
        const hy = py - (top + cupH * 0.46);
        const rr = Math.hypot(hx, hy);
        const R = cupH * 0.36;
        const ri = cupH * 0.22;
        if (px > cx && rr <= R && rr >= ri) {
          d = Math.max(d, clamp(0.62 + 0.25 * (hx / R), 0.5, 0.9));
        }
      }

      // Saucer ellipse band at the base.
      {
        const ex = (px - cx) / (cupHalf * 1.7);
        const ey = (py - bot) / (cupHalf * 0.3);
        const r2 = ex * ex + ey * ey;
        if (r2 <= 1 && r2 >= 0.2) {
          d = Math.max(d, clamp(0.5 - 0.25 * ey, 0.2, 0.72));
        }
      }

      return d;
    }

    function paintCell(px: number, py: number, d: number, glow: number, steam = false) {
      const idx = Math.min(RAMP.length - 1, Math.floor(d * RAMP.length));
      const ch = RAMP[idx];
      if (ch === " ") return;
      const a = clamp(0.22 + 0.72 * d, 0, 0.96);
      // Steam stays light/airy even when thick; the mug ranges to deep navy on
      // the white paper pages, or to warm cream on the dark landing ground.
      const lo = steam ? (dark ? [150, 175, 240] : [188, 218, 255]) : dark ? [130, 160, 235] : LIGHT;
      const hi = steam ? (dark ? [225, 232, 255] : [120, 170, 248]) : dark ? [238, 226, 186] : DEEP;
      let r = lerp(lo[0], hi[0], d);
      let g = lerp(lo[1], hi[1], d);
      let b = lerp(lo[2], hi[2], d);
      if (glow > 0) {
        const gc = dark ? [247, 209, 138] : STEAM_GLOW;
        r = lerp(r, gc[0], glow);
        g = lerp(g, gc[1], glow);
        b = lerp(b, gc[2], glow);
      }
      ctx!.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
      ctx!.fillText(ch, px, py);
    }

    // The static mug, drawn once (from the rim downward).
    function renderMug() {
      for (let cyi = steamRows; cyi < rows; cyi++) {
        const py = (cyi + 0.5) * cell;
        for (let cxi = 0; cxi < cols; cxi++) {
          const px = (cxi + 0.5) * cell;
          const d = mugTone(px, py);
          if (d > 0.02) paintCell(px, py, d, 0);
        }
      }
    }

    const emitters = [-2.2, -0.7, 0.7, 2.2];
    const phases = [0, 1.6, 3.2, 4.8];

    // The animated steam band above the rim.
    function renderSteam(t: number) {
      ctx!.clearRect(0, 0, width, top);
      const emCx = cx / cell; // emitter centre in grid cols
      for (let cyi = 0; cyi < steamRows; cyi++) {
        const py = (cyi + 0.5) * cell;
        const hh = steamRows - cyi; // grid rows above rim
        const fade = Math.exp(-hh * 0.022); // slow decay: steam reaches the top
        const feather = clamp(cyi / 3, 0, 1); // soften only the very top edge
        const turb = Math.min(1, hh * 0.05);
        const widthCells = 2.2 + hh * 0.18;
        for (let cxi = 0; cxi < cols; cxi++) {
          let raw = 0;
          for (let e = 0; e < emitters.length; e++) {
            const ph = phases[e];
            const sway = Math.sin(t * 0.55 + ph + cxi * 0.07) * Math.min(hh * 0.1, 2.5);
            const swirl = Math.sin(t * 0.4 + ph * 1.7 + hash(cxi, cyi) * 6.28) * Math.min(hh * 0.08, 1.8);
            const center = emCx + emitters[e] + sway + swirl;
            const dx = (cxi + 0.5 - center) / widthCells;
            raw += Math.exp(-dx * dx);
          }
          raw = Math.min(1, raw * 1.2);
          const env = fade * feather;
          const disp = raw * env;
          const edge = 4 * raw * (1 - raw);
          const glow = edge * turb * env;
          if (disp < 0.03 && glow < 0.03) continue;
          const d = clamp(disp * 0.85 + glow * 0.6, 0, 0.92);
          if (d < 0.03) continue;
          paintCell((cxi + 0.5) * cell, py, d, Math.min(1, glow * 1.9), true);
        }
      }
    }

    let raf = 0;
    let last = 0;
    let running = false;

    function loop(tms: number) {
      if (!running) return;
      if (tms - last >= 50) {
        renderSteam(tms / 1000);
        last = tms;
      }
      raf = requestAnimationFrame(loop);
    }

    function start() {
      resize();
      renderMug();
      if (reduce) renderSteam(3);
    }
    start();

    const ro = new ResizeObserver(() => {
      ctx!.clearRect(0, 0, width, height);
      resize();
      renderMug();
      if (reduce) renderSteam(3);
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
