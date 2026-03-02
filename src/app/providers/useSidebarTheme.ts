// src/app/providers/useSidebarTheme.ts

import { useContext } from "react";
import { SidebarThemeContext } from "./sidebarTheme.context";

/*
  Hook para leer y actualizar preferencias visuales.
  sidebarPalette controla el color dominante del Sidebar.
  contentSurface controla el fondo del contenido (derecha).
*/
export function useSidebarTheme() {
  const ctx = useContext(SidebarThemeContext);
  if (!ctx) throw new Error("useSidebarTheme debe usarse dentro de <SidebarThemeProvider>");
  return ctx;
}