import { papers } from "../data/papers";
import PaperCard from "./PaperCard";

export default function PaperGrid() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-32">
      <ul className="space-y-20 sm:space-y-28">
        {papers.map((paper) => (
          <PaperCard key={paper.slug} paper={paper} />
        ))}
      </ul>
    </section>
  );
}
