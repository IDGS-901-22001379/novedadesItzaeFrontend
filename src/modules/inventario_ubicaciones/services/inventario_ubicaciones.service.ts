// src/modules/inventario_ubicaciones/services/inventario_ubicaciones.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  InventarioUbicacion,
  InventarioUbicacionCreate,
  InventarioUbicacionUpdate,
  InventarioUbicacionEstatusUpdate,
  InventarioUbicacionesQuery,
} from "../types/inventario_ubicaciones.types";

const BASE_URL = "/inventario/ubicaciones";

// Convierte filtros a querystring (listado)
function buildQuery(params?: InventarioUbicacionesQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.id_sucursal !== undefined && params.id_sucursal !== null) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const inventarioUbicacionesService = {
  // GET /inventario/ubicaciones
  async listar(params?: InventarioUbicacionesQuery): Promise<InventarioUbicacion[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<InventarioUbicacion[]>(`${BASE_URL}${qs}`);
    return data;
  },

  // GET /inventario/ubicaciones/{id_ubicacion}
  async obtener(id_ubicacion: number): Promise<InventarioUbicacion> {
    const { data } = await httpClient.get<InventarioUbicacion>(`${BASE_URL}/${id_ubicacion}`);
    return data;
  },

  // POST /inventario/ubicaciones
  async crear(payload: InventarioUbicacionCreate): Promise<InventarioUbicacion> {
    const { data } = await httpClient.post<InventarioUbicacion>(BASE_URL, payload);
    return data;
  },

  // PUT /inventario/ubicaciones/{id_ubicacion}
  async actualizar(
    id_ubicacion: number,
    payload: InventarioUbicacionUpdate
  ): Promise<InventarioUbicacion> {
    const { data } = await httpClient.put<InventarioUbicacion>(
      `${BASE_URL}/${id_ubicacion}`,
      payload
    );
    return data;
  },

  // PATCH /inventario/ubicaciones/{id_ubicacion}/estatus
  async cambiarEstatus(
    id_ubicacion: number,
    payload: InventarioUbicacionEstatusUpdate
  ): Promise<InventarioUbicacion> {
    const { data } = await httpClient.patch<InventarioUbicacion>(
      `${BASE_URL}/${id_ubicacion}/estatus`,
      payload
    );
    return data;
  },
};