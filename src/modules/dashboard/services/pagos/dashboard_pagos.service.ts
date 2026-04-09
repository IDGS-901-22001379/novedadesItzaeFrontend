// src/modules/dashboard/services/pagos/dashboard_pagos.service.ts
// Service del dashboard de pagos.
// Responsabilidades:
// - listar resumen de pagos por rango de fechas
// - obtener resumen de pagos por fecha específica
// - buscar resumen de pagos
// - listar todo el histórico de resumen de pagos
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardPagosResumenBuscarQuery,
  DashboardPagosResumenFechaQuery,
  DashboardPagosResumenItem,
  DashboardPagosResumenRangoQuery,
} from "../../types/pagos/dashboard_pagos.types";

// Convierte filtros a querystring
function buildQuery(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      sp.set(key, String(value));
    }
  });

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardPagosService = {
  // GET /dashboard/pagos/resumen
  async listar(
    params: DashboardPagosResumenRangoQuery
  ): Promise<DashboardPagosResumenItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardPagosResumenItem[]>(
      `/dashboard/pagos/resumen${qs}`
    );
    return data;
  },

  // GET /dashboard/pagos/resumen/fecha
  async obtenerPorFecha(
    params: DashboardPagosResumenFechaQuery
  ): Promise<DashboardPagosResumenItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardPagosResumenItem[]>(
      `/dashboard/pagos/resumen/fecha${qs}`
    );
    return data;
  },

  // GET /dashboard/pagos/resumen/buscar
  async buscar(
    params: DashboardPagosResumenBuscarQuery
  ): Promise<DashboardPagosResumenItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardPagosResumenItem[]>(
      `/dashboard/pagos/resumen/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/pagos/resumen/todo
  async listarTodo(): Promise<DashboardPagosResumenItem[]> {
    const { data } = await httpClient.get<DashboardPagosResumenItem[]>(
      `/dashboard/pagos/resumen/todo`
    );
    return data;
  },
};