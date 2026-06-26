import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Term } from "../content/types";

interface TermPanelValue {
  activeTerm: Term | null;
  openTerm: (term: Term) => void;
  closeTerm: () => void;
}

const TermPanelContext = createContext<TermPanelValue | null>(null);

export function TermPanelProvider({ children }: { children: ReactNode }) {
  const [activeTerm, setActiveTerm] = useState<Term | null>(null);

  const openTerm = useCallback((term: Term) => setActiveTerm(term), []);
  const closeTerm = useCallback(() => setActiveTerm(null), []);

  const value = useMemo(
    () => ({ activeTerm, openTerm, closeTerm }),
    [activeTerm, openTerm, closeTerm]
  );

  return (
    <TermPanelContext.Provider value={value}>{children}</TermPanelContext.Provider>
  );
}

export function useTermPanel(): TermPanelValue {
  const ctx = useContext(TermPanelContext);
  if (!ctx) {
    throw new Error("useTermPanel must be used within a TermPanelProvider");
  }
  return ctx;
}
