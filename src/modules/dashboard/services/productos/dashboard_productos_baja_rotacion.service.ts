// src/modules/dashboard/services/productos/dashboard_productos_baja_rotacion.service.ts
// Service del dashboard de productos para baja rotación.
// Responsabilidades:
// - listar productos con baja rotación
// - listar top de productos con baja rotación
// - buscar productos con baja rotación
// - obtener un producto con baja rotación
// - listar productos sin venta reciente
// - listar top de productos sin venta reciente
// - buscar productos sin venta reciente
// - obtener un producto sin venta reciente
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardProductosBajaRotacionBuscarQuery,
  DashboardProductosBajaRotacionItem,
  DashboardProductosBajaRotacionTopQuery,
  DashboardProductosSinVentaRecienteItem,
} from "../../types/productos/dashboard_productos_baja_rotacion.types";

// Convierte filtros de búsqueda a querystring
function buildBuscarQuery(params: DashboardProductosBajaRotacionBuscarQuery): string {
  const sp = new URLSearchParams();

  sp.set("q", params.q);

  if (params.limit !== undefined) {
    sp.set("limit", String(params.limit));
  }

  if (params.offset !== undefined) {
    sp.set("offset", String(params.offset));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros top a querystring
function buildTopQuery(params?: DashboardProductosBajaRotacionTopQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.limit !== undefined) {
    sp.set("limit", String(params.limit));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardProductosBajaRotacionService = {
  // GET /dashboard/productos/baja-rotacion
  async listarBajaRotacion(): Promise<DashboardProductosBajaRotacionItem[]> {
    const { data } = await httpClient.get<DashboardProductosBajaRotacionItem[]>(
      `/dashboard/productos/baja-rotacion`
    );
    return data;
  },

  // GET /dashboard/productos/baja-rotacion/top
  async listarTopBajaRotacion(
    params?: DashboardProductosBajaRotacionTopQuery
  ): Promise<DashboardProductosBajaRotacionItem[]> {
    const qs = buildTopQuery(params);
    const { data } = await httpClient.get<DashboardProductosBajaRotacionItem[]>(
      `/dashboard/productos/baja-rotacion/top${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/baja-rotacion/buscar
  async buscarBajaRotacion(
    params: DashboardProductosBajaRotacionBuscarQuery
  ): Promise<DashboardProductosBajaRotacionItem[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<DashboardProductosBajaRotacionItem[]>(
      `/dashboard/productos/baja-rotacion/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/baja-rotacion/{id_producto}
  async obtenerBajaRotacion(
    id_producto: number
  ): Promise<DashboardProductosBajaRotacionItem> {
    const { data } = await httpClient.get<DashboardProductosBajaRotacionItem>(
      `/dashboard/productos/baja-rotacion/${id_producto}`
    );
    return data;
  },

  // GET /dashboard/productos/sin-venta-reciente
  async listarSinVentaReciente(): Promise<DashboardProductosSinVentaRecienteItem[]> {
    const { data } = await httpClient.get<DashboardProductosSinVentaRecienteItem[]>(
      `/dashboard/productos/sin-venta-reciente`
    );
    return data;
  },

  // GET /dashboard/productos/sin-venta-reciente/top
  async listarTopSinVentaReciente(
    params?: DashboardProductosBajaRotacionTopQuery
  ): Promise<DashboardProductosSinVentaRecienteItem[]> {
    const qs = buildTopQuery(params);
    const { data } = await httpClient.get<DashboardProductosSinVentaRecienteItem[]>(
      `/dashboard/productos/sin-venta-reciente/top${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/sin-venta-reciente/buscar
  async buscarSinVentaReciente(
    params: DashboardProductosBajaRotacionBuscarQuery
  ): Promise<DashboardProductosSinVentaRecienteItem[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<DashboardProductosSinVentaRecienteItem[]>(
      `/dashboard/productos/sin-venta-reciente/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/sin-venta-reciente/{id_producto}
  async obtenerSinVentaReciente(
    id_producto: number
  ): Promise<DashboardProductosSinVentaRecienteItem> {
    const { data } = await httpClient.get<DashboardProductosSinVentaRecienteItem>(
      `/dashboard/productos/sin-venta-reciente/${id_producto}`
    );
    return data;
  },
};