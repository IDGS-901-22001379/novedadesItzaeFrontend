// src/app/providers/SidebarThemeProvider.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  SidebarThemeContext,
  SIDEBAR_THEME_KEY,
  type SidebarTheme,
  type SidebarThemeContextValue,
} from "./sidebarTheme.context";

export function SidebarThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<SidebarTheme>(() => {
    const raw = localStorage.getItem(SIDEBAR_THEME_KEY);
    if (raw === "dark" || raw === "light" || raw === "midnight") return raw;
    return "dark";
  });

  function setTheme(t: SidebarTheme) {
    setThemeState(t);
    localStorage.setItem(SIDEBAR_THEME_KEY, t);
  }

  useEffect(() => {
    localStorage.setItem(SIDEBAR_THEME_KEY, theme);
  }, [theme]);

  const value: SidebarThemeContextValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return <SidebarThemeContext.Provider value={value}>{children}</SidebarThemeContext.Provider>;
}