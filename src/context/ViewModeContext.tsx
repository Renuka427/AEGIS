import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type ViewMode = "SIMPLE" | "TECHNICAL";

const ViewModeContext = createContext<{
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
} | null>(null);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("SIMPLE");
  const value = useMemo(() => ({ mode, setMode }), [mode]);
  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) throw new Error("useViewMode must be used inside <ViewModeProvider>");
  return ctx;
}