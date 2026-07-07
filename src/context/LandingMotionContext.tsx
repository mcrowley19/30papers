import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

const STATIC_STORAGE_KEY = "30papers-landing-static";
const BACKGROUNDS_STORAGE_KEY = "30papers-hide-backgrounds";

type LandingMotionContextValue = {
  staticMode: boolean;
  toggle: () => void;
  backgroundsHidden: boolean;
  toggleBackgrounds: () => void;
};

const LandingMotionContext = createContext<LandingMotionContextValue>({
  staticMode: false,
  toggle: () => {},
  backgroundsHidden: false,
  toggleBackgrounds: () => {},
});

function readStoredFlag(key: string) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function LandingMotionProvider({ children }: { children: ReactNode }) {
  const [staticMode, setStaticMode] = useState(() => readStoredFlag(STATIC_STORAGE_KEY));
  const [backgroundsHidden, setBackgroundsHidden] = useState(() =>
    readStoredFlag(BACKGROUNDS_STORAGE_KEY)
  );

  useLayoutEffect(() => {
    document.documentElement.toggleAttribute("data-landing-static", staticMode);
    try {
      localStorage.setItem(STATIC_STORAGE_KEY, staticMode ? "1" : "0");
    } catch {
      // Ignore private browsing quota errors.
    }
  }, [staticMode]);

  useLayoutEffect(() => {
    document.documentElement.toggleAttribute("data-hide-backgrounds", backgroundsHidden);
    try {
      localStorage.setItem(BACKGROUNDS_STORAGE_KEY, backgroundsHidden ? "1" : "0");
    } catch {
      // Ignore private browsing quota errors.
    }
    return () => {
      document.documentElement.removeAttribute("data-hide-backgrounds");
    };
  }, [backgroundsHidden]);

  useLayoutEffect(
    () => () => {
      document.documentElement.removeAttribute("data-landing-static");
    },
    []
  );

  const toggle = () => setStaticMode((on) => !on);
  const toggleBackgrounds = () => setBackgroundsHidden((on) => !on);

  return (
    <LandingMotionContext.Provider
      value={{ staticMode, toggle, backgroundsHidden, toggleBackgrounds }}
    >
      {children}
    </LandingMotionContext.Provider>
  );
}

export function useLandingMotion() {
  return useContext(LandingMotionContext);
}

export function useLandingStatic() {
  return useContext(LandingMotionContext).staticMode;
}

export function useBackgroundsHidden() {
  return useContext(LandingMotionContext).backgroundsHidden;
}
