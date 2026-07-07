import { useEffect, useState, type RefObject } from "react";

/** Thin progress bar fixed to the top of the viewport while reading a paper. */
export default function ReadingProgress({
  targetRef,
}: {
  targetRef: RefObject<HTMLElement | null>;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = targetRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrolled = -top;
      const range = height - window.innerHeight;
      if (range <= 0) {
        setProgress(top <= 0 ? 1 : 0);
        return;
      }
      setProgress(Math.max(0, Math.min(1, scrolled / range)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetRef]);

  if (progress <= 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-accent transition-[transform] duration-75"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  );
}
