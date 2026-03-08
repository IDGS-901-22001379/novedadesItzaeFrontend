// src/modules/productos/services/proveedores.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  Proveedor,
  ProveedorLite,
  ProveedoresListQuery,
  ProveedoresBuscarQuery,
  ProveedorProductoRelacion,
} from "../types/proveedores.types";

function buildListQuery(params?: ProveedoresListQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

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

function buildSoloActivosQuery(solo_activos?: boolean): string {
  if (solo_activos === undefined) return "";
  return `?solo_activos=${String(solo_activos)}`;
}

export const proveedoresService = {
  async listar(params?: ProveedoresListQuery): Promise<ProveedorLite[]> {
    const qs = buildListQuery(params);
    const { data } = await httpClient.get<ProveedorLite[]>(`/proveedores${qs}`);
    return data;
  },

  async buscar(params: ProveedoresBuscarQuery): Promise<ProveedorLite[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<ProveedorLite[]>(`/proveedores/buscar${qs}`);
    return data;
  },

  async obtener(id_proveedor: number): Promise<Proveedor> {
    const { data } = await httpClient.get<Proveedor>(`/proveedores/${id_proveedor}`);
    return data;
  },

  async listarProductos(
    id_proveedor: number,
    solo_activos = true,
  ): Promise<ProveedorProductoRelacion[]> {
    const qs = buildSoloActivosQuery(solo_activos);
    const { data } = await httpClient.get<ProveedorProductoRelacion[]>(
      `/proveedores/${id_proveedor}/productos${qs}`,
    );
    return data;
  },
};