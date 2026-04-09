// src/modules/dashboard/types/productos/dashboard_productos_stock_alertas.types.ts
// Types del dashboard de productos para alertas de stock.
// Responsabilidades:
// - definir el modelo de productos con stock bajo
// - definir el modelo de productos agotados
// - definir los filtros de búsqueda rápida
// - definir los filtros por estado de stock

export type DashboardProductosStockBajoItem = {
  id_producto: number;
  sku: string;
  codigo_barras: string;
  producto_nombre: string;
  modelo: string;
  stock_minimo_tienda: number;
  stock_tienda: number;
  stock_bodega: number;
  stock_total: number;
  estado_stock: string;
};

export type DashboardProductosAgotadosItem = {
  id_producto: number;
  sku: string;
  codigo_barras: string;
  producto_nombre: string;
  modelo: string;
  estatus: string;
  stock_minimo_tienda: number;
  stock_tienda: number;
  stock_bodega: number;
  stock_total: number;
};

export type DashboardProductosStockAlertasBuscarQuery = {
  q: string;
  limit?: number;
  offset?: number;
};

export type DashboardProductosStockBajoEstadoQuery = {
  estado_stock: string;
};