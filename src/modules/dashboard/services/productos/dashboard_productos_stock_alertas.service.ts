// src/modules/dashboard/services/productos/dashboard_productos_stock_alertas.service.ts
// Service del dashboard de productos para alertas de stock.
// Responsabilidades:
// - listar productos con stock bajo
// - filtrar productos con stock bajo por estado
// - buscar productos con stock bajo
// - obtener un producto con stock bajo
// - listar productos agotados
// - buscar productos agotados
// - obtener un producto agotado
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardProductosAgotadosItem,
  DashboardProductosStockAlertasBuscarQuery,
  DashboardProductosStockBajoEstadoQuery,
  DashboardProductosStockBajoItem,
} from "../../types/productos/dashboard_productos_stock_alertas.types";

// Convierte filtros de búsqueda a querystring
function buildBuscarQuery(params: DashboardProductosStockAlertasBuscarQuery): string {
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

// Convierte filtro por estado a querystring
function buildEstadoQuery(params: DashboardProductosStockBajoEstadoQuery): string {
  const sp = new URLSearchParams();

  sp.set("estado_stock", params.estado_stock);

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const dashboardProductosStockAlertasService = {
  // GET /dashboard/productos/stock-bajo
  async listarStockBajo(): Promise<DashboardProductosStockBajoItem[]> {
    const { data } = await httpClient.get<DashboardProductosStockBajoItem[]>(
      `/dashboard/productos/stock-bajo`
    );
    return data;
  },

  // GET /dashboard/productos/stock-bajo/estado
  async listarStockBajoPorEstado(
    params: DashboardProductosStockBajoEstadoQuery
  ): Promise<DashboardProductosStockBajoItem[]> {
    const qs = buildEstadoQuery(params);
    const { data } = await httpClient.get<DashboardProductosStockBajoItem[]>(
      `/dashboard/productos/stock-bajo/estado${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/stock-bajo/buscar
  async buscarStockBajo(
    params: DashboardProductosStockAlertasBuscarQuery
  ): Promise<DashboardProductosStockBajoItem[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<DashboardProductosStockBajoItem[]>(
      `/dashboard/productos/stock-bajo/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/stock-bajo/{id_producto}
  async obtenerStockBajo(id_producto: number): Promise<DashboardProductosStockBajoItem> {
    const { data } = await httpClient.get<DashboardProductosStockBajoItem>(
      `/dashboard/productos/stock-bajo/${id_producto}`
    );
    return data;
  },

  // GET /dashboard/productos/agotados
  async listarAgotados(): Promise<DashboardProductosAgotadosItem[]> {
    const { data } = await httpClient.get<DashboardProductosAgotadosItem[]>(
      `/dashboard/productos/agotados`
    );
    return data;
  },

  // GET /dashboard/productos/agotados/buscar
  async buscarAgotados(
    params: DashboardProductosStockAlertasBuscarQuery
  ): Promise<DashboardProductosAgotadosItem[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<DashboardProductosAgotadosItem[]>(
      `/dashboard/productos/agotados/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/agotados/{id_producto}
  async obtenerAgotado(id_producto: number): Promise<DashboardProductosAgotadosItem> {
    const { data } = await httpClient.get<DashboardProductosAgotadosItem>(
      `/dashboard/productos/agotados/${id_producto}`
    );
    return data;
  },
};