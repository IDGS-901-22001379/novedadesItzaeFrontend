// src/modules/dashboard/services/productos/dashboard_productos_vendidos_diario.service.ts
// Service del dashboard de productos vendidos diario.
// Responsabilidades:
// - obtener productos vendidos por fecha
// - obtener productos vendidos de la semana actual
// - convertir queries a querystring

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardProductosVendidosDiarioFechaQuery,
  DashboardProductosVendidosDiarioItem,
  DashboardProductosVendidosDiarioSemanaActualQuery,
} from "../../types/productos/dashboard_productos_vendidos_diario.types";

function buildFechaQuery(params: DashboardProductosVendidosDiarioFechaQuery): string {
  const sp = new URLSearchParams();

  sp.set("fecha", params.fecha);

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.limit !== undefined) {
    sp.set("limit", String(params.limit));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function buildSemanaActualQuery(
  params?: DashboardProductosVendidosDiarioSemanaActualQuery
): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.fecha_base) {
    sp.set("fecha_base", params.fecha_base);
  }

  if (params.limit !== undefined) {
    sp.set("limit", String(params.limit));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardProductosVendidosDiarioService = {
  // GET /dashboard/productos/vendidos-diario/fecha
  async obtenerPorFecha(
    params: DashboardProductosVendidosDiarioFechaQuery
  ): Promise<DashboardProductosVendidosDiarioItem[]> {
    const qs = buildFechaQuery(params);
    const { data } = await httpClient.get<DashboardProductosVendidosDiarioItem[]>(
      `/dashboard/productos/vendidos-diario/fecha${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/vendidos-diario/semana-actual
  async obtenerSemanaActual(
    params?: DashboardProductosVendidosDiarioSemanaActualQuery
  ): Promise<DashboardProductosVendidosDiarioItem[]> {
    const qs = buildSemanaActualQuery(params);
    const { data } = await httpClient.get<DashboardProductosVendidosDiarioItem[]>(
      `/dashboard/productos/vendidos-diario/semana-actual${qs}`
    );
    return data;
  },
};