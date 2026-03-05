// src/app/layout/Sidebar.tsx

import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Search,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

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

/*
  themeTokens devuelve clases Tailwind según el tema del sidebar.
  Estas clases controlan colores, hover, activo, scrollbar y badges.
*/
function themeTokens(t: SidebarTheme) {
  if (t === "dark") {
    return {
      isDark: true,
      shell:
        "bg-gradient-to-b from-[#111215] via-[#14161a] to-[#0b0c0f] text-white border-white/10",
      hover: "hover:bg-white/5",
      muted: "text-white/60",
      divider: "border-white/10",
      search: "bg-white/5 text-white placeholder:text-white/50",
      scroll: "scrollbar-thumb-white/10 scrollbar-track-transparent",
      badge: "bg-white/10 text-white/80",
      ring: "ring-[#107acc]/35",
      active: "bg-[#107acc] text-white",
      dot: {
        dark: "bg-slate-900",
        light: "bg-slate-200",
        blue: "bg-[#107acc]",
        green: "bg-[#6eea8e]",
        candy: "bg-[#bd13ec]",
      },
    };
  }

  if (t === "light") {
    return {
      isDark: false,
      shell: "bg-white text-slate-900 border-slate-200",
      hover: "hover:bg-slate-100",
      muted: "text-slate-500",
      divider: "border-slate-200",
      search: "bg-slate-100 text-slate-900 placeholder:text-slate-500",
      scroll: "scrollbar-thumb-slate-200 scrollbar-track-transparent",
      badge: "bg-slate-200 text-slate-700",
      ring: "ring-[#6eea8e]/40",
      active: "bg-[#6eea8e] text-slate-900",
      dot: {
        dark: "bg-slate-900",
        light: "bg-slate-200",
        blue: "bg-[#107acc]",
        green: "bg-[#6eea8e]",
        candy: "bg-[#bd13ec]",
      },
    };
  }

  if (t === "blue") {
    return {
      isDark: true,
      shell:
        "bg-gradient-to-b from-[#4fb2ff] via-[#2a92e6] to-[#176fbd] text-white border-white/15",
      hover: "hover:bg-white/10",
      muted: "text-white/80",
      divider: "border-white/15",
      search: "bg-white/10 text-white placeholder:text-white/70",
      scroll: "scrollbar-thumb-white/20 scrollbar-track-transparent",
      badge: "bg-white/15 text-white",
      ring: "ring-white/25",
      active: "bg-white/20 text-white",
      dot: {
        dark: "bg-slate-900",
        light: "bg-slate-200",
        blue: "bg-[#107acc]",
        green: "bg-[#6eea8e]",
        candy: "bg-[#bd13ec]",
      },
    };
  }

  if (t === "green") {
    return {
      isDark: false,
      shell:
        "bg-gradient-to-b from-[#8df2a6] via-[#6eea8e] to-[#35d874] text-slate-900 border-black/10",
      hover: "hover:bg-black/10",
      muted: "text-slate-800/80",
      divider: "border-black/10",
      search: "bg-black/10 text-slate-900 placeholder:text-slate-700/70",
      scroll: "scrollbar-thumb-black/20 scrollbar-track-transparent",
      badge: "bg-black/15 text-slate-900",
      ring: "ring-black/20",
      active: "bg-black/15 text-slate-900",
      dot: {
        dark: "bg-slate-900",
        light: "bg-slate-200",
        blue: "bg-[#107acc]",
        green: "bg-[#6eea8e]",
        candy: "bg-[#bd13ec]",
      },
    };
  }

  return {
    isDark: true,
    shell:
      "bg-gradient-to-b from-[#ff4fb0] via-[#bd13ec] to-[#7a12b5] text-white border-white/20",
    hover: "hover:bg-white/10",
    muted: "text-white/80",
    divider: "border-white/20",
    search: "bg-white/10 text-white placeholder:text-white/70",
    scroll: "scrollbar-thumb-white/20 scrollbar-track-transparent",
    badge: "bg-white/15 text-white",
    ring: "ring-white/25",
    active: "bg-white/20 text-white",
    dot: {
      dark: "bg-slate-900",
      light: "bg-slate-200",
      blue: "bg-[#107acc]",
      green: "bg-[#6eea8e]",
      candy: "bg-[#bd13ec]",
    },
  };
}

