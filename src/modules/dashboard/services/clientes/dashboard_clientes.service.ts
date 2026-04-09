// src/modules/dashboard/services/clientes/dashboard_clientes_resumen.service.ts
// Service del dashboard de clientes para resumen comercial.
// Responsabilidades:
// - listar resumen de clientes
// - listar top de clientes
// - buscar clientes
// - obtener un cliente por id
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardClientesResumenBuscarQuery,
  DashboardClientesResumenItem,
  DashboardClientesResumenTopQuery,
} from "../../types/clientes/dashboard_clientes_resumen.types";

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

export const dashboardClientesResumenService = {
  // GET /dashboard/clientes/resumen
  async listar(): Promise<DashboardClientesResumenItem[]> {
    const { data } = await httpClient.get<DashboardClientesResumenItem[]>(
      `/dashboard/clientes/resumen`
    );
    return data;
  },

  // GET /dashboard/clientes/resumen/top
  async listarTop(
    params?: DashboardClientesResumenTopQuery
  ): Promise<DashboardClientesResumenItem[]> {
    const qs = buildQuery(params ?? {});
    const { data } = await httpClient.get<DashboardClientesResumenItem[]>(
      `/dashboard/clientes/resumen/top${qs}`
    );
    return data;
  },

  // GET /dashboard/clientes/resumen/buscar
  async buscar(
    params: DashboardClientesResumenBuscarQuery
  ): Promise<DashboardClientesResumenItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardClientesResumenItem[]>(
      `/dashboard/clientes/resumen/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/clientes/resumen/{id_cliente}
  async obtener(id_cliente: number): Promise<DashboardClientesResumenItem> {
    const { data } = await httpClient.get<DashboardClientesResumenItem>(
      `/dashboard/clientes/resumen/${id_cliente}`
    );
    return data;
  },
};