// src/modules/caja/theme/useCajaTheme.ts
// Hook del tema de Caja.
// Responsabilidades: leer el content_bg desde Topbar (localStorage) y escuchar cambios por evento.
// Mantiene el mismo comportamiento usado en el módulo de Usuarios.

import { useEffect, useState } from "react";
import { getCajaThemeFromContentBg, type ContentBg } from "./cajaTheme";

const CONTENT_BG_KEY = "content_bg";
const CONTENT_BG_EVENT = "content-bg-change";

// Lee el color actual almacenado globalmente para el contenido.
function readContentBg(): ContentBg {
  const raw = localStorage.getItem(CONTENT_BG_KEY);
  if (raw === "light" || raw === "dark" || raw === "blue" || raw === "green" || raw === "candy") {
    return raw;
  }
  return "light";
}

export function useCajaTheme() {
  const [contentBg, setContentBg] = useState<ContentBg>(() => readContentBg());

  useEffect(() => {
    // Escucha cambios del localStorage entre pestañas.
    function onStorage(e: StorageEvent) {
      if (e.key === CONTENT_BG_KEY) setContentBg(readContentBg());
    }

    // Escucha cambios personalizados disparados dentro de la misma app.
    function onCustom(e: Event) {
      const ev = e as CustomEvent<ContentBg>;
      const val = ev.detail;

      if (val === "light" || val === "dark" || val === "blue" || val === "green" || val === "candy") {
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

  return getCajaThemeFromContentBg(contentBg);
}