import TokenStream from "./TokenStream";

// The wordmark set like the title at the top of a research paper: Computer
// Modern (TeX's default, shipped with KaTeX as "KaTeX_Main"), regular weight,
// black, centered. Only the title streams in on first load; the abstract is
// static.
const CM = '"KaTeX_Main", "Latin Modern Roman", "Times New Roman", serif';

export default function Hero() {
  return (
    <header className="mx-auto max-w-4xl px-6 pt-32 pb-16 text-center sm:pt-40 md:pt-48">
      <TokenStream
        segments={[
          {
            text: "30 papers",
            as: "h1",
            ariaLabel: "30 papers",
            style: { fontFamily: CM, fontWeight: 400 },
            className:
              "text-[#0a0a0a] leading-[1.0] tracking-[-0.01em] text-[18vw] sm:text-[6rem] md:text-[7.5rem]",
          },
        ]}
      />

      <p
        style={{ fontFamily: CM }}
        className="mx-auto mt-9 max-w-2xl text-lg leading-relaxed text-[#2a2a2a] sm:text-xl"
      >
        The rumoured list that Ilya Sutskever gave to John Carmack which teaches
        90% of modern Deep Learning.
      </p>
    </header>
  );
}
