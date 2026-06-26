import { useState } from "react";
import { Link } from "react-router-dom";
import type { Paper } from "../data/papers";

interface PaperCardProps {
  paper: Paper;
}

export default function PaperCard({ paper }: PaperCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <li>
      <Link
        to={`/papers/${paper.slug}`}
        className="group relative mx-auto block w-[20rem] focus:outline-none sm:w-[24rem]"
        aria-label={`${paper.title}. ${paper.blurb}`}
      >
        {/* The paper, always visible and never covered */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[3px] bg-[#f6f4f0] shadow-[0_18px_50px_-24px_rgba(20,20,20,0.45)]">
          {!imgFailed ? (
            <img
              src={`/thumbnails/${paper.slug}.png`}
              alt=""
              onError={() => setImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              <span className="font-sans text-xs uppercase tracking-[0.18em] text-muted">
                {paper.year}
              </span>
              <span className="font-serif text-2xl leading-snug text-ink">
                {paper.title}
              </span>
            </div>
          )}
        </div>

        {/* The black tab that extends out to the RIGHT of the paper on hover. */}
        <div className="absolute left-full top-0 h-full w-0 overflow-hidden rounded-r-[3px] bg-ink transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-[20rem] group-focus-visible:w-[20rem] sm:group-hover:w-[24rem] sm:group-focus-visible:w-[24rem]">
          <div className="absolute inset-y-0 left-0 flex w-[20rem] flex-col justify-center px-8 opacity-0 transition-opacity duration-300 [transition-delay:160ms] group-hover:opacity-100 group-focus-visible:opacity-100 sm:w-[24rem] sm:px-10">
            <h3 className="font-serif text-2xl leading-tight text-paper">
              {paper.title}
            </h3>
            <p className="mt-2 font-sans text-[0.8rem] leading-snug text-paper/55">
              {paper.authors} · {paper.year}
            </p>
            <p className="mt-4 font-sans text-[0.95rem] leading-relaxed text-paper/75">
              {paper.blurb}
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm text-paper/90">
              Read
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 8h9M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
