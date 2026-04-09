// src/modules/dashboard/utils/dashboardProductosTopChart.utils.ts
// Utilidades para la gráfica Top de productos más vendidos del dashboard.
// Responsabilidades:
// - calcular estadísticas base de los productos vendidos
// - decidir si se debe aplicar ruptura visual de escala
// - transformar cantidades reales a cantidades visuales
// - asignar colores a cada barra
// - recortar nombres largos para la gráfica

import type {
  DashboardProductosTopChartItem,
  DashboardProductosTopChartProcessedItem,
  DashboardProductosTopChartScaleBreak,
  DashboardProductosTopChartStats,
} from "../types/productos/dashboard_productos_top_chart.types";

const PRODUCT_CHART_COLORS = [
  "#4F46E5",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#A855F7",
  "#14B8A6",
  "#84CC16",
  "#F97316",
  "#EC4899",
];

export function truncateProductName(name: string, maxLength = 22): string {
  const safe = String(name ?? "").trim();
  if (safe.length <= maxLength) return safe;
  return `${safe.slice(0, maxLength - 3)}...`;
}

export function getProductChartColor(index: number): string {
  return PRODUCT_CHART_COLORS[index % PRODUCT_CHART_COLORS.length];
}

export function getTopChartStats(
  items: DashboardProductosTopChartItem[]
): DashboardProductosTopChartStats {
  if (items.length === 0) {
    return {
      max_value: 0,
      min_value: 0,
      avg_value: 0,
      second_max_value: 0,
      total_items: 0,
    };
  }

  const values = items.map((item) => Number(item.cantidad_vendida) || 0);
  const sortedDesc = [...values].sort((a, b) => b - a);

  const max_value = sortedDesc[0] ?? 0;
  const second_max_value = sortedDesc[1] ?? 0;
  const min_value = Math.min(...values);
  const avg_value =
    values.reduce((acc, value) => acc + value, 0) / Math.max(values.length, 1);

  return {
    max_value,
    min_value,
    avg_value,
    second_max_value,
    total_items: items.length,
  };
}

function roundStep(value: number): number {
  if (value <= 10) return 10;
  if (value <= 20) return 20;
  if (value <= 50) return 50;
  if (value <= 100) return 100;
  if (value <= 200) return 200;
  if (value <= 500) return 500;
  return Math.ceil(value / 100) * 100;
}

export function getTopChartScaleBreak(
  items: DashboardProductosTopChartItem[]
): DashboardProductosTopChartScaleBreak {
  const stats = getTopChartStats(items);

  if (stats.total_items < 3 || stats.max_value <= 0) {
    return {
      enabled: false,
      break_start: 0,
      break_end: 0,
      max_value: stats.max_value,
    };
  }

  const exceedsAverageHard =
    stats.avg_value > 0 && stats.max_value >= stats.avg_value * 2.5;

  const exceedsSecondHard =
    stats.second_max_value > 0 &&
    stats.max_value >= stats.second_max_value * 2;

  if (!exceedsAverageHard && !exceedsSecondHard) {
    return {
      enabled: false,
      break_start: 0,
      break_end: 0,
      max_value: stats.max_value,
    };
  }

  // La escala baja se basará en el segundo valor más alto o en el promedio,
  // para que productos medianos y pequeños sí se vean bien.
  const lowBandBase = Math.max(
    stats.second_max_value > 0 ? stats.second_max_value : 0,
    stats.avg_value * 1.2
  );

  const break_start = roundStep(lowBandBase);

  return {
    enabled: true,
    break_start,
    break_end: break_start,
    max_value: stats.max_value,
  };
}

export function mapRealToVisualValue(
  realValue: number,
  scaleBreak: DashboardProductosTopChartScaleBreak
): number {
  const value = Number(realValue) || 0;

  if (!scaleBreak.enabled) return value;

  // Todo lo que esté en la escala baja se queda igual
  if (value <= scaleBreak.break_start) {
    return value;
  }

  // Banda visual superior fija para que el valor más alto llegue al tope
  const visualGap = Math.max(28, scaleBreak.break_start * 0.15);
  const visualTop = scaleBreak.break_start + visualGap + Math.max(120, scaleBreak.break_start * 0.9);
  const visualHighStart = scaleBreak.break_start + visualGap;

  const realHighRange = Math.max(scaleBreak.max_value - scaleBreak.break_start, 1);
  const ratio = (value - scaleBreak.break_start) / realHighRange;

  return visualHighStart + ratio * (visualTop - visualHighStart);
}

export function processTopChartItems(
  items: DashboardProductosTopChartItem[]
): {
  items: DashboardProductosTopChartProcessedItem[];
  scale_break: DashboardProductosTopChartScaleBreak;
  stats: DashboardProductosTopChartStats;
} {
  const stats = getTopChartStats(items);
  const scale_break = getTopChartScaleBreak(items);

  const processedItems: DashboardProductosTopChartProcessedItem[] = items.map(
    (item, index) => {
      const real = Number(item.cantidad_vendida) || 0;
      const visual = mapRealToVisualValue(real, scale_break);

      return {
        id_producto: item.id_producto,
        producto_nombre: item.producto_nombre,
        producto_nombre_corto: truncateProductName(item.producto_nombre),
        cantidad_vendida_real: real,
        cantidad_vendida_visual: visual,
        importe_vendido: item.importe_vendido,
        color: getProductChartColor(index),
        es_valor_alto: scale_break.enabled && real > scale_break.break_start,
      };
    }
  );

  return {
    items: processedItems,
    scale_break,
    stats,
  };
}