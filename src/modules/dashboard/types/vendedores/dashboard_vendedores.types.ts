// src/modules/dashboard/types/vendedores/dashboard_vendedores.types.ts
// Types del dashboard de vendedores.
// Responsabilidades:
// - definir el modelo de ventas diarias por vendedor
// - definir el modelo de ventas mensuales por vendedor
// - definir los filtros por rango de fechas
// - definir los filtros por fecha específica
// - definir los filtros para semana actual
// - definir los filtros de búsqueda diaria
// - definir los filtros de búsqueda mensual
// - definir los filtros por año y mes

export type DashboardVendedoresDiarioItem = {
  fecha: string;
  id_sucursal: number;
  id_usuario: number;
  anio: number;
  mes: number;
  dia: number;
  sucursal_nombre: string;
  username: string;
  nombre_en_ticket: string;
  tickets: number;
  total_vendido: string;
  promedio_por_ticket: string;
};

export type DashboardVendedoresMensualItem = {
  anio: number;
  mes: number;
  id_sucursal: number;
  id_usuario: number;
  sucursal_nombre: string;
  username: string;
  nombre_en_ticket: string;
  tickets: number;
  total_vendido: string;
  promedio_por_ticket: string;
};

export type DashboardVendedoresDiarioRangoQuery = {
  fecha_inicio: string;
  fecha_fin: string;
  id_sucursal?: number;
  limit?: number;
};

export type DashboardVendedoresDiarioFechaQuery = {
  fecha: string;
  id_sucursal?: number;
  limit?: number;
};

export type DashboardVendedoresDiarioSemanaActualQuery = {
  id_sucursal?: number;
  fecha_base?: string;
  limit?: number;
};

export type DashboardVendedoresDiarioBuscarQuery = {
  q: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  id_sucursal?: number;
  limit?: number;
  offset?: number;
};

export type DashboardVendedoresMensualAnioMesQuery = {
  anio: number;
  mes: number;
  id_sucursal?: number;
  limit?: number;
};

export type DashboardVendedoresMensualAnioQuery = {
  anio: number;
  id_sucursal?: number;
  limit?: number;
};

export type DashboardVendedoresMensualBuscarQuery = {
  q: string;
  anio?: number;
  mes?: number;
  id_sucursal?: number;
  limit?: number;
  offset?: number;
};