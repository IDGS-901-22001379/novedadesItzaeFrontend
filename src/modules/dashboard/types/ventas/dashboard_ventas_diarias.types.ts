// src/modules/dashboard/types/ventas/dashboard_ventas_diarias.types.ts
// Types del dashboard de ventas para consultas diarias.
// Responsabilidades:
// - definir el modelo de ventas diarias
// - definir los filtros para rango de fechas
// - definir los filtros para fecha específica
// - definir los filtros para semana actual
// - definir los filtros para consulta mensual por día

export type DashboardVentasDiariasItem = {
  fecha: string;
  id_sucursal: number;
  anio: number;
  mes: number;
  dia: number;
  sucursal_nombre: string;
  tickets: number;
  total_vendido: string;
  promedio_por_venta: string;
  clientes_atendidos: number;
  productos_vendidos: string;
};

export type DashboardVentasDiariasRangoQuery = {
  fecha_inicio: string;
  fecha_fin: string;
  id_sucursal?: number;
};

export type DashboardVentasDiariasFechaQuery = {
  fecha: string;
  id_sucursal?: number;
};

export type DashboardVentasDiariasSemanaActualQuery = {
  id_sucursal?: number;
  fecha_base?: string;
};

export type DashboardVentasDiariasMesQuery = {
  anio: number;
  mes: number;
  id_sucursal?: number;
};