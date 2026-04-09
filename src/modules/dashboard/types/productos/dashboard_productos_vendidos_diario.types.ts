// src/modules/dashboard/types/productos/dashboard_productos_vendidos_diario.types.ts
// Types del dashboard de productos vendidos por día.
// Responsabilidades:
// - definir el modelo de productos vendidos diario
// - definir queries por fecha y semana actual

export type DashboardProductosVendidosDiarioItem = {
  fecha: string;
  id_sucursal: number;
  id_producto: number;
  anio: number;
  mes: number;
  dia: number;
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

export type DashboardProductosVendidosDiarioFechaQuery = {
  fecha: string;
  id_sucursal?: number;
  limit?: number;
};

export type DashboardProductosVendidosDiarioSemanaActualQuery = {
  id_sucursal?: number;
  fecha_base?: string;
  limit?: number;
};