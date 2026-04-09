// src/modules/dashboard/types/pagos/dashboard_pagos.types.ts
// Types del dashboard de pagos.
// Responsabilidades:
// - definir el modelo de resumen de pagos
// - definir los filtros por rango de fechas
// - definir los filtros por fecha específica
// - definir los filtros de búsqueda

export type DashboardPagosResumenItem = {
  fecha: string;
  id_sucursal: number;
  id_forma_pago: number;
  anio: number;
  mes: number;
  dia: number;
  sucursal_nombre: string;
  forma_pago_codigo: string;
  forma_pago_nombre: string;
  total_monto: string;
  numero_transacciones: number;
};

export type DashboardPagosResumenRangoQuery = {
  fecha_inicio: string;
  fecha_fin: string;
  id_sucursal?: number;
};

export type DashboardPagosResumenFechaQuery = {
  fecha: string;
  id_sucursal?: number;
};

export type DashboardPagosResumenBuscarQuery = {
  q: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  id_sucursal?: number;
  limit?: number;
  offset?: number;
};