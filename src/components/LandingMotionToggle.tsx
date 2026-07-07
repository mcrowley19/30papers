import { useLandingMotion } from "../context/LandingMotionContext";

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
      <rect x="2" y="1.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
      <rect x="7.5" y="1.5" width="2.5" height="9" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
      <path d="M3 1.8 10 6 3 10.2V1.8Z" fill="currentColor" />
    </svg>
  );
}

/** Control to freeze landing-page motion (ASCII backdrops, scroll effects). */
export default function LandingMotionToggle() {
  const { staticMode, toggle } = useLandingMotion();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={staticMode}
      aria-label={staticMode ? "Turn landing page motion back on" : "Turn off landing page motion"}
      className={`fixed right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex items-center gap-2 rounded-full border px-3 py-1.5 font-techmono text-xs uppercase tracking-[0.14em] shadow-sm backdrop-blur-sm transition-colors hover:border-accent/45 hover:text-accent ${
        staticMode
          ? "border-accent/35 bg-accent-soft/90 text-accent"
          : "border-rule/90 bg-white/92 text-ink-soft"
      }`}
    >
      {staticMode ? <PlayIcon /> : <PauseIcon />}
      <span>{staticMode ? "Motion on" : "Motion off"}</span>
    </button>
  );
}
