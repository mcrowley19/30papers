import { useState } from "react";
import { Link } from "react-router-dom";
import type { Paper } from "../data/papers";
import { motifFor, seedFor } from "../lib/motifs";
import MotifCanvas from "./MotifCanvas";

const CM = '"CMU Serif", "Newsreader", Georgia, serif';

/**
 * One full-viewport section per paper: a generative background themed to the
 * paper, with the thumbnail centred and the paper's information shown
 * permanently on either side (title/credit left, description right).
 */
export default function PaperSection({
  paper,
  index,
}: {
  paper: Paper;
  index: number;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
      {/* Generative themed background. */}
      <MotifCanvas
        motif={motifFor(paper.slug)}
        seed={seedFor(paper.slug)}
        className="absolute inset-0 h-full w-full"
      />
      {/* Legibility scrims. */}
      <div className="pointer-events-none absolute inset-0 bg-[#060606]/45" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, rgba(6,6,6,0) 30%, rgba(6,6,6,0.7) 100%)",
        }}
      />

      <div className="relative grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-12">
        {/* Left: ordinal, title, credit. */}
        <div className="order-2 text-center lg:order-1 lg:text-right">
          <div
            className="font-mono text-xs tracking-[0.3em] text-white/40"
            style={{ fontFamily: '"Geist Mono", ui-monospace, monospace' }}
          >
            {String(index + 1).padStart(2, "0")} / 27
          </div>
          <h2
            style={{ fontFamily: CM }}
            className="mt-3 text-2xl leading-tight text-white sm:text-3xl"
          >
            {paper.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            {paper.authors}
          </p>
          <p
            className="mt-1 font-mono text-xs tracking-[0.2em] text-white/40"
            style={{ fontFamily: '"Geist Mono", ui-monospace, monospace' }}
          >
            {paper.year}
          </p>
        </div>

        {/* Centre: the paper. */}
        <div className="order-1 flex justify-center lg:order-2">
          <Link
            to={`/papers/${paper.slug}`}
            aria-label={`${paper.title}. ${paper.blurb}`}
            className="group relative block w-[16rem] focus:outline-none sm:w-[19rem]"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[3px] bg-[#f6f4f0] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_40px_90px_-28px_rgba(0,0,0,0.95)]">
              {!imgFailed ? (
                <img
                  src={`/thumbnails/${paper.slug}.png`}
                  alt=""
                  onError={() => setImgFailed(true)}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col justify-between p-7">
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#6b6b6b]">
                    {paper.year}
                  </span>
                  <span className="font-serif text-xl leading-snug text-[#141414]">
                    {paper.title}
                  </span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Right: description and link. */}
        <div className="order-3 text-center lg:text-left">
          <p
            style={{ fontFamily: CM }}
            className="text-lg leading-relaxed text-white/85"
          >
            {paper.blurb}
          </p>
          <Link
            to={`/papers/${paper.slug}`}
            className="mt-6 inline-flex items-center gap-1.5 font-mono text-sm text-white/80 transition-colors hover:text-white"
            style={{ fontFamily: '"Geist Mono", ui-monospace, monospace' }}
          >
            Read
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3 8h9M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
