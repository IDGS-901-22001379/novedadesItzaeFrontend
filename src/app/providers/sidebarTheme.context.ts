// src/app/providers/sidebarTheme.context.ts

import { createContext } from "react";

export type SidebarTheme = "dark" | "light" | "blue" | "green" | "candy";

/*
  sidebarTheme controla el estilo completo del Sidebar:
  dark: sidebar oscuro y selección azul
  light: sidebar claro y selección verde
  blue/green/candy: sidebar a color y selección acorde al tema
*/
export type SidebarThemeContextValue = {
  sidebarTheme: SidebarTheme;
  setSidebarTheme: (t: SidebarTheme) => void;
};

export const SidebarThemeContext = createContext<SidebarThemeContextValue | null>(null);

export const SIDEBAR_THEME_KEY = "sidebar_theme";