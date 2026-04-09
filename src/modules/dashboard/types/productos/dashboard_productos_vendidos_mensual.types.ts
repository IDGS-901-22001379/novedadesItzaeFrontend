// src/modules/dashboard/types/productos/dashboard_productos_vendidos_mensual.types.ts
// Types del dashboard de productos vendidos por mes.
// Responsabilidades:
// - definir el modelo de productos vendidos mensual
// - definir query por año y mes

export type DashboardProductosVendidosMensualItem = {
  anio: number;
  mes: number;
  id_sucursal: number;
  id_producto: number;
  sucursal_nombre: string;
  sku: string;
  codigo_barras: string;
  producto_nombre: string;
  modelo: string;
  stock_minimo_tienda: number;
  cantidad_vendida: string;
  importe_vendido: string;
  tickets_en_los_que_aparece: number;
};

export type DashboardProductosVendidosMensualAnioMesQuery = {
  anio: number;
  mes: number;
  id_sucursal?: number;
  limit?: number;
};