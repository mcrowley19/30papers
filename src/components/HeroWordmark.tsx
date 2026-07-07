import TitleAscii from "./TitleAscii";

/**
 * Landing wordmark. Mobile uses a WebP capture of the live halftone renderer —
 * pixel-identical to the desktop canvas. sm+ runs the animated canvas.
 */
export default function HeroWordmark() {
  return (
    <>
      <img
        src="/wordmark-mobile.png"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center sm:hidden"
      />
      <TitleAscii className="absolute inset-0 hidden h-full w-full sm:block" />
    </>
  );
}
