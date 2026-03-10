// src/modules/inventario_sucursales/services/inventario_sucursales.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  InventarioSucursal,
  InventarioSucursalCreate,
  InventarioSucursalEstatusUpdate,
  InventarioSucursalListItem,
  InventarioSucursalUpdate,
  InventarioSucursalesQuery,
} from "../types";

// Convierte filtros a querystring (listado)
function buildQuery(params?: InventarioSucursalesQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const inventarioSucursalesService = {
  // GET /inventario/sucursales
  async listar(params?: InventarioSucursalesQuery): Promise<InventarioSucursalListItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<InventarioSucursalListItem[]>(
      `/inventario/sucursales${qs}`,
    );
    return data;
  },

  // GET /inventario/sucursales/{id_sucursal}
  async obtener(id_sucursal: number): Promise<InventarioSucursal> {
    const { data } = await httpClient.get<InventarioSucursal>(
      `/inventario/sucursales/${id_sucursal}`,
    );
    return data;
  },

  // POST /inventario/sucursales
  async crear(payload: InventarioSucursalCreate): Promise<InventarioSucursal> {
    const { data } = await httpClient.post<InventarioSucursal>(
      `/inventario/sucursales`,
      payload,
    );
    return data;
  },

  // PUT /inventario/sucursales/{id_sucursal}
  async actualizar(
    id_sucursal: number,
    payload: InventarioSucursalUpdate,
  ): Promise<InventarioSucursal> {
    const { data } = await httpClient.put<InventarioSucursal>(
      `/inventario/sucursales/${id_sucursal}`,
      payload,
    );
    return data;
  },

  // PATCH /inventario/sucursales/{id_sucursal}/estatus
  async cambiarEstatus(
    id_sucursal: number,
    payload: InventarioSucursalEstatusUpdate,
  ): Promise<InventarioSucursal> {
    const { data } = await httpClient.patch<InventarioSucursal>(
      `/inventario/sucursales/${id_sucursal}/estatus`,
      payload,
    );
    return data;
  },
};