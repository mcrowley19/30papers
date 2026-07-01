import { papers as allPapers, type Paper } from "../data/papers";
import PaperRow from "./PaperRow";

/**
 * The reading list: a plain column of paper thumbnails going down the page.
 */
export default function PaperGrid({ items }: { items?: Paper[] }) {
  const papers = items ?? allPapers;
  return (
    <div className="mt-12">
      {papers.map((paper) => (
        <PaperRow key={paper.slug} paper={paper} />
      ))}
    </div>
  );
}
