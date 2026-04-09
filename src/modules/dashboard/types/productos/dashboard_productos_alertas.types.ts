// src/modules/dashboard/types/productos/dashboard_productos_alertas.types.ts
// Types para alertas y análisis de productos del dashboard.
// Responsabilidades:
// - definir el modelo de productos con stock bajo y alta rotación
// - definir el modelo de productos con sobrestock y baja rotación
// - definir el modelo para predicción de agotamiento
// - definir el modelo de salida para la lista lateral de productos críticos

export type DashboardProductoStockBajoAltaRotacionItem = {
  id_producto: number;
  sku: string;
  codigo_barras: string;
  producto_nombre: string;
  modelo: string;
  stock_minimo_tienda: number;
  stock_tienda: number;
  stock_bodega: number;
  stock_total: number;
  cantidad_vendida_90_dias: number;
  importe_vendido_90_dias?: number;
};

export type DashboardProductoSobrestockBajaRotacionItem = {
  id_producto: number;
  sku: string;
  codigo_barras: string;
  producto_nombre: string;
  modelo: string;
  stock_tienda: number;
  stock_bodega: number;
  stock_total: number;
  cantidad_vendida_60_dias: number;
};

export type DashboardProductoPrediccionAgotamientoItem = {
  id_producto: number;
  producto_nombre: string;
  sku?: string;
  stock_actual: number;
  cantidad_vendida_periodo: number;
  dias_periodo: number;
  promedio_diario: number;
  dias_estimados_agotamiento: number | null;
  estado_alerta: "critico" | "medio" | "estable";
};

export type DashboardProductoAlertaChartItem = {
  id_producto: number;
  producto_nombre: string;
  cantidad: number;
};

export type DashboardProductoPrediccionListItem = {
  id_producto: number;
  producto_nombre: string;
  stock_actual: number;
  promedio_diario: number;
  dias_estimados_agotamiento: number | null;
  estado_alerta: "critico" | "medio" | "estable";
};