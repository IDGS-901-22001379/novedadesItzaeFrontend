// src/app/providers/SidebarThemeProvider.tsx

import React, { useMemo, useState } from "react";
import {
  SidebarThemeContext,
  SIDEBAR_THEME_KEY,
  type SidebarTheme,
  type SidebarThemeContextValue,
} from "./sidebarTheme.context";

export function SidebarThemeProvider({ children }: { children: React.ReactNode }) {
  /*
    Se inicializa desde localStorage para mantener el tema del Sidebar
    aunque el usuario recargue la página.
  */
  const [sidebarTheme, setSidebarThemeState] = useState<SidebarTheme>(() => {
    const raw = localStorage.getItem(SIDEBAR_THEME_KEY);
    if (raw === "dark" || raw === "light" || raw === "blue" || raw === "green" || raw === "candy")
      return raw;
    return "dark";
  });

  /*
    setSidebarTheme guarda inmediatamente la preferencia del Sidebar.
  */
  function setSidebarTheme(t: SidebarTheme) {
    setSidebarThemeState(t);
    localStorage.setItem(SIDEBAR_THEME_KEY, t);
  }

  const value: SidebarThemeContextValue = useMemo(
    () => ({ sidebarTheme, setSidebarTheme }),
    [sidebarTheme]
  );

  return <SidebarThemeContext.Provider value={value}>{children}</SidebarThemeContext.Provider>;
}