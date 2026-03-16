// src/modules/movimientos_inventario/theme/movimientosInventarioTheme.ts
// Tema visual del módulo Movimientos de Inventario.
// Responsabilidades: traducir el content_bg del Topbar a clases Tailwind y colores consistentes.
// Nota: los colores del módulo son más fuertes en encabezados (tabla) para que combinen con el Topbar.
// Ajuste: headerBg para blue/green/candy usa colores tipo Sidebar (azul/verde/rosa-morado).

export type ContentBg = "light" | "dark" | "blue" | "green" | "candy";

export type MovimientosInventarioTheme = {
  titleText: string;

  cardBorder: string;
  cardBg: string;

  panelBorder: string;
  panelBg: string;

  headerBg: string;
  headerText: string;

  rowHover: string;

  inputBorder: string;
  inputFocusRing: string;
  inputText: string;
  inputPlaceholder: string;

  badgeActivoBg: string;
  badgeActivoText: string;
  badgeInactivoBg: string;
  badgeInactivoText: string;

  btnReloadBorder: string;
  btnReloadBg: string;
  btnReloadText: string;
  btnReloadHover: string;

  btnNuevoBg: string;
  btnNuevoText: string;
  btnNuevoHover: string;
};

const THEMES: Record<ContentBg, MovimientosInventarioTheme> = {
  light: {
    titleText: "text-slate-900",

    cardBorder: "border-slate-200/70",
    cardBg: "bg-white",

    panelBorder: "border-slate-200/60",
    panelBg: "bg-white/90",

    headerBg: "bg-slate-800",
    headerText: "text-white",

    rowHover: "hover:bg-slate-50",

    inputBorder: "border-slate-200/70",
    inputFocusRing: "focus:ring-slate-300",
    inputText: "text-slate-900",
    inputPlaceholder: "placeholder:text-slate-400",

    badgeActivoBg: "bg-green-100",
    badgeActivoText: "text-green-700",
    badgeInactivoBg: "bg-yellow-100",
    badgeInactivoText: "text-yellow-800",

    btnReloadBorder: "border-slate-200/70",
    btnReloadBg: "bg-white",
    btnReloadText: "text-slate-900",
    btnReloadHover: "hover:bg-slate-50",

    btnNuevoBg: "bg-[#ECC94B]",
    btnNuevoText: "text-slate-900",
    btnNuevoHover: "hover:bg-[#D69E2E]",
  },

  dark: {
    titleText: "text-white",

    cardBorder: "border-white/10",
    cardBg: "bg-slate-950",

    panelBorder: "border-white/10",
    panelBg: "bg-slate-900/60",

    headerBg: "bg-slate-950",
    headerText: "text-white",

    rowHover: "hover:bg-white/5",

    inputBorder: "border-white/10",
    inputFocusRing: "focus:ring-slate-500/50",
    inputText: "text-white",
    inputPlaceholder: "placeholder:text-white/40",

    badgeActivoBg: "bg-green-200",
    badgeActivoText: "text-green-900",
    badgeInactivoBg: "bg-yellow-200",
    badgeInactivoText: "text-yellow-900",

    btnReloadBorder: "border-white/10",
    btnReloadBg: "bg-slate-900",
    btnReloadText: "text-white",
    btnReloadHover: "hover:bg-slate-800",

    btnNuevoBg: "bg-[#ECC94B]",
    btnNuevoText: "text-slate-900",
    btnNuevoHover: "hover:bg-[#D69E2E]",
  },

  blue: {
    titleText: "text-[#0B3C7A]",

    cardBorder: "border-[#6ec1ff]/50",
    cardBg: "bg-gradient-to-br from-[#6ec1ff]/22 via-[#cfe9ff]/35 to-white",

    panelBorder: "border-[#6ec1ff]/45",
    panelBg: "bg-white/90",

    headerBg: "bg-[#2F6FED]",
    headerText: "text-white",

    rowHover: "hover:bg-[#cfe9ff]/55",

    inputBorder: "border-[#6ec1ff]/55",
    inputFocusRing: "focus:ring-[#6ec1ff]",
    inputText: "text-[#0B3C7A]",
    inputPlaceholder: "placeholder:text-[#2B6CB0]/55",

    badgeActivoBg: "bg-green-100",
    badgeActivoText: "text-green-700",
    badgeInactivoBg: "bg-yellow-100",
    badgeInactivoText: "text-yellow-800",

    btnReloadBorder: "border-[#6ec1ff]/55",
    btnReloadBg: "bg-white",
    btnReloadText: "text-[#0B3C7A]",
    btnReloadHover: "hover:bg-[#cfe9ff]/55",

    btnNuevoBg: "bg-[#ECC94B]",
    btnNuevoText: "text-slate-900",
    btnNuevoHover: "hover:bg-[#D69E2E]",
  },

  green: {
    titleText: "text-[#22543D]",

    cardBorder: "border-[#89fb74]/50",
    cardBg: "bg-gradient-to-br from-[#89fb74]/18 via-[#cfffcc]/35 to-white",

    panelBorder: "border-[#89fb74]/45",
    panelBg: "bg-white/90",

    headerBg: "bg-[#22C55E]",
    headerText: "text-white",

    rowHover: "hover:bg-[#cfffcc]/60",

    inputBorder: "border-[#89fb74]/55",
    inputFocusRing: "focus:ring-[#89fb74]",
    inputText: "text-[#22543D]",
    inputPlaceholder: "placeholder:text-[#2F855A]/55",

    badgeActivoBg: "bg-green-100",
    badgeActivoText: "text-green-700",
    badgeInactivoBg: "bg-yellow-100",
    badgeInactivoText: "text-yellow-800",

    btnReloadBorder: "border-[#89fb74]/55",
    btnReloadBg: "bg-white",
    btnReloadText: "text-[#22543D]",
    btnReloadHover: "hover:bg-[#cfffcc]/60",

    btnNuevoBg: "bg-[#ECC94B]",
    btnNuevoText: "text-slate-900",
    btnNuevoHover: "hover:bg-[#D69E2E]",
  },

  candy: {
    titleText: "text-[#5A189A]",

    cardBorder: "border-[#dd63ff]/45",
    cardBg: "bg-gradient-to-br from-[#dd63ff]/16 via-[#f1ccff]/35 to-white",

    panelBorder: "border-[#dd63ff]/40",
    panelBg: "bg-white/90",

    headerBg: "bg-[#C026D3]",
    headerText: "text-white",

    rowHover: "hover:bg-[#f1ccff]/60",

    inputBorder: "border-[#dd63ff]/45",
    inputFocusRing: "focus:ring-[#dd63ff]",
    inputText: "text-[#5A189A]",
    inputPlaceholder: "placeholder:text-[#9D4EDD]/70",

    badgeActivoBg: "bg-green-100",
    badgeActivoText: "text-green-700",
    badgeInactivoBg: "bg-yellow-100",
    badgeInactivoText: "text-yellow-800",

    btnReloadBorder: "border-[#dd63ff]/40",
    btnReloadBg: "bg-white",
    btnReloadText: "text-[#5A189A]",
    btnReloadHover: "hover:bg-[#f1ccff]/60",

    btnNuevoBg: "bg-[#ECC94B]",
    btnNuevoText: "text-slate-900",
    btnNuevoHover: "hover:bg-[#D69E2E]",
  },
};

export function getMovimientosInventarioThemeFromContentBg(
  contentBg: ContentBg,
): MovimientosInventarioTheme {
  return THEMES[contentBg] ?? THEMES.light;
}