// src/modules/dashboard/services/productos/dashboard_productos_vendidos.service.ts
// Service del dashboard de productos para productos vendidos.
// Responsabilidades:
// - listar productos vendidos por rango de fechas
// - obtener productos vendidos por fecha
// - obtener productos vendidos de la semana actual
// - buscar productos vendidos
// - listar productos vendidos mensual (histórico)
// - listar productos vendidos mensual por año
// - listar productos vendidos mensual por año y mes
// - buscar productos vendidos mensual
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardProductosVendidosBuscarQuery,
  DashboardProductosVendidosDiarioItem,
  DashboardProductosVendidosFechaQuery,
  DashboardProductosVendidosMensualAnioMesQuery,
  DashboardProductosVendidosMensualAnioQuery,
  DashboardProductosVendidosMensualBuscarQuery,
  DashboardProductosVendidosMensualItem,
  DashboardProductosVendidosRangoQuery,
  DashboardProductosVendidosSemanaQuery,
} from "../../types/productos/dashboard_productos_vendidos.types";

// Helpers de query
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

export const dashboardProductosVendidosService = {
  // GET /dashboard/productos/vendidos-diario
  async listar(
    params: DashboardProductosVendidosRangoQuery
  ): Promise<DashboardProductosVendidosDiarioItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardProductosVendidosDiarioItem[]>(
      `/dashboard/productos/vendidos-diario${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/vendidos-diario/fecha
  async obtenerPorFecha(
    params: DashboardProductosVendidosFechaQuery
  ): Promise<DashboardProductosVendidosDiarioItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardProductosVendidosDiarioItem[]>(
      `/dashboard/productos/vendidos-diario/fecha${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/vendidos-diario/semana-actual
  async obtenerSemanaActual(
    params?: DashboardProductosVendidosSemanaQuery
  ): Promise<DashboardProductosVendidosDiarioItem[]> {
    const qs = buildQuery(params ?? {});
    const { data } = await httpClient.get<DashboardProductosVendidosDiarioItem[]>(
      `/dashboard/productos/vendidos-diario/semana-actual${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/vendidos-diario/buscar
  async buscar(
    params: DashboardProductosVendidosBuscarQuery
  ): Promise<DashboardProductosVendidosDiarioItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardProductosVendidosDiarioItem[]>(
      `/dashboard/productos/vendidos-diario/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/vendidos-mensual
  async listarMensual(): Promise<DashboardProductosVendidosMensualItem[]> {
    const { data } = await httpClient.get<DashboardProductosVendidosMensualItem[]>(
      `/dashboard/productos/vendidos-mensual`
    );
    return data;
  },

  // GET /dashboard/productos/vendidos-mensual/anio
  async listarMensualPorAnio(
    params: DashboardProductosVendidosMensualAnioQuery
  ): Promise<DashboardProductosVendidosMensualItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardProductosVendidosMensualItem[]>(
      `/dashboard/productos/vendidos-mensual/anio${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/vendidos-mensual/anio-mes
  async listarMensualPorAnioMes(
    params: DashboardProductosVendidosMensualAnioMesQuery
  ): Promise<DashboardProductosVendidosMensualItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardProductosVendidosMensualItem[]>(
      `/dashboard/productos/vendidos-mensual/anio-mes${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/vendidos-mensual/buscar
  async buscarMensual(
    params: DashboardProductosVendidosMensualBuscarQuery
  ): Promise<DashboardProductosVendidosMensualItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardProductosVendidosMensualItem[]>(
      `/dashboard/productos/vendidos-mensual/buscar${qs}`
    );
    return data;
  },
};