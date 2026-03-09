// src/modules/proveedores_productos/services/proveedores.service.ts
// Service auxiliar de Proveedores para el módulo Proveedor-Productos.
// Responsabilidades:
// - Listado admin de proveedores
// - Búsqueda de proveedores para selects/autocomplete
// - Obtener detalle por id si se requiere

import { httpClient } from "../../../services/http/httpClient";
import type {
  Proveedor,
  ProveedorListItem,
  ProveedoresBuscarQuery,
  ProveedoresListQuery,
} from "../types/proveedores_productos.types";

/* -------------------------------------------------------------------------- */
/* Helpers: querystring                                                       */
/* -------------------------------------------------------------------------- */

// GET /proveedores
function buildListQuery(params?: ProveedoresListQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// GET /proveedores/buscar
function buildBuscarQuery(params: ProveedoresBuscarQuery): string {
  const sp = new URLSearchParams();

  sp.set("q", params.q);

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }
  if (params.limit !== undefined) {
    sp.set("limit", String(params.limit));
  }
  if (params.offset !== undefined) {
    sp.set("offset", String(params.offset));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

export const proveedoresPPService = {
  // GET /proveedores
  async listar(params?: ProveedoresListQuery): Promise<ProveedorListItem[]> {
    const qs = buildListQuery(params);
    const { data } = await httpClient.get<ProveedorListItem[]>(`/proveedores${qs}`);
    return data;
  },

  // GET /proveedores/buscar
  async buscar(params: ProveedoresBuscarQuery): Promise<ProveedorListItem[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<ProveedorListItem[]>(`/proveedores/buscar${qs}`);
    return data;
  },

  // GET /proveedores/{id_proveedor}
  async obtener(id_proveedor: number): Promise<Proveedor> {
    const { data } = await httpClient.get<Proveedor>(`/proveedores/${id_proveedor}`);
    return data;
  },
};