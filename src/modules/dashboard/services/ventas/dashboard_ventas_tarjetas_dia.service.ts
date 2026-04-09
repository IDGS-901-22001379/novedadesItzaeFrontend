// src/modules/dashboard/services/ventas/dashboard_ventas_tarjetas_dia.service.ts
// Service del dashboard de ventas para tarjetas del día.
// Responsabilidades:
// - listar tarjetas del día
// - obtener el registro principal de tarjetas del día
// - obtener tarjetas del día por apertura
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardVentasTarjetasDiaItem,
  DashboardVentasTarjetasDiaQuery,
} from "../../types/ventas/dashboard_ventas_tarjetas_dia.types";

// Convierte filtros a querystring
function buildQuery(params?: DashboardVentasTarjetasDiaQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardVentasTarjetasDiaService = {
  // GET /dashboard/ventas/tarjetas-dia
  async listar(
    params?: DashboardVentasTarjetasDiaQuery
  ): Promise<DashboardVentasTarjetasDiaItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardVentasTarjetasDiaItem[]>(
      `/dashboard/ventas/tarjetas-dia${qs}`
    );
    return data;
  },

  // GET /dashboard/ventas/tarjetas-dia/principal
  async obtenerPrincipal(
    params?: DashboardVentasTarjetasDiaQuery
  ): Promise<DashboardVentasTarjetasDiaItem> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardVentasTarjetasDiaItem>(
      `/dashboard/ventas/tarjetas-dia/principal${qs}`
    );
    return data;
  },

  // GET /dashboard/ventas/tarjetas-dia/{id_apertura}
  async obtenerPorApertura(
    id_apertura: number
  ): Promise<DashboardVentasTarjetasDiaItem> {
    const { data } = await httpClient.get<DashboardVentasTarjetasDiaItem>(
      `/dashboard/ventas/tarjetas-dia/${id_apertura}`
    );
    return data;
  },
};