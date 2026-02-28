// src/app/layout/Topbar.tsx
import { useSidebarTheme } from "../providers/useSidebarTheme";
import type { SidebarTheme } from "../providers/sidebarTheme.context";

function themeTopbar(t: SidebarTheme) {
  if (t === "light") {
    return {
      shell: "bg-white text-slate-900 border-slate-200",
      ring: "ring-slate-400/60",
      title: "text-slate-900",
    };
  }
  if (t === "midnight") {
    return {
      shell:
        "bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border-white/10",
      ring: "ring-white/60",
      title: "text-white",
    };
  }
  // dark default
  return {
    shell: "bg-slate-900 text-white border-white/10",
    ring: "ring-white/60",
    title: "text-white",
  };
}

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
        "h-3 w-3 rounded-full",
        color,
        selected ? `ring-2 ${ringClass}` : "ring-0",
      ].join(" ")}
    />
  );
}

export default function Topbar() {
  const { theme, setTheme } = useSidebarTheme();
  const ui = themeTopbar(theme);

  return (
    <header className={["h-14 border-b flex items-center px-4", ui.shell].join(" ")}>
      {/* Centro: título */}
      <div className="flex-1 flex justify-center">
        <div className={["font-extrabold tracking-wide", ui.title].join(" ")}>
          Novedades Itzae
        </div>
      </div>

      {/* Derecha: circulitos */}
      <div className="flex items-center gap-2">
        <Dot
          title="Tema oscuro"
          color="bg-red-500"
          selected={theme === "dark"}
          onClick={() => setTheme("dark")}
          ringClass={ui.ring}
        />
        <Dot
          title="Tema claro"
          color="bg-yellow-400"
          selected={theme === "light"}
          onClick={() => setTheme("light")}
          ringClass={ui.ring}
        />
        <Dot
          title="Tema midnight"
          color="bg-green-500"
          selected={theme === "midnight"}
          onClick={() => setTheme("midnight")}
          ringClass={ui.ring}
        />
      </div>
    </header>
  );
}