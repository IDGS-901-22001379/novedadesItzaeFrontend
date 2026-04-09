// src/modules/dashboard/theme/useDashboardTheme.ts
// Hook del tema de Dashboard.
// Responsabilidades:
// - leer el content_bg desde Topbar (localStorage)
// - escuchar cambios por storage y evento personalizado
// - devolver el tema visual actual del dashboard

import { useEffect, useState } from "react";
import { getDashboardThemeFromContentBg, type ContentBg } from "./dashboardTheme";

const CONTENT_BG_KEY = "content_bg";
const CONTENT_BG_EVENT = "content-bg-change";

function readContentBg(): ContentBg {
  const raw = localStorage.getItem(CONTENT_BG_KEY);
  if (raw === "light" || raw === "dark" || raw === "blue" || raw === "green" || raw === "candy") {
    return raw;
  }
  return "light";
}

export function useDashboardTheme() {
  const [contentBg, setContentBg] = useState<ContentBg>(() => readContentBg());

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === CONTENT_BG_KEY) {
        setContentBg(readContentBg());
      }
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

  return getDashboardThemeFromContentBg(contentBg);
}