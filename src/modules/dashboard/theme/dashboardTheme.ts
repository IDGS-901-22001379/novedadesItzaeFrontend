// src/modules/dashboard/theme/dashboardTheme.ts
// Tema visual general del módulo Dashboard.
// Responsabilidades:
// - traducir el content_bg del Topbar a clases Tailwind y colores consistentes
// - definir colores para cards, paneles, headers y contornos
// - definir colores auxiliares para gráficas del dashboard
// - mantener consistencia visual con los 5 temas globales del sistema

export type ContentBg = "light" | "dark" | "blue" | "green" | "candy";

export type DashboardTheme = {
  titleText: string;
  subtitleText: string;

  cardBorder: string;
  cardBg: string;
  cardSoftBg: string;

  panelBorder: string;
  panelBg: string;

  headerBg: string;
  headerText: string;

  sectionTitle: string;
  sectionHint: string;

  rowHover: string;

  inputBorder: string;
  inputFocusRing: string;
  inputText: string;
  inputPlaceholder: string;

  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnPrimaryHover: string;

  btnSecondaryBorder: string;
  btnSecondaryBg: string;
  btnSecondaryText: string;
  btnSecondaryHover: string;

  badgeSuccessBg: string;
  badgeSuccessText: string;
  badgeWarningBg: string;
  badgeWarningText: string;
  badgeDangerBg: string;
  badgeDangerText: string;
  badgeInfoBg: string;
  badgeInfoText: string;

  // Gráficas del dashboard
  chartGrid: string;
  chartAxis: string;
  chartTooltipBg: string;
  chartTooltipText: string;

  chartPrimary: string;
  chartPrimarySoft: string;

  chartSecondary: string;
  chartSecondarySoft: string;

  chartAccent: string;
  chartAccentSoft: string;

  chartSuccess: string;
  chartWarning: string;
  chartDanger: string;
};

