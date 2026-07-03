import { useState } from "react";
import { Link } from "react-router-dom";
import type { Paper } from "../data/papers";

/**
 * One paper in the list: just the thumbnail, centered.
 */
export default function PaperRow({ paper }: { paper: Paper }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link to={`/papers/${paper.slug}`} className="block py-10">
      <div className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden bg-neutral-100 shadow-xl">
        {!imgFailed ? (
          <img
            src={`/thumbnails/${paper.slug}.webp`}
            alt={paper.title}
            loading="lazy"
            decoding="async"
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
  );
}
