// src/modules/ventas/theme/useVentasTheme.ts
// Hook del tema de Ventas.
// Responsabilidades:
// - Leer el content_bg definido desde Topbar en localStorage.
// - Escuchar cambios del tema en tiempo real.
// - Regresar el theme visual del módulo Ventas.
//
// Nota:
// Este módulo usa exactamente la misma lógica visual que Usuarios y Productos,
// para mantener consistencia total en colores y comportamiento.

import { useEffect, useState } from "react";
import { getVentasThemeFromContentBg, type ContentBg } from "./ventasTheme";

const CONTENT_BG_KEY = "content_bg";
const CONTENT_BG_EVENT = "content-bg-change";

// Lee el fondo actual guardado por Topbar.
// Si no existe o trae un valor no válido, usa "light".
function readContentBg(): ContentBg {
  const raw = localStorage.getItem(CONTENT_BG_KEY);

  if (
    raw === "light" ||
    raw === "dark" ||
    raw === "blue" ||
    raw === "green" ||
    raw === "candy"
  ) {
    return raw;
  }

  return "light";
}

export function useVentasTheme() {
  const [contentBg, setContentBg] = useState<ContentBg>(() => readContentBg());

  useEffect(() => {
    // Detecta cambios cuando otra pestaña modifica localStorage
    function onStorage(e: StorageEvent) {
      if (e.key === CONTENT_BG_KEY) {
        setContentBg(readContentBg());
      }
    }

    // Detecta cambio inmediato cuando Topbar dispara el evento custom
    function onCustom(e: Event) {
      const ev = e as CustomEvent<ContentBg>;
      const val = ev.detail;

      if (
        val === "light" ||
        val === "dark" ||
        val === "blue" ||
        val === "green" ||
        val === "candy"
      ) {
        setContentBg(val);
      } else {
        setContentBg(readContentBg());
      }
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener(CONTENT_BG_EVENT, onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CONTENT_BG_EVENT, onCustom);
    };
  }, []);

  return getVentasThemeFromContentBg(contentBg);
}