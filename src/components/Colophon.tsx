import LineFigure from "./LineFigure";

// Computer Modern, the typeface the papers themselves are set in.
const CM = '"CMU Serif", "Newsreader", Georgia, serif';
const MONO = '"Geist Mono", ui-monospace, monospace';

/**
 * A short typeset intro that bridges the dark cover and the light reading list.
 * It states what the collection is and how it is set: a printed monograph in
 * Computer Modern, with each paper's idea redrawn as thin line art. No filler,
 * no "scroll" prompt; just the colophon note a specimen page would carry.
 */
export default function Colophon() {
  return (
    <section className="bg-[#f3f0ea] text-[#1a1916]">
      <div className="mx-auto max-w-3xl px-6 pt-20 sm:pt-28">
        <p
          style={{ fontFamily: MONO }}
          className="text-[0.7rem] uppercase tracking-[0.18em] text-[#a45a32]"
        >
          The reading list
        </p>

        <p
          style={{ fontFamily: CM }}
          className="mt-5 max-w-2xl text-pretty text-2xl leading-snug text-[#1a1916] sm:text-3xl"
        >
          The works that carry modern deep learning, gathered as a printed
          monograph. Compression and complexity, vision, recurrence, attention,
          and scale, read in one quiet sitting.
        </p>

        <div className="mt-10 flex items-start gap-5 border-t border-[#ddd7cc] pt-8">
          <LineFigure
            figure="attention"
            className="mt-0.5 h-9 w-14 shrink-0 text-[#a45a32]"
            title="Attention figure, drawn as line art"
          />
          <p
            style={{ fontFamily: MONO }}
            className="max-w-prose text-xs leading-relaxed tracking-[0.02em] text-[#6f6a60]"
          >
            Set in Computer Modern, the typeface of the papers themselves. Every
            entry keeps its title page and pairs with one precise figure of its
            central idea, redrawn here as line art rather than reproduced.
          </p>
        </div>
      </div>
    </section>
  );
}
