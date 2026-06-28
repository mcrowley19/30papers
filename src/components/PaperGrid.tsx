import { papers } from "../data/papers";
import PaperSection from "./PaperSection";

export default function PaperGrid() {
  return (
    <div>
      {papers.map((paper, i) => (
        <PaperSection key={paper.slug} paper={paper} index={i} />
      ))}
    </div>
  );
}
