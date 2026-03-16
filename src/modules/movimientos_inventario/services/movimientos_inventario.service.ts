// src/modules/movimientos_inventario/services/movimientos_inventario.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  MovimientoInventario,
  MovimientoInventarioDetalle,
  MovimientoInventarioAgregarDetalle,
  MovimientoInventarioCreate,
  MovimientoInventarioItem,
  MovimientosInventarioQuery,
  Paged,
} from "../types/movimientos_inventario.types";

// Convierte filtros a querystring
function buildQuery(params?: MovimientosInventarioQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.tipo) sp.set("tipo", params.tipo);
  if (params.id_producto !== undefined) sp.set("id_producto", String(params.id_producto));
  if (params.id_ubicacion !== undefined) sp.set("id_ubicacion", String(params.id_ubicacion));
  if (params.id_usuario !== undefined) sp.set("id_usuario", String(params.id_usuario));
  if (params.referencia_tipo) sp.set("referencia_tipo", params.referencia_tipo);
  if (params.referencia_id !== undefined) sp.set("referencia_id", String(params.referencia_id));
  if (params.q) sp.set("q", params.q);
  if (params.desde) sp.set("desde", params.desde);
  if (params.hasta) sp.set("hasta", params.hasta);
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));
  if (params.include_detalles !== undefined) {
    sp.set("include_detalles", String(params.include_detalles));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const movimientosInventarioService = {
  // GET /inventario/movimientos
  async listar(
    params?: MovimientosInventarioQuery,
  ): Promise<Paged<MovimientoInventarioItem>> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<Paged<MovimientoInventarioItem>>(
      `/inventario/movimientos${qs}`,
    );
    return data;
  },

  // GET /inventario/movimientos/{id_movimiento}
  async obtener(
    id_movimiento: number,
    include_detalles = true,
  ): Promise<MovimientoInventario> {
    const { data } = await httpClient.get<MovimientoInventario>(
      `/inventario/movimientos/${id_movimiento}?include_detalles=${include_detalles}`,
    );
    return data;
  },

  // POST /inventario/movimientos
  async crear(payload: MovimientoInventarioCreate): Promise<MovimientoInventario> {
    const { data } = await httpClient.post<MovimientoInventario>(
      `/inventario/movimientos`,
      payload,
    );
    return data;
  },

  // GET /inventario/movimientos/{id_movimiento}/detalles
  async listarDetalles(id_movimiento: number): Promise<MovimientoInventarioDetalle[]> {
    const { data } = await httpClient.get<MovimientoInventarioDetalle[]>(
      `/inventario/movimientos/${id_movimiento}/detalles`,
    );
    return data;
  },

  // POST /inventario/movimientos/{id_movimiento}/detalles
  async agregarDetalle(
    id_movimiento: number,
    payload: MovimientoInventarioAgregarDetalle,
  ): Promise<MovimientoInventarioDetalle> {
    const { data } = await httpClient.post<MovimientoInventarioDetalle>(
      `/inventario/movimientos/${id_movimiento}/detalles`,
      payload,
    );
    return data;
  },
};