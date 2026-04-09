// src/modules/dashboard/types/productos/dashboard_productos_stock.types.ts
// Types del dashboard de productos para stock consolidado.
// Responsabilidades:
// - definir el modelo de stock total de productos
// - definir los filtros de búsqueda rápida por producto

export type DashboardProductosStockItem = {
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

export type DashboardProductosStockBuscarQuery = {
  q: string;
  limit?: number;
  offset?: number;
};