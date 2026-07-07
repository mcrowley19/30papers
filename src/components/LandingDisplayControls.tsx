import type { ReactNode } from "react";
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

function BackgroundIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
      <rect
        x="1.5"
        y="1.5"
        width="9"
        height="9"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeDasharray={hidden ? "2 1.5" : undefined}
      />
      <path
        d="M3.5 7.5 5.5 5 7 6.5 8.5 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={hidden ? 0.35 : 1}
      />
    </svg>
  );
}

function DisplayToggle({
  pressed,
  label,
  ariaLabel,
  onClick,
  icon,
}: {
  pressed: boolean;
  label: string;
  ariaLabel: string;
  onClick: () => void;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-techmono text-xs uppercase tracking-[0.14em] shadow-sm backdrop-blur-sm transition-colors hover:border-accent/45 hover:text-accent ${
        pressed
          ? "border-accent/35 bg-accent-soft/90 text-accent"
          : "border-rule/90 bg-white/92 text-ink-soft"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/** Landing display controls: freeze motion and hide ASCII backdrops. */
export default function LandingDisplayControls() {
  const { staticMode, toggle, backgroundsHidden, toggleBackgrounds } = useLandingMotion();

  return (
    <div className="fixed right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-20 flex items-center gap-2">
      <DisplayToggle
        pressed={backgroundsHidden}
        label={backgroundsHidden ? "Bg on" : "Bg off"}
        ariaLabel={
          backgroundsHidden ? "Show ASCII backgrounds again" : "Hide ASCII backgrounds"
        }
        onClick={toggleBackgrounds}
        icon={<BackgroundIcon hidden={backgroundsHidden} />}
      />
      <DisplayToggle
        pressed={staticMode}
        label={staticMode ? "Motion on" : "Motion off"}
        ariaLabel={staticMode ? "Turn landing page motion back on" : "Turn off landing page motion"}
        onClick={toggle}
        icon={staticMode ? <PlayIcon /> : <PauseIcon />}
      />
    </div>
  );
}
