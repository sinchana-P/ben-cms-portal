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
  /** screen magnification 1.0–4.0 (AX-4 / 400% zoom, ZoomText-class) */
  magnify: number;
  setMagnify: (n: number) => void;
  /** operator scope helper */
  scopedSiteIds: string[] | null; // null = all (staff)
};

export const MAGNIFY_LEVELS = [1, 1.25, 1.5, 2, 3, 4];

const SessionContext = createContext<SessionState | null>(null);

/* Persist WHO you're viewing as + accessibility prefs across refresh, so a
   reload keeps you in the same portal/role. App *data* still resets to the
   seed mock data on reload (payment/approval demo state starts fresh). */
const SESSION_KEY = "ben.session.v1";
function readPersisted(): { personaId?: string; highContrast?: boolean; magnify?: number } {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "{}"); } catch { return {}; }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const persisted = readPersisted();
  const [personaId, setPersonaId] = useState<string>(persisted.personaId ?? "admin-1");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [highContrast, setHighContrast] = useState(persisted.highContrast ?? false);
  const [magnify, setMagnify] = useState(persisted.magnify ?? 1);

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

  // Persist session (not data) across refresh
  useEffect(() => {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify({ personaId, highContrast, magnify })); } catch { /* ignore */ }
  }, [personaId, highContrast, magnify]);

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
      magnify,
      setMagnify,
      scopedSiteIds: persona.role === "operator" ? persona.siteIds ?? [] : null,
    }),
    [persona, themeMode, highContrast, magnify]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
