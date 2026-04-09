// src/modules/dashboard/services/productos/dashboard_productos_rotacion_alertas.service.ts
// Service del dashboard de productos para alertas de rotación.
// Responsabilidades:
// - listar productos con alta rotación y sin stock
// - listar top de productos con alta rotación y sin stock
// - buscar productos con alta rotación y sin stock
// - obtener un producto con alta rotación y sin stock
// - listar productos con sobrestock y baja rotación
// - listar top de productos con sobrestock y baja rotación
// - buscar productos con sobrestock y baja rotación
// - obtener un producto con sobrestock y baja rotación
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardProductosAltaRotacionSinStockItem,
  DashboardProductosRotacionAlertasBuscarQuery,
  DashboardProductosRotacionAlertasTopQuery,
  DashboardProductosSobrestockBajaRotacionItem,
} from "../../types/productos/dashboard_productos_rotacion_alertas.types";

// Convierte filtros de búsqueda a querystring
function buildBuscarQuery(params: DashboardProductosRotacionAlertasBuscarQuery): string {
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
function buildTopQuery(params?: DashboardProductosRotacionAlertasTopQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.limit !== undefined) {
    sp.set("limit", String(params.limit));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardProductosRotacionAlertasService = {
  // GET /dashboard/productos/alta-rotacion-sin-stock
  async listarAltaRotacionSinStock(): Promise<DashboardProductosAltaRotacionSinStockItem[]> {
    const { data } = await httpClient.get<DashboardProductosAltaRotacionSinStockItem[]>(
      `/dashboard/productos/alta-rotacion-sin-stock`
    );
    return data;
  },

  // GET /dashboard/productos/alta-rotacion-sin-stock/top
  async listarTopAltaRotacionSinStock(
    params?: DashboardProductosRotacionAlertasTopQuery
  ): Promise<DashboardProductosAltaRotacionSinStockItem[]> {
    const qs = buildTopQuery(params);
    const { data } = await httpClient.get<DashboardProductosAltaRotacionSinStockItem[]>(
      `/dashboard/productos/alta-rotacion-sin-stock/top${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/alta-rotacion-sin-stock/buscar
  async buscarAltaRotacionSinStock(
    params: DashboardProductosRotacionAlertasBuscarQuery
  ): Promise<DashboardProductosAltaRotacionSinStockItem[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<DashboardProductosAltaRotacionSinStockItem[]>(
      `/dashboard/productos/alta-rotacion-sin-stock/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/alta-rotacion-sin-stock/{id_producto}
  async obtenerAltaRotacionSinStock(
    id_producto: number
  ): Promise<DashboardProductosAltaRotacionSinStockItem> {
    const { data } = await httpClient.get<DashboardProductosAltaRotacionSinStockItem>(
      `/dashboard/productos/alta-rotacion-sin-stock/${id_producto}`
    );
    return data;
  },

  // GET /dashboard/productos/sobrestock-baja-rotacion
  async listarSobrestockBajaRotacion(): Promise<DashboardProductosSobrestockBajaRotacionItem[]> {
    const { data } = await httpClient.get<DashboardProductosSobrestockBajaRotacionItem[]>(
      `/dashboard/productos/sobrestock-baja-rotacion`
    );
    return data;
  },

  // GET /dashboard/productos/sobrestock-baja-rotacion/top
  async listarTopSobrestockBajaRotacion(
    params?: DashboardProductosRotacionAlertasTopQuery
  ): Promise<DashboardProductosSobrestockBajaRotacionItem[]> {
    const qs = buildTopQuery(params);
    const { data } = await httpClient.get<DashboardProductosSobrestockBajaRotacionItem[]>(
      `/dashboard/productos/sobrestock-baja-rotacion/top${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/sobrestock-baja-rotacion/buscar
  async buscarSobrestockBajaRotacion(
    params: DashboardProductosRotacionAlertasBuscarQuery
  ): Promise<DashboardProductosSobrestockBajaRotacionItem[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<DashboardProductosSobrestockBajaRotacionItem[]>(
      `/dashboard/productos/sobrestock-baja-rotacion/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/sobrestock-baja-rotacion/{id_producto}
  async obtenerSobrestockBajaRotacion(
    id_producto: number
  ): Promise<DashboardProductosSobrestockBajaRotacionItem> {
    const { data } = await httpClient.get<DashboardProductosSobrestockBajaRotacionItem>(
      `/dashboard/productos/sobrestock-baja-rotacion/${id_producto}`
    );
    return data;
  },
};