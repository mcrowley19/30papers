import { useEffect, useRef } from "react";
import { useTermPanel } from "../context/TermPanelContext";

/**
 * Right-hand side panel that explains the active term. On wide screens the
 * reader reserves space so text is not covered; on narrow screens this overlays
 * with a scrim. Closes on Escape, scrim click, or the close button.
 */
export default function TermPanel() {
  const { activeTerm, closeTerm } = useTermPanel();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activeTerm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTerm();
    };
    window.addEventListener("keydown", onKey);
    // Move focus into the panel for keyboard and screen-reader users.
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [activeTerm, closeTerm]);

  if (!activeTerm) return null;

  return (
    <>
      {/* Scrim only matters on narrow screens; harmless elsewhere. */}
      <div className="fixed inset-0 z-30 bg-ink/20 lg:hidden" onClick={closeTerm} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="false"
        aria-label={`Definition: ${activeTerm.term}`}
        className="fixed right-0 top-0 z-40 flex h-full w-full max-w-[26rem] animate-panel-in flex-col border-l border-rule bg-paper shadow-[-8px_0_40px_rgba(20,20,20,0.06)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-rule px-6 py-5">
          <div>
            <h2 className="mt-1 font-serif text-2xl leading-tight text-ink">{activeTerm.term}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeTerm}
            aria-label="Close definition"
            className="-mr-1 rounded-md p-2 text-muted transition-colors hover:bg-rule/50 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="font-serif text-[1.05rem] leading-[1.7] text-ink">{activeTerm.definition}</p>
        </div>
      </aside>
    </>
  );
}