function Dot({
  colorClass,
  selected,
  onClick,
  title,
  ringClass,
}: {
  colorClass: string;
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
        "h-3.5 w-3.5 rounded-full transition shadow-sm",
        colorClass,
        selected ? ["ring-2", ringClass].join(" ") : "ring-0",
      ].join(" ")}
    />
  );
}

/*
  Sidebar soporta dos tipos de items:
  - Item normal: NavLink directo.
  - Grupo con children: se muestra como desplegable tipo "Files".
  Cuando el sidebar está colapsado y un grupo está abierto, el submenú aparece como panel flotante
  para que siga siendo usable.
*/
export default function Sidebar() {
  const { user, appRol, logout } = useAuth();
  const { sidebarTheme, setSidebarTheme } = useSidebarTheme();

  const ui = themeTokens(sidebarTheme);
  const menu = useMemo(() => getMenu(appRol), [appRol]);
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const pathname = location.pathname;

  /*
    openGroup guarda el path del grupo que el usuario abrió manualmente.
    Si está en null, el sidebar puede abrir automáticamente el grupo según la ruta actual.
  */
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const username = user?.username ?? "";
  const initial = (username.trim()[0] ?? "?").toUpperCase();

  const profileRing = ui.isDark ? "ring-white/70" : "ring-black/60";
  const profileText = ui.isDark ? "text-white" : "text-slate-900";
  const footerBg = ui.isDark ? "bg-white/5" : "bg-black/5";

  /*
    Un grupo se considera activo si el usuario está en:
    - la ruta exacta del grupo
    - cualquier subruta /admin/clientes/...
    - rutas relacionadas como /admin/clientes-fiscales (por el guion)
  */
  const isGroupActive = (groupPath: string) => {
    return (
      pathname === groupPath ||
      pathname.startsWith(groupPath + "/") ||
      pathname.startsWith(groupPath + "-")
    );
  };

  /*
    Si el usuario abrió manualmente un grupo, se respeta.
    Si no abrió ninguno, el grupo se abre automáticamente cuando su ruta está activa.
  */
  const isGroupOpen = (groupPath: string) => {
    if (openGroup === groupPath) return true;
    if (openGroup && openGroup !== groupPath) return false;
    return isGroupActive(groupPath);
  };

  const toggleGroup = (groupPath: string) => {
    setOpenGroup((prev) => (prev === groupPath ? null : groupPath));
  };

  return (
    <aside
      className={[
        "h-screen sticky top-0 border-r flex flex-col",
        collapsed ? "w-23" : "w-75",
        "transition-all duration-200",
        ui.shell,
      ].join(" ")}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={[
                "h-14 w-14 rounded-full overflow-hidden ring-2 shrink-0",
                ui.divider,
              ].join(" ")}
              title="Logo"
            >
              <img
                src="/logo.jpeg"
                alt="logo"
                className="h-full w-full object-cover"
              />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <div className="text-sm font-extrabold tracking-wide leading-4 truncate">
                  Novedades Itzae
                </div>

                <div
                  className={["mt-2 flex items-center gap-2", ui.muted].join(
                    " ",
                  )}
                >
                  <Dot
                    title="Tema oscuro"
                    colorClass={ui.dot.dark}
                    selected={sidebarTheme === "dark"}
                    onClick={() => setSidebarTheme("dark")}
                    ringClass={ui.ring}
                  />
                  <Dot
                    title="Tema claro"
                    colorClass={ui.dot.light}
                    selected={sidebarTheme === "light"}
                    onClick={() => setSidebarTheme("light")}
                    ringClass={ui.ring}
                  />
                  <Dot
                    title="Tema azul"
                    colorClass={ui.dot.blue}
                    selected={sidebarTheme === "blue"}
                    onClick={() => setSidebarTheme("blue")}
                    ringClass={ui.ring}
                  />
                  <Dot
                    title="Tema verde"
                    colorClass={ui.dot.green}
                    selected={sidebarTheme === "green"}
                    onClick={() => setSidebarTheme("green")}
                    ringClass={ui.ring}
                  />
                  <Dot
                    title="Tema rosa/morado"
                    colorClass={ui.dot.candy}
                    selected={sidebarTheme === "candy"}
                    onClick={() => setSidebarTheme("candy")}
                    ringClass={ui.ring}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={[
              "rounded-full transition flex items-center justify-center",
              collapsed
                ? [
                    "absolute left-4 top-4 h-14 w-14",
                    "bg-transparent hover:bg-transparent",
                    "z-50",
                  ].join(" ")
                : ["h-11 w-11", ui.hover].join(" "),
            ].join(" ")}
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? (
              <ChevronsRight size={22} className="opacity-0" />
            ) : (
              <ChevronsLeft size={22} />
            )}
          </button>
        </div>

        <div
          className={[
            "mt-4 flex items-center gap-2 rounded-xl px-3 py-2",
            ui.search,
          ].join(" ")}
        >
          <Search size={16} className={ui.muted} />
          {!collapsed && (
            <input
              className="w-full bg-transparent outline-none text-sm"
              placeholder="Buscar..."
            />
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 px-3">
        <nav className="h-full overflow-y-auto pr-1 scrollbar-none">
          <div className="space-y-1 pb-3">
            {menu.map((item) => {
              const Icon = item.icon;

              if (item.children && item.children.length > 0) {
                const active = isGroupActive(item.path);
                const open = isGroupOpen(item.path);

                return (
                  <div key={item.path} className="relative">
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.path)}
                      className={[
                        "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                        active
                          ? ["ring-2", ui.ring, ui.active].join(" ")
                          : ui.hover,
                        collapsed ? "justify-center" : "",
                      ].join(" ")}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={18} className="shrink-0" />

                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="font-semibold truncate">
                            {item.label}
                          </span>
                          <span className={ui.muted}>
                            {open ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </span>
                        </div>
                      )}
                    </button>

                    {!collapsed && open && (
                      <div className="mt-1 ml-3 pl-3 border-l border-white/10 space-y-1">
                        {item.children.map((child) => {
                          const CIcon = child.icon;

                          return (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className={({ isActive }) =>
                                [
                                  "flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] transition",
                                  isActive
                                    ? ["ring-2", ui.ring, ui.active].join(" ")
                                    : ui.hover,
                                ].join(" ")
                              }
                            >
                              <CIcon
                                size={16}
                                className="shrink-0 opacity-90"
                              />
                              <span className="font-semibold truncate">
                                {child.label}
                              </span>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}

                    {collapsed && open && (
                      <div
                        className={[
                          "absolute left-full top-0 ml-2 w-60 rounded-2xl border shadow-lg p-2 z-50",
                          ui.isDark
                            ? "bg-[#0f1115] border-white/10"
                            : "bg-white border-slate-200",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "px-2 py-1 text-xs font-extrabold tracking-wide",
                            ui.muted,
                          ].join(" ")}
                        >
                          {item.label}
                        </div>

                        <div className="mt-1 space-y-1">
                          {item.children.map((child) => {
                            const CIcon = child.icon;

                            return (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive }) =>
                                  [
                                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                                    isActive
                                      ? ["ring-2", ui.ring, ui.active].join(" ")
                                      : ui.hover,
                                  ].join(" ")
                                }
                              >
                                <CIcon size={16} className="shrink-0" />
                                <span className="font-semibold truncate">
                                  {child.label}
                                </span>
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                      isActive
                        ? ["ring-2", ui.ring, ui.active].join(" ")
                        : ui.hover,
                      collapsed ? "justify-center" : "",
                    ].join(" ")
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="font-semibold truncate">
                        {item.label}
                      </span>

                      {typeof item.badge === "number" && item.badge > 0 && (
                        <span
                          className={[
                            "text-[11px] px-2 py-0.5 rounded-full",
                            ui.badge,
                          ].join(" ")}
                        >
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

      <div className={["border-t", ui.divider].join(" ")}>
        <div
          className={["px-4 py-3 flex items-center gap-3", footerBg].join(" ")}
        >
          <NavLink
            to="/perfil"
            className={[
              "h-10 w-10 rounded-full shrink-0 ring-2 flex items-center justify-center font-extrabold",
              profileRing,
              profileText,
            ].join(" ")}
            title="Perfil"
          >
            {initial}
          </NavLink>

          {!collapsed && (
            <NavLink
              to="/perfil"
              className="flex-1 leading-4 min-w-0"
              title="Perfil"
            >
              <div className="text-sm font-semibold truncate">
                {user?.username ?? "-"}
              </div>
              <div className={["text-[11px] truncate", ui.muted].join(" ")}>
                {user?.rol ?? "-"}
              </div>
            </NavLink>
          )}

          {!collapsed && (
            <button
              type="button"
              onClick={logout}
              className={["rounded-lg p-2", ui.hover].join(" ")}
              title="Salir"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
