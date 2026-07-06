import { useCallback, useEffect, useState, type RefObject } from "react";

export interface TextSelectionState {
  text: string;
  rect: DOMRect;
}

const MIN_LENGTH = 12;
const MAX_LENGTH = 4000;

function readSelection(container: HTMLElement): TextSelectionState | null {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;

  const range = sel.getRangeAt(0);
  if (!container.contains(range.commonAncestorContainer)) return null;

  const text = sel.toString().replace(/\s+/g, " ").trim();
  if (text.length < MIN_LENGTH || text.length > MAX_LENGTH) return null;

  const rect = range.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;

  return { text, rect };
}

/**
 * Tracks non-empty text selections inside a container. Clears on scroll,
 * outside clicks, and when the selection leaves the container.
 */
export function useTextSelection(containerRef: RefObject<HTMLElement | null>) {
  const [selection, setSelection] = useState<TextSelectionState | null>(null);

  const clear = useCallback(() => setSelection(null), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseUp = (e: MouseEvent) => {
      if (!(e.target instanceof Node) || !container.contains(e.target)) return;
      requestAnimationFrame(() => {
        setSelection(readSelection(container));
      });
    };

    const onSelectionChange = () => {
      const next = readSelection(container);
      if (!next) setSelection(null);
    };

    const onScroll = () => clear();

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target;
      if (target instanceof Element && target.closest("[data-selection-ask]")) return;
      requestAnimationFrame(() => {
        const next = readSelection(container);
        if (!next) setSelection(null);
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") clear();
    };

    container.addEventListener("mouseup", onMouseUp);
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      container.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [containerRef, clear]);

  return { selection, clear };
}
