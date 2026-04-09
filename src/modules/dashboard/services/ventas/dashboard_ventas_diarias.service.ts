// src/modules/dashboard/services/ventas/dashboard_ventas_diarias.service.ts
// Service del dashboard de ventas para consultas diarias.
// Responsabilidades:
// - listar ventas diarias por rango de fechas
// - obtener ventas diarias por fecha específica
// - obtener ventas diarias de la semana actual
// - obtener ventas diarias de un mes específico
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardVentasDiariasFechaQuery,
  DashboardVentasDiariasItem,
  DashboardVentasDiariasMesQuery,
  DashboardVentasDiariasRangoQuery,
  DashboardVentasDiariasSemanaActualQuery,
} from "../../types/ventas/dashboard_ventas_diarias.types";

// Convierte filtros de rango a querystring
function buildRangoQuery(params: DashboardVentasDiariasRangoQuery): string {
  const sp = new URLSearchParams();

  sp.set("fecha_inicio", params.fecha_inicio);
  sp.set("fecha_fin", params.fecha_fin);

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros por fecha a querystring
function buildFechaQuery(params: DashboardVentasDiariasFechaQuery): string {
  const sp = new URLSearchParams();

  sp.set("fecha", params.fecha);

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros de semana actual a querystring
function buildSemanaActualQuery(params?: DashboardVentasDiariasSemanaActualQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.fecha_base) {
    sp.set("fecha_base", params.fecha_base);
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros de mes a querystring
function buildMesQuery(params: DashboardVentasDiariasMesQuery): string {
  const sp = new URLSearchParams();

  sp.set("anio", String(params.anio));
  sp.set("mes", String(params.mes));

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardVentasDiariasService = {
  // GET /dashboard/ventas/diarias
  async listar(
    params: DashboardVentasDiariasRangoQuery
  ): Promise<DashboardVentasDiariasItem[]> {
    const qs = buildRangoQuery(params);
    const { data } = await httpClient.get<DashboardVentasDiariasItem[]>(
      `/dashboard/ventas/diarias${qs}`
    );
    return data;
  },

  // GET /dashboard/ventas/diarias/fecha
  async obtenerPorFecha(
    params: DashboardVentasDiariasFechaQuery
  ): Promise<DashboardVentasDiariasItem[]> {
    const qs = buildFechaQuery(params);
    const { data } = await httpClient.get<DashboardVentasDiariasItem[]>(
      `/dashboard/ventas/diarias/fecha${qs}`
    );
    return data;
  },

  // GET /dashboard/ventas/diarias/semana-actual
  async obtenerSemanaActual(
    params?: DashboardVentasDiariasSemanaActualQuery
  ): Promise<DashboardVentasDiariasItem[]> {
    const qs = buildSemanaActualQuery(params);
    const { data } = await httpClient.get<DashboardVentasDiariasItem[]>(
      `/dashboard/ventas/diarias/semana-actual${qs}`
    );
    return data;
  },

  // GET /dashboard/ventas/diarias/mes
  async obtenerMes(
    params: DashboardVentasDiariasMesQuery
  ): Promise<DashboardVentasDiariasItem[]> {
    const qs = buildMesQuery(params);
    const { data } = await httpClient.get<DashboardVentasDiariasItem[]>(
      `/dashboard/ventas/diarias/mes${qs}`
    );
    return data;
  },
};