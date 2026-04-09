// src/modules/dashboard/types/ventas/dashboard_ventas_mensuales.types.ts
// Types del dashboard de ventas para consultas mensuales.
// Responsabilidades:
// - definir el modelo de ventas mensuales
// - definir los filtros para consulta por año
// - definir los filtros para consulta por año y mes
// - definir los filtros para consulta por rango de año/mes

export type DashboardVentasMensualesItem = {
  anio: number;
  mes: number;
  id_sucursal: number;
  sucursal_nombre: string;
  tickets: number;
  total_vendido: string;
  promedio_por_venta: string;
  clientes_atendidos: number;
  productos_vendidos: string;
};

export type DashboardVentasMensualesAnioQuery = {
  anio: number;
  id_sucursal?: number;
};

export type DashboardVentasMensualesAnioMesQuery = {
  anio: number;
  mes: number;
  id_sucursal?: number;
};

export type DashboardVentasMensualesRangoQuery = {
  anio_inicio: number;
  mes_inicio: number;
  anio_fin: number;
  mes_fin: number;
  id_sucursal?: number;
};