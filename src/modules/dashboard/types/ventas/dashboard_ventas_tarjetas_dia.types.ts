// src/modules/dashboard/types/ventas/dashboard_ventas_tarjetas_dia.types.ts
// Types del dashboard de ventas para tarjetas del día.
// Responsabilidades:
// - definir el modelo de tarjetas del día
// - definir los filtros permitidos para consulta por sucursal

export type DashboardVentasTarjetasDiaItem = {
  id_apertura: number;
  id_caja: number;
  caja_nombre: string;
  id_sucursal: number;
  sucursal_nombre: string;
  fecha_hora_apertura: string;
  monto_inicial: string;
  tickets_dia: number;
  ventas_dia: string;
  promedio_por_venta: string;
  productos_vendidos_hoy: string;
  clientes_atendidos_hoy: number;
};

export type DashboardVentasTarjetasDiaQuery = {
  id_sucursal?: number;
};