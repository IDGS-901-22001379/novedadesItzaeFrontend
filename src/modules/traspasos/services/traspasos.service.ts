// src/modules/traspasos/services/traspasos.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  PagedTraspasos,
  TraspasoCreate,
  TraspasoDetalle,
  TraspasosQuery,
} from "../types/traspasos.types";

// Convierte filtros a querystring para listado paginado
function buildQuery(params?: TraspasosQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.desde) sp.set("desde", params.desde);
  if (params.hasta) sp.set("hasta", params.hasta);
  if (params.id_sucursal !== undefined) sp.set("id_sucursal", String(params.id_sucursal));
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const traspasosService = {
  // GET /traspasos
  async listar(params?: TraspasosQuery): Promise<PagedTraspasos> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<PagedTraspasos>(`/traspasos${qs}`);
    return data;
  },

  // GET /traspasos/{id_movimiento}
  async obtener(id_movimiento: number): Promise<TraspasoDetalle> {
    const { data } = await httpClient.get<TraspasoDetalle>(`/traspasos/${id_movimiento}`);
    return data;
  },

  // POST /traspasos
  async crear(payload: TraspasoCreate): Promise<TraspasoDetalle> {
    const { data } = await httpClient.post<TraspasoDetalle>(`/traspasos`, payload);
    return data;
  },
};