const THEMES: Record<ContentBg, DashboardTheme> = {
  light: {
    titleText: "text-slate-900",
    subtitleText: "text-slate-500",

    cardBorder: "border-slate-200/70",
    cardBg: "bg-white",
    cardSoftBg: "bg-slate-50/80",

    panelBorder: "border-slate-200/60",
    panelBg: "bg-white/90",

    headerBg: "bg-slate-800",
    headerText: "text-white",

    sectionTitle: "text-slate-800",
    sectionHint: "text-slate-500",

    rowHover: "hover:bg-slate-50",

    inputBorder: "border-slate-200/70",
    inputFocusRing: "focus:ring-slate-300",
    inputText: "text-slate-900",
    inputPlaceholder: "placeholder:text-slate-400",

    btnPrimaryBg: "bg-slate-800",
    btnPrimaryText: "text-white",
    btnPrimaryHover: "hover:bg-slate-700",

    btnSecondaryBorder: "border-slate-200/70",
    btnSecondaryBg: "bg-white",
    btnSecondaryText: "text-slate-900",
    btnSecondaryHover: "hover:bg-slate-50",

    badgeSuccessBg: "bg-green-100",
    badgeSuccessText: "text-green-700",
    badgeWarningBg: "bg-yellow-100",
    badgeWarningText: "text-yellow-800",
    badgeDangerBg: "bg-red-100",
    badgeDangerText: "text-red-700",
    badgeInfoBg: "bg-sky-100",
    badgeInfoText: "text-sky-700",

    chartGrid: "stroke-slate-200",
    chartAxis: "text-slate-500",
    chartTooltipBg: "bg-white",
    chartTooltipText: "text-slate-900",

    chartPrimary: "#334155",
    chartPrimarySoft: "#94A3B8",

    chartSecondary: "#3B82F6",
    chartSecondarySoft: "#93C5FD",

    chartAccent: "#8B5CF6",
    chartAccentSoft: "#C4B5FD",

    chartSuccess: "#22C55E",
    chartWarning: "#F59E0B",
    chartDanger: "#EF4444",
  },

  dark: {
    titleText: "text-white",
    subtitleText: "text-white/60",

    cardBorder: "border-white/10",
    cardBg: "bg-slate-950",
    cardSoftBg: "bg-slate-900/70",

    panelBorder: "border-white/10",
    panelBg: "bg-slate-900/60",

    headerBg: "bg-slate-950",
    headerText: "text-white",

    sectionTitle: "text-white",
    sectionHint: "text-white/55",

    rowHover: "hover:bg-white/5",

    inputBorder: "border-white/10",
    inputFocusRing: "focus:ring-slate-500/50",
    inputText: "text-white",
    inputPlaceholder: "placeholder:text-white/40",

    btnPrimaryBg: "bg-white",
    btnPrimaryText: "text-slate-900",
    btnPrimaryHover: "hover:bg-slate-200",

    btnSecondaryBorder: "border-white/10",
    btnSecondaryBg: "bg-slate-900",
    btnSecondaryText: "text-white",
    btnSecondaryHover: "hover:bg-slate-800",

    badgeSuccessBg: "bg-green-200",
    badgeSuccessText: "text-green-900",
    badgeWarningBg: "bg-yellow-200",
    badgeWarningText: "text-yellow-900",
    badgeDangerBg: "bg-red-200",
    badgeDangerText: "text-red-900",
    badgeInfoBg: "bg-sky-200",
    badgeInfoText: "text-sky-900",

    chartGrid: "stroke-white/10",
    chartAxis: "text-white/55",
    chartTooltipBg: "bg-slate-900",
    chartTooltipText: "text-white",

    chartPrimary: "#E2E8F0",
    chartPrimarySoft: "#94A3B8",

    chartSecondary: "#60A5FA",
    chartSecondarySoft: "#93C5FD",

    chartAccent: "#A78BFA",
    chartAccentSoft: "#C4B5FD",

    chartSuccess: "#4ADE80",
    chartWarning: "#FBBF24",
    chartDanger: "#F87171",
  },

  blue: {
    titleText: "text-[#0B3C7A]",
    subtitleText: "text-[#2B6CB0]",

    cardBorder: "border-[#6ec1ff]/50",
    cardBg: "bg-gradient-to-br from-[#6ec1ff]/22 via-[#cfe9ff]/35 to-white",
    cardSoftBg: "bg-[#e9f6ff]/90",

    panelBorder: "border-[#6ec1ff]/45",
    panelBg: "bg-white/90",

    headerBg: "bg-[#2F6FED]",
    headerText: "text-white",

    sectionTitle: "text-[#0B3C7A]",
    sectionHint: "text-[#2B6CB0]/70",

    rowHover: "hover:bg-[#cfe9ff]/55",

    inputBorder: "border-[#6ec1ff]/55",
    inputFocusRing: "focus:ring-[#6ec1ff]",
    inputText: "text-[#0B3C7A]",
    inputPlaceholder: "placeholder:text-[#2B6CB0]/55",

    btnPrimaryBg: "bg-[#2F6FED]",
    btnPrimaryText: "text-white",
    btnPrimaryHover: "hover:bg-[#2459C7]",

    btnSecondaryBorder: "border-[#6ec1ff]/55",
    btnSecondaryBg: "bg-white",
    btnSecondaryText: "text-[#0B3C7A]",
    btnSecondaryHover: "hover:bg-[#cfe9ff]/55",

    badgeSuccessBg: "bg-green-100",
    badgeSuccessText: "text-green-700",
    badgeWarningBg: "bg-yellow-100",
    badgeWarningText: "text-yellow-800",
    badgeDangerBg: "bg-red-100",
    badgeDangerText: "text-red-700",
    badgeInfoBg: "bg-sky-100",
    badgeInfoText: "text-sky-700",

    chartGrid: "stroke-[#cfe9ff]",
    chartAxis: "text-[#2B6CB0]",
    chartTooltipBg: "bg-white",
    chartTooltipText: "text-[#0B3C7A]",

    chartPrimary: "#2F6FED",
    chartPrimarySoft: "#6EC1FF",

    chartSecondary: "#38BDF8",
    chartSecondarySoft: "#BAE6FD",

    chartAccent: "#6366F1",
    chartAccentSoft: "#C7D2FE",

    chartSuccess: "#22C55E",
    chartWarning: "#F59E0B",
    chartDanger: "#EF4444",
  },

  green: {
    titleText: "text-[#22543D]",
    subtitleText: "text-[#2F855A]",

    cardBorder: "border-[#89fb74]/50",
    cardBg: "bg-gradient-to-br from-[#89fb74]/18 via-[#cfffcc]/35 to-white",
    cardSoftBg: "bg-[#efffeb]/90",

    panelBorder: "border-[#89fb74]/45",
    panelBg: "bg-white/90",

    headerBg: "bg-[#22C55E]",
    headerText: "text-white",

    sectionTitle: "text-[#22543D]",
    sectionHint: "text-[#2F855A]/70",

    rowHover: "hover:bg-[#cfffcc]/60",

    inputBorder: "border-[#89fb74]/55",
    inputFocusRing: "focus:ring-[#89fb74]",
    inputText: "text-[#22543D]",
    inputPlaceholder: "placeholder:text-[#2F855A]/55",

    btnPrimaryBg: "bg-[#22C55E]",
    btnPrimaryText: "text-white",
    btnPrimaryHover: "hover:bg-[#16A34A]",

    btnSecondaryBorder: "border-[#89fb74]/55",
    btnSecondaryBg: "bg-white",
    btnSecondaryText: "text-[#22543D]",
    btnSecondaryHover: "hover:bg-[#cfffcc]/60",

    badgeSuccessBg: "bg-green-100",
    badgeSuccessText: "text-green-700",
    badgeWarningBg: "bg-yellow-100",
    badgeWarningText: "text-yellow-800",
    badgeDangerBg: "bg-red-100",
    badgeDangerText: "text-red-700",
    badgeInfoBg: "bg-emerald-100",
    badgeInfoText: "text-emerald-700",

    chartGrid: "stroke-[#d9fdd3]",
    chartAxis: "text-[#2F855A]",
    chartTooltipBg: "bg-white",
    chartTooltipText: "text-[#22543D]",

    chartPrimary: "#22C55E",
    chartPrimarySoft: "#86EFAC",

    chartSecondary: "#10B981",
    chartSecondarySoft: "#A7F3D0",

    chartAccent: "#65A30D",
    chartAccentSoft: "#D9F99D",

    chartSuccess: "#16A34A",
    chartWarning: "#F59E0B",
    chartDanger: "#EF4444",
  },

  candy: {
    titleText: "text-[#5A189A]",
    subtitleText: "text-[#9D4EDD]",

    cardBorder: "border-[#dd63ff]/45",
    cardBg: "bg-gradient-to-br from-[#dd63ff]/16 via-[#f1ccff]/35 to-white",
    cardSoftBg: "bg-[#fbf2ff]/90",

    panelBorder: "border-[#dd63ff]/40",
    panelBg: "bg-white/90",

    headerBg: "bg-[#C026D3]",
    headerText: "text-white",

    sectionTitle: "text-[#5A189A]",
    sectionHint: "text-[#9D4EDD]/75",

    rowHover: "hover:bg-[#f1ccff]/60",

    inputBorder: "border-[#dd63ff]/45",
    inputFocusRing: "focus:ring-[#dd63ff]",
    inputText: "text-[#5A189A]",
    inputPlaceholder: "placeholder:text-[#9D4EDD]/70",

    btnPrimaryBg: "bg-[#C026D3]",
    btnPrimaryText: "text-white",
    btnPrimaryHover: "hover:bg-[#A21CAF]",

    btnSecondaryBorder: "border-[#dd63ff]/40",
    btnSecondaryBg: "bg-white",
    btnSecondaryText: "text-[#5A189A]",
    btnSecondaryHover: "hover:bg-[#f1ccff]/60",

    badgeSuccessBg: "bg-green-100",
    badgeSuccessText: "text-green-700",
    badgeWarningBg: "bg-yellow-100",
    badgeWarningText: "text-yellow-800",
    badgeDangerBg: "bg-red-100",
    badgeDangerText: "text-red-700",
    badgeInfoBg: "bg-fuchsia-100",
    badgeInfoText: "text-fuchsia-700",

    chartGrid: "stroke-[#f1ccff]",
    chartAxis: "text-[#9D4EDD]",
    chartTooltipBg: "bg-white",
    chartTooltipText: "text-[#5A189A]",

    chartPrimary: "#C026D3",
    chartPrimarySoft: "#E879F9",

    chartSecondary: "#A855F7",
    chartSecondarySoft: "#D8B4FE",

    chartAccent: "#EC4899",
    chartAccentSoft: "#F9A8D4",

    chartSuccess: "#22C55E",
    chartWarning: "#F59E0B",
    chartDanger: "#EF4444",
  },
};

export function getDashboardThemeFromContentBg(contentBg: ContentBg): DashboardTheme {
  return THEMES[contentBg] ?? THEMES.light;
}