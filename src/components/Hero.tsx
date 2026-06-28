import TokenStream from "./TokenStream";
import CoverFigure from "./CoverFigure";

// Computer Modern, the typeface arXiv/LaTeX papers are set in. The whole site
// borrows it, so the cover is set in the same hand as the works it gathers.
const CM = '"CMU Serif", "Newsreader", Georgia, serif';

export default function Hero() {
  return (
    <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0e0e0d] px-6 text-center">
      {/* The figure of attention, drawn as thin line art behind the title. */}
      <CoverFigure className="pointer-events-none absolute inset-0 h-full w-full opacity-90" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 46%, rgba(14,14,13,0) 30%, rgba(14,14,13,0.86) 100%)",
        }}
      />

      <div className="relative">
        <TokenStream
          segments={[
            {
              text: "30 papers",
              as: "h1",
              ariaLabel: "30 papers",
              style: {
                fontFamily: CM,
                fontWeight: 400,
                color: "#f5f3ee",
                textShadow: "0 2px 50px rgba(0,0,0,0.6)",
              },
              className:
                "leading-[1.0] tracking-[-0.015em] text-[19vw] sm:text-[6.5rem] md:text-[8rem]",
            },
          ]}
        />

        <p
          style={{ fontFamily: CM, color: "#d8d6cf" }}
          className="mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl"
        >
          The reading list Ilya Sutskever gave John Carmack, said to carry
          ninety percent of what matters in modern deep learning.
        </p>

        <p
          style={{ fontFamily: '"Geist Mono", ui-monospace, monospace' }}
          className="mx-auto mt-7 text-xs font-medium uppercase text-[#8a877e]"
        >
          Twenty-seven works, hosted in full
        </p>
      </div>
    </header>
  );
}
