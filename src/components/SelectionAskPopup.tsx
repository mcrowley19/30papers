import type { RefObject } from "react";
import type { Paper } from "../data/papers";
import { useTextSelection } from "../hooks/useTextSelection";
import { buildAskPrompt, chatGptUrl, claudeUrl } from "../lib/askProviders";

interface SelectionAskPopupProps {
  paper: Pick<Paper, "title" | "authors" | "year">;
  containerRef: RefObject<HTMLElement | null>;
}

const POPUP_WIDTH = 88;
const POPUP_HEIGHT = 44;
const GAP = 10;

function popupPosition(rect: DOMRect) {
  const margin = 8;
  let left = rect.left + rect.width / 2 - POPUP_WIDTH / 2;
  let top = rect.top - POPUP_HEIGHT - GAP;

  left = Math.max(margin, Math.min(left, window.innerWidth - POPUP_WIDTH - margin));
  if (top < margin) top = rect.bottom + GAP;

  return { top, left };
}

function ChatGPTLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.899A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.163a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"
      />
    </svg>
  );
}

function ClaudeLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true">
      <path
        fill="#D97757"
        d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"
      />
    </svg>
  );
}

/**
 * Floating popup above a text selection with ChatGPT and Claude deep links.
 */
export default function SelectionAskPopup({ paper, containerRef }: SelectionAskPopupProps) {
  const { selection, clear } = useTextSelection(containerRef);

  if (!selection) return null;

  const prompt = buildAskPrompt(paper, selection.text);
  const pos = popupPosition(selection.rect);

  return (
    <div
      data-selection-ask
      role="toolbar"
      aria-label="Ask about selection"
      className="fixed z-50 flex items-center gap-0.5 rounded-full border border-rule bg-white p-1 shadow-[0_4px_20px_rgba(16,31,92,0.12)]"
      style={{ top: pos.top, left: pos.left }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <a
        href={chatGptUrl(prompt)}
        target="_blank"
        rel="noopener noreferrer"
        title="Explain with ChatGPT"
        aria-label="Explain with ChatGPT"
        onClick={clear}
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ChatGPTLogo />
      </a>
      <span className="h-4 w-px bg-rule" aria-hidden="true" />
      <a
        href={claudeUrl(prompt)}
        target="_blank"
        rel="noopener noreferrer"
        title="Explain with Claude"
        aria-label="Explain with Claude"
        onClick={clear}
        className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ClaudeLogo />
      </a>
    </div>
  );
}
