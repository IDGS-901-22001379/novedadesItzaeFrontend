// src/modules/dashboard/types/alertas/dashboard_alertas.types.ts
// Types del dashboard de alertas.
// Responsabilidades:
// - definir el modelo del resumen ejecutivo de alertas

export type DashboardAlertasRapidasItem = {
  id_alerta: number;
  productos_agotados: number;
  productos_stock_bajo: number;
  productos_alta_rotacion_sin_stock: number;
  productos_sin_venta_reciente: number;
  hay_creditos_vencidos: number;
  total_creditos_vencidos: number;
};