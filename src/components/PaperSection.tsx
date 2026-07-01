import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Paper } from "../data/papers";

/**
 * A full-viewport section for one paper: an animated ASCII backdrop (passed in,
 * one per paper) with the paper's thumbnail filling the view on top of it.
 */
export default function PaperSection({
  paper,
  background,
  overflowVisible = false,
}: {
  paper: Paper;
  background: ReactNode;
  /** Let the backdrop spill out of the section (e.g. steam rising into the
   *  section above). Defaults to clipped. */
  overflowVisible?: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section
      className={`relative flex min-h-screen items-center justify-center bg-white ${
        overflowVisible ? "overflow-visible" : "overflow-hidden"
      }`}
    >
      {background}

      <Link to={`/papers/${paper.slug}`} className="relative z-10 block">
        <div className="relative aspect-[3/4] h-[82vh] overflow-hidden bg-neutral-100 shadow-2xl">
          {!imgFailed ? (
            <img
              src={`/thumbnails/${paper.slug}.png`}
              alt={paper.title}
              onError={() => setImgFailed(true)}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-6 text-center font-serif text-lg leading-snug">
              {paper.title}
            </span>
          )}
        </div>
      </Link>
    </section>
  );
}
