import TitleAscii from "./TitleAscii";

/**
 * Landing wordmark: a reliable CSS treatment on phones (canvas halftone can fail
 * to rasterize before fonts settle), full animated halftone from sm breakpoint up.
 */
export default function HeroWordmark() {
  return (
    <>
      <span
        aria-hidden="true"
        className="title-extrude mx-auto block max-w-full px-3 text-center font-tech text-[clamp(2.75rem,13.5vw,4.25rem)] font-bold leading-[0.95] tracking-[-0.02em] sm:hidden"
      >
        30 papers
      </span>
      <TitleAscii className="absolute inset-0 hidden h-full w-full sm:block" />
    </>
  );
}
