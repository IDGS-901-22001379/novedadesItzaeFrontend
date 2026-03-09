// src/modules/proveedores/services/proveedor-productos.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  ProveedorProducto,
  ProveedorProductoCreate,
  ProveedorProductoUpdate,
  ProveedorProductosListQuery,
} from "../types/proveedores.types";

function buildListQuery(params?: ProveedorProductosListQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const proveedorProductosService = {
  // GET /proveedores/{id_proveedor}/productos
  async listar(
    id_proveedor: number,
    params?: ProveedorProductosListQuery,
  ): Promise<ProveedorProducto[]> {
    const qs = buildListQuery(params);
    const { data } = await httpClient.get<ProveedorProducto[]>(
      `/proveedores/${id_proveedor}/productos${qs}`,
    );
    return data;
  },

  // POST /proveedores/{id_proveedor}/productos
  async asociar(
    id_proveedor: number,
    payload: ProveedorProductoCreate,
  ): Promise<ProveedorProducto> {
    const { data } = await httpClient.post<ProveedorProducto>(
      `/proveedores/${id_proveedor}/productos`,
      payload,
    );
    return data;
  },

  // PUT /proveedores/{id_proveedor}/productos/{id_producto}
  async actualizar(
    id_proveedor: number,
    id_producto: number,
    payload: ProveedorProductoUpdate,
  ): Promise<ProveedorProducto> {
    const { data } = await httpClient.put<ProveedorProducto>(
      `/proveedores/${id_proveedor}/productos/${id_producto}`,
      payload,
    );
    return data;
  },

  // PATCH /proveedores/{id_proveedor}/productos/{id_producto}/desactivar
  async desactivar(
    id_proveedor: number,
    id_producto: number,
  ): Promise<ProveedorProducto> {
    const { data } = await httpClient.patch<ProveedorProducto>(
      `/proveedores/${id_proveedor}/productos/${id_producto}/desactivar`,
    );
    return data;
  },
};