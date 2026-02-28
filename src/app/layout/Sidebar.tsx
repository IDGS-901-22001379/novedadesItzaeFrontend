// src/app/layout/Sidebar.tsx

import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";

import { useAuth } from "../../shared/hooks/useAuth";
import { NAV_ADMIN } from "../../config/nav.admin";
import { NAV_VENTAS } from "../../config/nav.ventas";
import { NAV_ALMACEN } from "../../config/nav.almacen";
import type { NavItem } from "../../config/nav.types";

import { useSidebarTheme } from "../providers/useSidebarTheme";
import type { SidebarTheme } from "../providers/sidebarTheme.context";

function getMenu(appRol: string | null): NavItem[] {
  if (appRol === "VENTAS") return NAV_VENTAS;
  if (appRol === "ALMACEN") return NAV_ALMACEN;
  return NAV_ADMIN;
}

function themeClasses(t: SidebarTheme) {
  if (t === "light") {
    return {
      shell: "bg-white text-slate-900 border-slate-200",
      soft: "bg-slate-100/70",
      hover: "hover:bg-slate-100",
      active: "bg-blue-600 text-white",
      muted: "text-slate-500",
      divider: "border-slate-200",
      search: "bg-slate-100 text-slate-800 placeholder:text-slate-400",
      scroll: "scrollbar-thumb-slate-200 scrollbar-track-transparent",
      badge: "bg-slate-200 text-slate-700",
    };
  }
  if (t === "midnight") {
    return {
      shell: "bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white border-white/10",
      soft: "bg-white/5",
      hover: "hover:bg-white/5",
      active: "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white",
      muted: "text-white/60",
      divider: "border-white/10",
      search: "bg-white/5 text-white placeholder:text-white/40",
      scroll: "scrollbar-thumb-white/10 scrollbar-track-transparent",
      badge: "bg-white/10 text-white/70",
    };
  }
  // dark default
  return {
    shell: "bg-slate-900 text-white border-white/10",
    soft: "bg-white/5",
    hover: "hover:bg-white/5",
    active: "bg-blue-600 text-white",
    muted: "text-white/60",
    divider: "border-white/10",
    search: "bg-white/5 text-white placeholder:text-white/40",
    scroll: "scrollbar-thumb-white/10 scrollbar-track-transparent",
    badge: "bg-white/10 text-white/70",
  };
}

// Círculo “online” iluminado
function OnlineDot() {
  return (
    <span className="relative inline-flex h-3 w-3">
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30 blur-[1px]" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400 ring-2 ring-green-300/50" />
    </span>
  );
}

export default function Sidebar() {
  const { user, appRol, logout } = useAuth();
  const { theme } = useSidebarTheme(); // ya no cambiamos tema aquí
  const ui = themeClasses(theme);

  const menu = useMemo(() => getMenu(appRol), [appRol]);

  // Colapsar/expandir
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={[
        "h-screen sticky top-0 border-r flex flex-col",
        collapsed ? "w-[84px]" : "w-[280px]",
        "transition-all duration-200",
        ui.shell,
        ui.divider,
      ].join(" ")}
    >
      {/* =======================
          HEADER (FIJO ARRIBA)
         ======================= */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          {/* Solo rol + online */}
          <div className="flex items-center gap-2">
            <OnlineDot />
            {!collapsed && (
              <div className="leading-4">
                <div className="text-sm font-bold">Rol</div>
                <div className={["text-[11px] font-semibold", ui.muted].join(" ")}>
                  {appRol ?? "-"}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={["rounded-lg p-2", ui.hover].join(" ")}
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          </button>
        </div>

        {/* Search */}
        <div className={["mt-4 flex items-center gap-2 rounded-xl px-3 py-2", ui.search].join(" ")}>
          <Search size={16} className={ui.muted} />
          {!collapsed && (
            <input className="w-full bg-transparent outline-none text-sm" placeholder="Buscar..." />
          )}
        </div>
      </div>

      {/* =======================
          MENU (SCROLL INTERNO)
         ======================= */}
      <div className="flex-1 min-h-0 px-3">
        <nav className={["h-full overflow-y-auto pr-1", "scrollbar-thin", ui.scroll].join(" ")}>
          <div className="space-y-1 pb-3">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                      isActive ? ui.active : ui.hover,
                      collapsed ? "justify-center" : "",
                    ].join(" ")
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className="shrink-0" />

                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="font-medium truncate">{item.label}</span>

                      {typeof item.badge === "number" && item.badge > 0 && (
                        <span className={["text-[11px] px-2 py-0.5 rounded-full", ui.badge].join(" ")}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>

      {/* =======================
          FOOTER (FIJO ABAJO)
         ======================= */}
      <div className={["border-t", ui.divider].join(" ")}>
        <div className={["px-4 py-3 flex items-center gap-3", ui.soft].join(" ")}>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-blue-500 shrink-0" />

          {!collapsed && (
            <div className="flex-1 leading-4 min-w-0">
              <div className="text-sm font-semibold truncate">{user?.username ?? "-"}</div>
              <div className={["text-[11px] truncate", ui.muted].join(" ")}>
                {user?.rol ?? "-"}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            className={["rounded-lg p-2", ui.hover].join(" ")}
            title="Salir"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}