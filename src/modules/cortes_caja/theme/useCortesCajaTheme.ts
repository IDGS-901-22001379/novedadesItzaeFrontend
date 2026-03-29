// src/modules/cortes_caja/theme/useCortesCajaTheme.ts
// Hook del tema de Cortes de Caja.
// Se encarga de leer el content_bg desde localStorage y escuchar cambios para mantener el diseño sincronizado con el Topbar.

import { useEffect, useState } from "react";
import { getCortesCajaThemeFromContentBg, type ContentBg } from "./cortesCajaTheme";

const CONTENT_BG_KEY = "content_bg";
const CONTENT_BG_EVENT = "content-bg-change";

// Lee el valor actual del tema guardado en localStorage.
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

// Hook principal para obtener el tema activo del módulo.
export function useCortesCajaTheme() {
  const [contentBg, setContentBg] = useState<ContentBg>(() => readContentBg());

  useEffect(() => {
    // Escucha cambios del tema entre pestañas.
    function onStorage(e: StorageEvent) {
      if (e.key === CONTENT_BG_KEY) {
        setContentBg(readContentBg());
      }
    }

    // Escucha cambios del tema disparados manualmente dentro de la app.
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

  return getCortesCajaThemeFromContentBg(contentBg);
}