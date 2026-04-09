// src/modules/dashboard/types/productos/dashboard_productos_vendidos.types.ts
// Types del dashboard de productos para productos vendidos.
// Responsabilidades:
// - definir el modelo de productos vendidos diario
// - definir el modelo de productos vendidos mensual
// - definir los filtros por rango de fechas
// - definir los filtros por fecha específica
// - definir los filtros para semana actual
// - definir los filtros de búsqueda rápida
// - definir los filtros por año y mes

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

export type DashboardProductosVendidosRangoQuery = {
  fecha_inicio: string;
  fecha_fin: string;
  id_sucursal?: number;
  limit?: number;
};

export type DashboardProductosVendidosFechaQuery = {
  fecha: string;
  id_sucursal?: number;
  limit?: number;
};

export type DashboardProductosVendidosSemanaQuery = {
  id_sucursal?: number;
  fecha_base?: string;
  limit?: number;
};

export type DashboardProductosVendidosBuscarQuery = {
  q: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  id_sucursal?: number;
  limit?: number;
  offset?: number;
};

export type DashboardProductosVendidosMensualAnioMesQuery = {
  anio: number;
  mes: number;
  id_sucursal?: number;
  limit?: number;
};

export type DashboardProductosVendidosMensualAnioQuery = {
  anio: number;
  id_sucursal?: number;
  limit?: number;
};

export type DashboardProductosVendidosMensualBuscarQuery = {
  q: string;
  anio?: number;
  mes?: number;
  id_sucursal?: number;
  limit?: number;
  offset?: number;
};