import LineFigure from "./LineFigure";
import Reveal from "./Reveal";

/**
 * A short typeset intro that bridges the dark cover and the light reading list.
 * It states what the collection is and how it is set: a printed monograph in
 * Computer Modern, with each paper's idea redrawn as thin line art. No filler,
 * no "scroll" prompt; just the colophon note a specimen page would carry.
 */
export default function Colophon() {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-6 pt-20 sm:pt-28">
        <Reveal>
          <p className="font-techmono text-[0.7rem] uppercase tracking-[0.18em] text-accent">
            The reading list
          </p>
        </Reveal>

        <Reveal delay={90}>
          <p className="mt-5 max-w-2xl text-pretty font-serif text-2xl leading-snug text-ink sm:text-3xl">
            The works that carry modern deep learning, gathered as a printed
            monograph. Start with foundations and vision, move through sequences
            and attention, then scale and the compression theory that ties it
            all together.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-10 flex items-start gap-5 border-t border-rule pt-8">
            <LineFigure
              figure="attention"
              className="mt-0.5 h-9 w-14 shrink-0 text-accent"
              title="Attention figure, drawn as line art"
            />
            <p className="max-w-prose font-techmono text-xs leading-relaxed tracking-[0.02em] text-muted">
              Set in Computer Modern, the typeface of the papers themselves. Every
              entry keeps its title page and pairs with one precise figure of its
              central idea, redrawn here as line art rather than reproduced.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
