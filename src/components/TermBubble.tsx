import type { Term } from "../content/types";
import { useTermPanel } from "../context/TermPanelContext";

interface TermBubbleProps {
  term: Term;
  children: React.ReactNode;
}

/**
 * Inline, accessible bubble around a hard term. Clicking opens the side panel
 * with the term's explanation.
 */
export default function TermBubble({ term, children }: TermBubbleProps) {
  const { openTerm, activeTerm } = useTermPanel();
  const isActive = activeTerm?.term === term.term;

  return (
    <button
      type="button"
      onClick={() => openTerm(term)}
      aria-haspopup="dialog"
      aria-expanded={isActive}
      title={`What is "${term.term}"?`}
      className={[
        // Inherit the surrounding paper font; only the overlay marks the term.
        "mx-px inline rounded-[3px] px-1 py-px text-ink",
        "transition-colors duration-150",
        isActive
          ? "bg-ink/[0.16]"
          : "bg-ink/[0.06] hover:bg-ink/[0.12]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
