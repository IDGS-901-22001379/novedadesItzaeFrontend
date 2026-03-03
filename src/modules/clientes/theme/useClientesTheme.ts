// src/modules/clientes/theme/useClientesTheme.ts
// Hook del tema de Clientes.
// Responsabilidades: leer el content_bg desde Topbar (localStorage) y escuchar cambios por evento.

import { useEffect, useState } from "react";
import { getClientesThemeFromContentBg, type ContentBg } from "./clientesTheme";

const CONTENT_BG_KEY = "content_bg";
const CONTENT_BG_EVENT = "content-bg-change";

function readContentBg(): ContentBg {
  const raw = localStorage.getItem(CONTENT_BG_KEY);
  if (raw === "light" || raw === "dark" || raw === "blue" || raw === "green" || raw === "candy") {
    return raw;
  }
  return "light";
}

export function useClientesTheme() {
  const [contentBg, setContentBg] = useState<ContentBg>(() => readContentBg());

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === CONTENT_BG_KEY) setContentBg(readContentBg());
    }

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

  return getClientesThemeFromContentBg(contentBg);
}