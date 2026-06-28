import type { CSSProperties, ReactNode } from "react";
import { useInView, usePrefersReducedMotion } from "../lib/useInView";

/**
 * Wraps a block so it fades and rises into place the first time it scrolls into
 * view, using the shared `fade-up` keyframe. The `opacity-0` base is kept under
 * the animation so an optional `delay` holds the element hidden until its turn
 * rather than flashing in. Honours reduced motion by rendering the settled state
 * with no entrance animation.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const style: CSSProperties | undefined =
    inView && delay ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <div
      ref={ref}
      style={style}
      className={`opacity-0 ${inView ? "animate-fade-up" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
