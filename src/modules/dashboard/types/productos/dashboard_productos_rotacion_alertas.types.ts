// src/modules/dashboard/types/productos/dashboard_productos_rotacion_alertas.types.ts
// Types del dashboard de productos para alertas de rotación.
// Responsabilidades:
// - definir el modelo de productos con alta rotación y sin stock
// - definir el modelo de productos con sobrestock y baja rotación
// - definir los filtros de búsqueda rápida
// - definir los filtros para top de resultados

export type DashboardProductosAltaRotacionSinStockItem = {
  id_producto: number;
  sku: string;
  codigo_barras: string;
  producto_nombre: string;
  modelo: string;
  stock_minimo_tienda: number;
  stock_tienda: number;
  stock_bodega: number;
  stock_total: number;
  cantidad_vendida_90_dias: string;
  importe_vendido_90_dias: string;
};

export type DashboardProductosSobrestockBajaRotacionItem = {
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

export type DashboardProductosRotacionAlertasBuscarQuery = {
  q: string;
  limit?: number;
  offset?: number;
};

export type DashboardProductosRotacionAlertasTopQuery = {
  limit?: number;
};