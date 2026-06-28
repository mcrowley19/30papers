import { useState } from "react";
import { Link } from "react-router-dom";
import type { Paper } from "../data/papers";
import { figureFor } from "../lib/figures";
import LineFigure from "./LineFigure";

/**
 * One paper, set as a typeset specimen row: the kept thumbnail on the left, and
 * a column of serif title, mono author/year, blurb, and a small per-paper
 * line-art glyph. Calm and editorial, not a full screen per paper.
 */
export default function PaperRow({ paper }: { paper: Paper }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="grid grid-cols-[4.5rem_1fr] gap-x-6 gap-y-4 py-12 sm:grid-cols-[8rem_1fr] sm:gap-x-10 sm:py-16">
      {/* The kept thumbnail. */}
      <Link
        to={`/papers/${paper.slug}`}
        aria-label={`${paper.title}. ${paper.blurb}`}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-paper-raised shadow-[0_14px_34px_-22px_rgba(20,18,14,0.7)] ring-1 ring-ink/10 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_22px_46px_-22px_rgba(20,18,14,0.78)]">
          {!imgFailed ? (
            <img
              src={`/thumbnails/${paper.slug}.png`}
              alt=""
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-3">
              <span className="font-techmono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
                {paper.year}
              </span>
              <span className="font-serif text-sm leading-snug text-ink">
                {paper.title}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* The typeset record. */}
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <p className="font-techmono text-xs leading-relaxed tracking-[0.04em] text-muted">
            {paper.authors}
            <span className="px-1.5 text-faint">/</span>
            <span className="text-ink">{paper.year}</span>
          </p>
          <LineFigure
            figure={figureFor(paper.slug)}
            className="mt-0.5 h-7 w-11 shrink-0 text-accent"
            title={`Figure for ${paper.title}`}
          />
        </div>

        <h2 className="mt-2.5 text-pretty font-serif text-2xl leading-tight text-ink sm:text-3xl">
          <Link to={`/papers/${paper.slug}`} className="transition-colors hover:text-accent">
            {paper.title}
          </Link>
        </h2>

        <p className="mt-3 max-w-prose text-pretty font-serif text-base leading-relaxed text-ink-soft sm:text-lg">
          {paper.blurb}
        </p>

        <Link
          to={`/papers/${paper.slug}`}
          className="group mt-5 inline-flex items-center gap-1.5 font-techmono text-xs tracking-[0.04em] text-accent transition-colors hover:text-accent-deep"
        >
          Read
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
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
    </article>
  );
}
