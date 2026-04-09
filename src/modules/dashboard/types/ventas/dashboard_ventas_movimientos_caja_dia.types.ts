// src/modules/dashboard/types/ventas/dashboard_ventas_movimientos_caja_dia.types.ts
// Types del dashboard de ventas para movimientos de caja del día.
// Responsabilidades:
// - definir el modelo de movimientos de caja del día
// - definir los filtros permitidos para consulta por sucursal

export type DashboardVentasMovimientosCajaDiaItem = {
  id_apertura: number;
  id_caja: number;
  caja_nombre: string;
  id_sucursal: number;
  sucursal_nombre: string;
  total_entradas_dia: string;
  total_salidas_dia: string;
  entradas_extra_dia: string;
  gastos_dia: string;
  abonos_credito_dia: string;
  reembolsos_devolucion_dia: string;
};

export type DashboardVentasMovimientosCajaDiaQuery = {
  id_sucursal?: number;
};