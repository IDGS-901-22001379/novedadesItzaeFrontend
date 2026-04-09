// src/modules/dashboard/types/productos/dashboard_productos_baja_rotacion.types.ts
// Types del dashboard de productos para baja rotación.
// Responsabilidades:
// - definir el modelo de productos con baja rotación
// - definir el modelo de productos sin venta reciente
// - definir los filtros de búsqueda rápida
// - definir los filtros para top de resultados

export type DashboardProductosBajaRotacionItem = {
  id_producto: number;
  sku: string;
  codigo_barras: string;
  producto_nombre: string;
  modelo: string;
  stock_total: number;
  cantidad_vendida_90_dias: number;
};

export type DashboardProductosSinVentaRecienteItem = {
  id_producto: number;
  sku: string;
  codigo_barras: string;
  producto_nombre: string;
  modelo: string;
  stock_tienda: number;
  stock_bodega: number;
  stock_total: number;
};

export type DashboardProductosBajaRotacionBuscarQuery = {
  q: string;
  limit?: number;
  offset?: number;
};

export type DashboardProductosBajaRotacionTopQuery = {
  limit?: number;
};