// src/app/layout/Topbar.tsx

import { useEffect, useState } from "react";

type ContentBg = "light" | "dark" | "blue" | "green" | "candy";
const CONTENT_BG_KEY = "content_bg";
const CONTENT_BG_EVENT = "content-bg-change";

function Dot({
  color,
  selected,
  onClick,
  title,
  ringClass,
}: {
  color: string;
  selected: boolean;
  onClick: () => void;
  title: string;
  ringClass: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "h-3.5 w-3.5 rounded-full shadow-sm transition",
        color,
        selected ? ["ring-2", ringClass].join(" ") : "ring-0",
      ].join(" ")}
    />
  );
}

/*
  Topbar controla solo el fondo del contenido (derecha).
  No usa intervalos para evitar trabas al recargar.
*/
export default function Topbar() {
  const [contentBg, setContentBg] = useState<ContentBg>(() => {
    const raw = localStorage.getItem(CONTENT_BG_KEY);
    if (
      raw === "light" ||
      raw === "dark" ||
      raw === "blue" ||
      raw === "green" ||
      raw === "candy"
    )
      return raw;
    return "light";
  });

  function apply(bg: ContentBg) {
    setContentBg(bg);
    localStorage.setItem(CONTENT_BG_KEY, bg);
    window.dispatchEvent(new CustomEvent(CONTENT_BG_EVENT, { detail: bg }));
  }

  useEffect(() => {
    localStorage.setItem(CONTENT_BG_KEY, contentBg);
  }, [contentBg]);

  const ring = "ring-slate-500/60";

  const headerClass =
    contentBg === "dark"
      ? "bg-slate-950 border-white/10"
      : contentBg === "blue"
        ? "bg-[#cfe9ff] border-slate-200/60"
        : contentBg === "green"
          ? "bg-[#cfffcc] border-slate-200/60"
          : contentBg === "candy"
            ? "bg-[#f1ccff] border-slate-200/60"
            : "bg-white border-slate-200/60";

  const titleClass = contentBg === "dark" ? "text-white" : "text-slate-900";

  return (
    <header
      className={["h-14 border-b flex items-center px-4", headerClass].join(
        " ",
      )}
    >
      <div className="flex-1 flex justify-center">
        <div
          className={[
            "font-extrabold tracking-wide",
            "text-2xl leading-none", // MÁS GRANDE (sin empujar el alto)
            "truncate max-w-[55%]", // evita que invada los dots
            titleClass,
          ].join(" ")}
          title="Novedades Itzae"
        >
          Novedades Itzae
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Dot
          title="Fondo Azul"
          color="bg-[#6ec1ff]"
          selected={contentBg === "blue"}
          onClick={() => apply("blue")}
          ringClass={ring}
        />
        <Dot
          title="Fondo Verde"
          color="bg-[#89fb74]"
          selected={contentBg === "green"}
          onClick={() => apply("green")}
          ringClass={ring}
        />
        <Dot
          title="Fondo Rosa/Morado"
          color="bg-[#dd63ff]"
          selected={contentBg === "candy"}
          onClick={() => apply("candy")}
          ringClass={ring}
        />
        <Dot
          title="Fondo claro"
          color="bg-slate-100"
          selected={contentBg === "light"}
          onClick={() => apply("light")}
          ringClass={ring}
        />
        <Dot
          title="Fondo oscuro"
          color="bg-slate-900"
          selected={contentBg === "dark"}
          onClick={() => apply("dark")}
          ringClass={ring}
        />
      </div>
    </header>
  );
}
