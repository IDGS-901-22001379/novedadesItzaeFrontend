// src/modules/dashboard/services/ventas/dashboard_ventas_mensuales.service.ts
// Service del dashboard de ventas para consultas mensuales.
// Responsabilidades:
// - listar todo el histórico mensual disponible
// - listar ventas mensuales por año
// - obtener ventas mensuales por año y mes
// - listar ventas mensuales por rango de año/mes
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardVentasMensualesAnioMesQuery,
  DashboardVentasMensualesAnioQuery,
  DashboardVentasMensualesItem,
  DashboardVentasMensualesRangoQuery,
} from "../../types/ventas/dashboard_ventas_mensuales.types";

// Convierte filtros por año a querystring
function buildAnioQuery(params: DashboardVentasMensualesAnioQuery): string {
  const sp = new URLSearchParams();

  sp.set("anio", String(params.anio));

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros por año y mes a querystring
function buildAnioMesQuery(params: DashboardVentasMensualesAnioMesQuery): string {
  const sp = new URLSearchParams();

  sp.set("anio", String(params.anio));
  sp.set("mes", String(params.mes));

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros por rango de año/mes a querystring
function buildRangoQuery(params: DashboardVentasMensualesRangoQuery): string {
  const sp = new URLSearchParams();

  sp.set("anio_inicio", String(params.anio_inicio));
  sp.set("mes_inicio", String(params.mes_inicio));
  sp.set("anio_fin", String(params.anio_fin));
  sp.set("mes_fin", String(params.mes_fin));

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardVentasMensualesService = {
  // GET /dashboard/ventas/mensuales
  async listarTodo(): Promise<DashboardVentasMensualesItem[]> {
    const { data } = await httpClient.get<DashboardVentasMensualesItem[]>(
      `/dashboard/ventas/mensuales`
    );
    return data;
  },

  // GET /dashboard/ventas/mensuales/anio
  async listarPorAnio(
    params: DashboardVentasMensualesAnioQuery
  ): Promise<DashboardVentasMensualesItem[]> {
    const qs = buildAnioQuery(params);
    const { data } = await httpClient.get<DashboardVentasMensualesItem[]>(
      `/dashboard/ventas/mensuales/anio${qs}`
    );
    return data;
  },

  // GET /dashboard/ventas/mensuales/anio-mes
  async obtenerPorAnioMes(
    params: DashboardVentasMensualesAnioMesQuery
  ): Promise<DashboardVentasMensualesItem[]> {
    const qs = buildAnioMesQuery(params);
    const { data } = await httpClient.get<DashboardVentasMensualesItem[]>(
      `/dashboard/ventas/mensuales/anio-mes${qs}`
    );
    return data;
  },

  // GET /dashboard/ventas/mensuales/rango
  async listarPorRango(
    params: DashboardVentasMensualesRangoQuery
  ): Promise<DashboardVentasMensualesItem[]> {
    const qs = buildRangoQuery(params);
    const { data } = await httpClient.get<DashboardVentasMensualesItem[]>(
      `/dashboard/ventas/mensuales/rango${qs}`
    );
    return data;
  },
};