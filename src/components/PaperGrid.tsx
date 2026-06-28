import { papers } from "../data/papers";
import PaperRow from "./PaperRow";

/**
 * The reading list, set as a quiet column of typeset specimen rows on warm
 * paper. The thumbnails are kept; everything else is drawn or typeset.
 */
export default function PaperGrid() {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <div className="divide-y divide-rule">
          {papers.map((paper) => (
            <PaperRow key={paper.slug} paper={paper} />
          ))}
        </div>
      </div>
    </section>
  );
}
