// src/app/providers/sidebarTheme.context.ts
import { createContext } from "react";

export type SidebarTheme = "dark" | "light" | "midnight";

export type SidebarThemeContextValue = {
  theme: SidebarTheme;
  setTheme: (t: SidebarTheme) => void;
};

export const SidebarThemeContext = createContext<SidebarThemeContextValue | null>(null);
export const SIDEBAR_THEME_KEY = "sidebar_theme";