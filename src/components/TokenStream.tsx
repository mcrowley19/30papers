import { useEffect, useState, type CSSProperties } from "react";

export interface StreamSegment {
  text: string;
  as: "h1" | "p";
  className?: string;
  style?: CSSProperties;
  /** Full text for screen readers (the visible text is revealed gradually). */
  ariaLabel?: string;
}

// Module-level: the intro plays once per full page load, not on SPA navigations.
let hasPlayed = false;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Reveals styled text the way an LLM streams tokens: one character at a time on
 * a slow, slightly irregular cadence, with a block caret riding the end. An
 * invisible full-text copy reserves the final size up front, so the rest of the
 * page never shifts, and the visible text sweeps in from the left into place.
 */
export default function TokenStream({ segments }: { segments: StreamSegment[] }) {
  const total = segments.reduce((n, s) => n + s.text.length, 0);
  const skip = hasPlayed || prefersReducedMotion();
  const [revealed, setRevealed] = useState(skip ? total : 0);
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;
    let n = 0;
    let timer: number;
    const tick = () => {
      n += 1; // one character per tick for a slow, deliberate reveal
      if (n >= total) {
        setRevealed(total);
        setDone(true);
        hasPlayed = true;
        return;
      }
      setRevealed(n);
      timer = window.setTimeout(tick, 120 + Math.random() * 120);
    };
    timer = window.setTimeout(tick, 320);
    return () => window.clearTimeout(timer);
  }, [skip, total]);

  let offset = 0;
  return (
    <>
      {segments.map((seg, i) => {
        const start = offset;
        offset += seg.text.length;
        const visible = done ? seg.text : seg.text.slice(0, Math.max(0, revealed - start));
        const active = !done && revealed > start && revealed <= offset;
        const Tag = seg.as;
        return (
          <Tag
            key={i}
            className={seg.className}
            style={seg.style}
            aria-label={seg.ariaLabel}
          >
            <span className="relative inline-block whitespace-nowrap align-top">
              {/* Sizer: reserves the final footprint so the page never shifts. */}
              <span className="invisible" aria-hidden="true">
                {seg.text}
              </span>
              {/* The streamed text, anchored to the title's left edge. */}
              <span className="absolute left-0 top-0" aria-hidden="true">
                {visible}
                {active && <span className="token-caret" aria-hidden="true" />}
              </span>
            </span>
          </Tag>
        );
      })}
    </>
  );
}
