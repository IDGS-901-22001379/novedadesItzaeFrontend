// src/modules/dashboard/services/productos/dashboard_productos_vendidos_mensual.service.ts
// Service del dashboard de productos vendidos mensual.
// Responsabilidades:
// - obtener productos vendidos por año y mes
// - convertir queries a querystring

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardProductosVendidosMensualAnioMesQuery,
  DashboardProductosVendidosMensualItem,
} from "../../types/productos/dashboard_productos_vendidos_mensual.types";

function buildAnioMesQuery(
  params: DashboardProductosVendidosMensualAnioMesQuery
): string {
  const sp = new URLSearchParams();

  sp.set("anio", String(params.anio));
  sp.set("mes", String(params.mes));

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.limit !== undefined) {
    sp.set("limit", String(params.limit));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardProductosVendidosMensualService = {
  // GET /dashboard/productos/vendidos-mensual/anio-mes
  async obtenerPorAnioMes(
    params: DashboardProductosVendidosMensualAnioMesQuery
  ): Promise<DashboardProductosVendidosMensualItem[]> {
    const qs = buildAnioMesQuery(params);
    const { data } = await httpClient.get<DashboardProductosVendidosMensualItem[]>(
      `/dashboard/productos/vendidos-mensual/anio-mes${qs}`
    );
    return data;
  },
};