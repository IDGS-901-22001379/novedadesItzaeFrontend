// src/modules/dashboard/types/creditos/dashboard_creditos.types.ts
// Types del dashboard de créditos.
// Responsabilidades:
// - definir el modelo de resumen general de créditos y cobranza

export type DashboardCreditosResumenItem = {
  id_resumen: number;
  creditos_pendientes: number;
  creditos_parciales: number;
  creditos_liquidados: number;
  saldo_pendiente_total: string;
  creditos_vencidos: number;
  abonos_dia: string;
  abonos_mes: string;
};