// src/modules/dashboard/services/ventas/dashboard_ventas_movimientos_caja_dia.service.ts
// Service del dashboard de ventas para movimientos de caja del día.
// Responsabilidades:
// - listar movimientos de caja del día
// - obtener el registro principal de movimientos de caja del día
// - obtener movimientos de caja del día por apertura
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardVentasMovimientosCajaDiaItem,
  DashboardVentasMovimientosCajaDiaQuery,
} from "../../types/ventas/dashboard_ventas_movimientos_caja_dia.types";

// Convierte filtros a querystring
function buildQuery(params?: DashboardVentasMovimientosCajaDiaQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardVentasMovimientosCajaDiaService = {
  // GET /dashboard/ventas/movimientos-caja-dia
  async listar(
    params?: DashboardVentasMovimientosCajaDiaQuery
  ): Promise<DashboardVentasMovimientosCajaDiaItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardVentasMovimientosCajaDiaItem[]>(
      `/dashboard/ventas/movimientos-caja-dia${qs}`
    );
    return data;
  },

  // GET /dashboard/ventas/movimientos-caja-dia/principal
  async obtenerPrincipal(
    params?: DashboardVentasMovimientosCajaDiaQuery
  ): Promise<DashboardVentasMovimientosCajaDiaItem> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardVentasMovimientosCajaDiaItem>(
      `/dashboard/ventas/movimientos-caja-dia/principal${qs}`
    );
    return data;
  },

  // GET /dashboard/ventas/movimientos-caja-dia/{id_apertura}
  async obtenerPorApertura(
    id_apertura: number
  ): Promise<DashboardVentasMovimientosCajaDiaItem> {
    const { data } = await httpClient.get<DashboardVentasMovimientosCajaDiaItem>(
      `/dashboard/ventas/movimientos-caja-dia/${id_apertura}`
    );
    return data;
  },
};