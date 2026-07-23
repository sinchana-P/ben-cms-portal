import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { Persona, Portal } from "@/types";
import { PERSONAS, personaById } from "@/data/personas";

type ThemeMode = "light" | "dark";

type SessionState = {
  persona: Persona;
  setPersonaId: (id: string) => void;
  personas: Persona[];
  portal: Portal;
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  /** operator scope helper */
  scopedSiteIds: string[] | null; // null = all (staff)
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [personaId, setPersonaId] = useState<string>("chief-1");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [highContrast, setHighContrast] = useState(false);

  const persona = personaById(personaId) ?? PERSONAS[0];

  // Operator portal defaults to dark theme (AX-3); staff defaults to light.
  useEffect(() => {
    setThemeMode(persona.portal === "operator" ? "dark" : "light");
  }, [persona.portal]);

  // Apply theme classes to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", themeMode === "dark");
    root.classList.toggle("theme-hc", highContrast);
  }, [themeMode, highContrast]);

  const value = useMemo<SessionState>(
    () => ({
      persona,
      setPersonaId,
      personas: PERSONAS,
      portal: persona.portal,
      themeMode,
      setThemeMode,
      highContrast,
      setHighContrast,
      scopedSiteIds: persona.role === "operator" ? persona.siteIds ?? [] : null,
    }),
    [persona, themeMode, highContrast]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
