// src/modules/dashboard/services/productos/dashboard_productos_stock.service.ts
// Service del dashboard de productos para stock consolidado.
// Responsabilidades:
// - listar stock total de productos
// - buscar stock total de productos
// - obtener stock total de un producto específico
// - convertir filtros a querystring para consumo de la API

import { httpClient } from "../../../../services/http/httpClient";
import type {
  DashboardProductosStockBuscarQuery,
  DashboardProductosStockItem,
} from "../../types/productos/dashboard_productos_stock.types";

// Convierte filtros de búsqueda a querystring
function buildBuscarQuery(params: DashboardProductosStockBuscarQuery): string {
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

export const dashboardProductosStockService = {
  // GET /dashboard/productos/stock-total
  async listar(): Promise<DashboardProductosStockItem[]> {
    const { data } = await httpClient.get<DashboardProductosStockItem[]>(
      `/dashboard/productos/stock-total`
    );
    return data;
  },

  // GET /dashboard/productos/stock-total/buscar
  async buscar(
    params: DashboardProductosStockBuscarQuery
  ): Promise<DashboardProductosStockItem[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<DashboardProductosStockItem[]>(
      `/dashboard/productos/stock-total/buscar${qs}`
    );
    return data;
  },

  // GET /dashboard/productos/stock-total/{id_producto}
  async obtener(id_producto: number): Promise<DashboardProductosStockItem> {
    const { data } = await httpClient.get<DashboardProductosStockItem>(
      `/dashboard/productos/stock-total/${id_producto}`
    );
    return data;
  },
};