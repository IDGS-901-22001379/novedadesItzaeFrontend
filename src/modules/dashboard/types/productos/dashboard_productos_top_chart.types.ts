// src/modules/dashboard/types/productos/dashboard_productos_top_chart.types.ts
// Types de la gráfica Top de productos más vendidos del dashboard.
// Responsabilidades:
// - definir el modelo base de un producto vendido para la gráfica
// - definir el modelo procesado para render visual
// - definir la configuración de ruptura de escala
// - definir el resumen estadístico usado para decidir la escala visual

export type DashboardProductosTopChartItem = {
  id_producto: number;
  producto_nombre: string;
  cantidad_vendida: number;
  importe_vendido?: number;
};

export type DashboardProductosTopChartProcessedItem = {
  id_producto: number;
  producto_nombre: string;
  producto_nombre_corto: string;
  cantidad_vendida_real: number;
  cantidad_vendida_visual: number;
  importe_vendido?: number;
  color: string;
  es_valor_alto: boolean;
};

export type DashboardProductosTopChartScaleBreak = {
  enabled: boolean;
  break_start: number;
  break_end: number;
  max_value: number;
};

export type DashboardProductosTopChartStats = {
  max_value: number;
  min_value: number;
  avg_value: number;
  second_max_value: number;
  total_items: number;
};