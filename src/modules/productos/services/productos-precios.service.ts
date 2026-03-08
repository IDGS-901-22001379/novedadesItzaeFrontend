// src/modules/productos/services/productos-precios.service.ts
// Service exclusivo para Precios de Productos.
// Responsabilidades:
// - Historial de precios por producto
// - Obtener precio vigente por tipo de cliente y presentación
// - Crear nuevo precio
// - Actualizar precio completo
// - Desactivar precio
//
// Regla importante del módulo:
// - El precio depende de:
//   1) id_producto
//   2) id_tipo_cliente
//   3) presentacion ("UNIDAD" | "CAJA")

import { httpClient } from "../../../services/http/httpClient";
import type {
  PrecioProducto,
  PrecioProductoCreate,
  PrecioProductoUpdate,
  PrecioVigenteQuery,
} from "../types/productos.types";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function buildPrecioVigenteQuery(params: PrecioVigenteQuery): string {
  const sp = new URLSearchParams();

  sp.set("id_tipo_cliente", String(params.id_tipo_cliente));
  sp.set("presentacion", String(params.presentacion));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

export const productosPreciosService = {
  // GET /productos/{id_producto}/precios
  // Historial de precios de un producto.
  async listarHistorial(id_producto: number): Promise<PrecioProducto[]> {
    const { data } = await httpClient.get<PrecioProducto[]>(
      `/productos/${id_producto}/precios`,
    );
    return data;
  },

  // GET /productos/{id_producto}/precios/vigente?id_tipo_cliente=...&presentacion=...
  // Obtiene el precio que aplica para venta.
  async obtenerVigente(
    id_producto: number,
    params: PrecioVigenteQuery,
  ): Promise<PrecioProducto | null> {
    const qs = buildPrecioVigenteQuery(params);
    const { data } = await httpClient.get<PrecioProducto | null>(
      `/productos/${id_producto}/precios/vigente${qs}`,
    );
    return data;
  },

  // POST /productos/precios
  // Crea un nuevo precio para un producto.
  async crear(payload: PrecioProductoCreate): Promise<PrecioProducto> {
    const { data } = await httpClient.post<PrecioProducto>(
      `/productos/precios`,
      payload,
    );
    return data;
  },

  // PUT /productos/precios/{id_precio}
  // Actualiza un precio completo (todo menos id_precio).
  async actualizar(
    id_precio: number,
    payload: PrecioProductoUpdate,
  ): Promise<PrecioProducto> {
    const { data } = await httpClient.put<PrecioProducto>(
      `/productos/precios/${id_precio}`,
      payload,
    );
    return data;
  },

  // PATCH /productos/precios/{id_precio}/desactivar
  // Baja lógica del precio.
  async desactivar(id_precio: number): Promise<PrecioProducto> {
    const { data } = await httpClient.patch<PrecioProducto>(
      `/productos/precios/${id_precio}/desactivar`,
    );
    return data;
  },
};