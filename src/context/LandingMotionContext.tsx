import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "30papers-landing-static";

type LandingMotionContextValue = {
  staticMode: boolean;
  toggle: () => void;
};

const LandingMotionContext = createContext<LandingMotionContextValue>({
  staticMode: false,
  toggle: () => {},
});

function readStoredStaticMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function LandingMotionProvider({ children }: { children: ReactNode }) {
  const [staticMode, setStaticMode] = useState(readStoredStaticMode);

  useLayoutEffect(() => {
    document.documentElement.toggleAttribute("data-landing-static", staticMode);
    try {
      localStorage.setItem(STORAGE_KEY, staticMode ? "1" : "0");
    } catch {
      // Ignore private browsing quota errors.
    }
    return () => {
      document.documentElement.removeAttribute("data-landing-static");
    };
  }, [staticMode]);

  const toggle = () => setStaticMode((on) => !on);

  return (
    <LandingMotionContext.Provider value={{ staticMode, toggle }}>
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
