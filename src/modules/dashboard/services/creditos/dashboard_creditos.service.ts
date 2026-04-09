// src/modules/dashboard/services/creditos/dashboard_creditos.service.ts
// Service del dashboard de créditos.
// Responsabilidades:
// - obtener el resumen general de créditos y cobranza
// - listar todas las filas del resumen de créditos

import { httpClient } from "../../../../services/http/httpClient";
import type { DashboardCreditosResumenItem } from "../../types/creditos/dashboard_creditos.types";

export const dashboardCreditosService = {
  // GET /dashboard/creditos/resumen
  async obtenerResumen(): Promise<DashboardCreditosResumenItem> {
    const { data } = await httpClient.get<DashboardCreditosResumenItem>(
      `/dashboard/creditos/resumen`
    );
    return data;
  },

  // GET /dashboard/creditos/resumen/todo
  async listarResumenTodo(): Promise<DashboardCreditosResumenItem[]> {
    const { data } = await httpClient.get<DashboardCreditosResumenItem[]>(
      `/dashboard/creditos/resumen/todo`
    );
    return data;
  },
};