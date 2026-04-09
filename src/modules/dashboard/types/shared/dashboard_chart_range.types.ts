// src/modules/dashboard/types/shared/dashboard_chart_range.types.ts
// Types compartidos para rangos de gráficas del dashboard.
// Responsabilidades:
// - definir los rangos permitidos para gráficas
// - definir las opciones del selector de rango

export type DashboardChartRange = "7d" | "15d" | "30d" | "6m" | "1y";

export type DashboardChartRangeOption = {
  value: DashboardChartRange;
  label: string;
};

export const DASHBOARD_CHART_RANGE_OPTIONS: DashboardChartRangeOption[] = [
  { value: "7d", label: "7 días" },
  { value: "15d", label: "15 días" },
  { value: "30d", label: "30 días" },
  { value: "6m", label: "6 meses" },
  { value: "1y", label: "1 año" },
];