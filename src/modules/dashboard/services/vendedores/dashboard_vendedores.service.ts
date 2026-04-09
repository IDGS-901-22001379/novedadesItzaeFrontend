// src/modules/dashboard/services/vendedores/dashboard_vendedores.service.ts
// Service del dashboard de vendedores.
// Responsabilidades:
// - listar ventas diarias por vendedor en rango de fechas
// - obtener ventas diarias por vendedor en una fecha específica
// - obtener ventas diarias por vendedor de la semana actual
// - buscar ventas diarias por vendedor
// - listar ventas mensuales por vendedor
// - listar ventas mensuales por vendedor por año
// - listar ventas mensuales por vendedor por año y mes
// - buscar ventas mensuales por vendedor
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardVendedoresDiarioBuscarQuery,
  DashboardVendedoresDiarioFechaQuery,
  DashboardVendedoresDiarioItem,
  DashboardVendedoresDiarioRangoQuery,
  DashboardVendedoresDiarioSemanaActualQuery,
  DashboardVendedoresMensualAnioMesQuery,
  DashboardVendedoresMensualAnioQuery,
  DashboardVendedoresMensualBuscarQuery,
  DashboardVendedoresMensualItem,
} from "../../types/vendedores/dashboard_vendedores.types";

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

export const dashboardVendedoresService = {
  // GET /dashboard/vendedores/diario
  async listarDiario(
    params: DashboardVendedoresDiarioRangoQuery
  ): Promise<DashboardVendedoresDiarioItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardVendedoresDiarioItem[]>(
      `/dashboard/vendedores/diario${qs}`
    );
    return data;
  },

  // GET /dashboard/vendedores/diario/fecha
  async obtenerDiarioPorFecha(
    params: DashboardVendedoresDiarioFechaQuery
  ): Promise<DashboardVendedoresDiarioItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardVendedoresDiarioItem[]>(
      `/dashboard/vendedores/diario/fecha${qs}`
    );
    return data;
  },

  // GET /dashboard/vendedores/diario/semana-actual
  async obtenerDiarioSemanaActual(
    params?: DashboardVendedoresDiarioSemanaActualQuery
  ): Promise<DashboardVendedoresDiarioItem[]> {
    const qs = buildQuery(params ?? {});
    const { data } = await httpClient.get<DashboardVendedoresDiarioItem[]>(
      `/dashboard/vendedores/diario/semana-actual${qs}`
    );
    return data;
  },

  // GET /dashboard/vendedores/diario/buscar
  async buscarDiario(
    params: DashboardVendedoresDiarioBuscarQuery
  ): Promise<DashboardVendedoresDiarioItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardVendedoresDiarioItem[]>(
      `/dashboard/vendedores/diario/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/vendedores/mensual
  async listarMensual(): Promise<DashboardVendedoresMensualItem[]> {
    const { data } = await httpClient.get<DashboardVendedoresMensualItem[]>(
      `/dashboard/vendedores/mensual`
    );
    return data;
  },

  // GET /dashboard/vendedores/mensual/anio
  async listarMensualPorAnio(
    params: DashboardVendedoresMensualAnioQuery
  ): Promise<DashboardVendedoresMensualItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardVendedoresMensualItem[]>(
      `/dashboard/vendedores/mensual/anio${qs}`
    );
    return data;
  },

  // GET /dashboard/vendedores/mensual/anio-mes
  async listarMensualPorAnioMes(
    params: DashboardVendedoresMensualAnioMesQuery
  ): Promise<DashboardVendedoresMensualItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardVendedoresMensualItem[]>(
      `/dashboard/vendedores/mensual/anio-mes${qs}`
    );
    return data;
  },

  // GET /dashboard/vendedores/mensual/buscar
  async buscarMensual(
    params: DashboardVendedoresMensualBuscarQuery
  ): Promise<DashboardVendedoresMensualItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<DashboardVendedoresMensualItem[]>(
      `/dashboard/vendedores/mensual/buscar${qs}`
    );
    return data;
  },
};