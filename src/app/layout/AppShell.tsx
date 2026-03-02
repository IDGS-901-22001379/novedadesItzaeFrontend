// src/app/layout/AppShell.tsx

import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type ContentBg = "light" | "dark" | "blue" | "green" | "candy";

const CONTENT_BG_KEY = "content_bg";
const CONTENT_BG_EVENT = "content-bg-change";

/*
  Solo el Topbar queda fijo.
  El scroll ocurre únicamente en el contenido (main).
*/
export default function AppShell() {
  const [contentBg, setContentBg] = useState<ContentBg>(() => {
    const raw = localStorage.getItem(CONTENT_BG_KEY);
    if (raw === "light" || raw === "dark" || raw === "blue" || raw === "green" || raw === "candy")
      return raw;
    return "light";
  });

  useEffect(() => {
    function onChange(e: Event) {
      const ev = e as CustomEvent<ContentBg>;
      const v = ev.detail;
      if (v === "light" || v === "dark" || v === "blue" || v === "green" || v === "candy") {
        setContentBg(v);
      }
    }

    window.addEventListener(CONTENT_BG_EVENT, onChange);
    return () => window.removeEventListener(CONTENT_BG_EVENT, onChange);
  }, []);

  const mainClass =
    contentBg === "dark"
      ? "bg-slate-950 text-white"
      : contentBg === "blue"
      ? "bg-[#cfe9ff] text-slate-900"
      : contentBg === "green"
      ? "bg-[#cfffcc] text-slate-900"
      : contentBg === "candy"
      ? "bg-[#f1ccff] text-slate-900"
      : "bg-slate-50 text-slate-900";

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex w-full flex-col h-screen">
        <div className="sticky top-0 z-50">
          <Topbar />
        </div>

        <main className={["flex-1 overflow-y-auto p-6", mainClass].join(" ")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}