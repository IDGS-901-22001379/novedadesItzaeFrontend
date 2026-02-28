// src/app/providers/useSidebarTheme.ts
import { useContext } from "react";
import { SidebarThemeContext } from "./sidebarTheme.context";

export function useSidebarTheme() {
  const ctx = useContext(SidebarThemeContext);
  if (!ctx) throw new Error("useSidebarTheme debe usarse dentro de <SidebarThemeProvider>");
  return ctx;
}