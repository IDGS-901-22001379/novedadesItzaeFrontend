// src/modules/dashboard/services/alertas/dashboard_alertas.service.ts
// Service del dashboard de alertas.
// Responsabilidades:
// - obtener el resumen ejecutivo de alertas
// - listar todas las filas del resumen de alertas

import { httpClient } from "../../../../services/http/httpClient";
import type { DashboardAlertasRapidasItem } from "../../types/alertas/dashboard_alertas.types";

export const dashboardAlertasService = {
  // GET /dashboard/alertas/rapidas
  async obtenerResumen(): Promise<DashboardAlertasRapidasItem> {
    const { data } = await httpClient.get<DashboardAlertasRapidasItem>(
      `/dashboard/alertas/rapidas`
    );
    return data;
  },

  // GET /dashboard/alertas/rapidas/todo
  async listarTodo(): Promise<DashboardAlertasRapidasItem[]> {
    const { data } = await httpClient.get<DashboardAlertasRapidasItem[]>(
      `/dashboard/alertas/rapidas/todo`
    );
    return data;
  },
};