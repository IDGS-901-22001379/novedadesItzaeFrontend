// src/modules/caja/services/caja.service.ts
// Servicios del módulo de cajas.
// Se encarga de consumir los endpoints de listado, creación, edición,
// consulta individual, consulta por sucursal y cambio de activo.

import { httpClient } from "../../../services/http/httpClient";
import type {
  Caja,
  CajaCreate,
  CajaUpdate,
  CajaActivoUpdate,
  CajasQuery,
  CajasPorSucursalQuery,
} from "../types/caja.types";

// Convierte los filtros del listado general en querystring.
function buildQuery(params?: CajasQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte los filtros del listado por sucursal en querystring.
function buildPorSucursalQuery(params?: CajasPorSucursalQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const cajaService = {
  // Lista las cajas según el filtro indicado.
  async listar(params?: CajasQuery): Promise<Caja[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<Caja[]>(`/caja/cajas${qs}`);
    return data;
  },

  // Obtiene una caja por su id.
  async obtener(id_caja: number): Promise<Caja> {
    const { data } = await httpClient.get<Caja>(`/caja/cajas/${id_caja}`);
    return data;
  },

  // Crea una nueva caja.
  async crear(payload: CajaCreate): Promise<Caja> {
    const { data } = await httpClient.post<Caja>(`/caja/cajas`, payload);
    return data;
  },

  // Actualiza una caja existente.
  async actualizar(id_caja: number, payload: CajaUpdate): Promise<Caja> {
    const { data } = await httpClient.put<Caja>(`/caja/cajas/${id_caja}`, payload);
    return data;
  },

  // Lista las cajas de una sucursal específica.
  async listarPorSucursal(
    id_sucursal: number,
    params?: CajasPorSucursalQuery
  ): Promise<Caja[]> {
    const qs = buildPorSucursalQuery(params);
    const { data } = await httpClient.get<Caja[]>(
      `/caja/cajas/por-sucursal/${id_sucursal}${qs}`
    );
    return data;
  },

  // Cambia el estado activo de una caja.
  async cambiarActivo(id_caja: number, payload: CajaActivoUpdate): Promise<Caja> {
    const { data } = await httpClient.patch<Caja>(
      `/caja/cajas/${id_caja}/activo`,
      payload
    );
    return data;
  },
};