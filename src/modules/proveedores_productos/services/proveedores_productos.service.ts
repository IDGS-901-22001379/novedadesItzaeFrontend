// src/modules/proveedores_productos/services/proveedores_productos.service.ts
// Service del módulo Proveedor-Productos.
// Responsabilidades:
// - Listar relaciones proveedor-producto
// - Crear relación
// - Actualizar relación
// - Desactivar relación
//
// Nota:
// El backend lista relaciones por proveedor:
// GET /proveedores/{id_proveedor}/productos
// Por eso, para una pantalla global, la UI puede cargar proveedores y luego
// consultar sus relaciones para armar una sola tabla unificada.

import { httpClient } from "../../../services/http/httpClient";
import type {
  ProveedorProducto,
  ProveedorProductoCreate,
  ProveedorProductoUpdate,
  ProveedorProductosListQuery,
} from "../types/proveedores_productos.types";

/* -------------------------------------------------------------------------- */
/* Helpers: querystring                                                       */
/* -------------------------------------------------------------------------- */

// GET /proveedores/{id_proveedor}/productos
function buildListQuery(params?: ProveedorProductosListQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

export const proveedoresProductosService = {
  // GET /proveedores/{id_proveedor}/productos
  async listarPorProveedor(
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
  async crearRelacion(
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
  async actualizarRelacion(
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
  async desactivarRelacion(
    id_proveedor: number,
    id_producto: number,
  ): Promise<ProveedorProducto> {
    const { data } = await httpClient.patch<ProveedorProducto>(
      `/proveedores/${id_proveedor}/productos/${id_producto}/desactivar`,
    );
    return data;
  },
};