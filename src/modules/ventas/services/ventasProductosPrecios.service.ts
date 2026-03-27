// src/modules/ventas/services/ventasProductosPrecios.service.ts
// Service de precios de productos para el módulo de Ventas.
// Responsabilidades:
// - Consultar precio vigente por producto.
// - Resolver precio según tipo de cliente y presentación.
// - Dejar un fallback seguro para ventas rápidas.
//
// Regla importante:
// - El precio depende de:
//   1) id_producto
//   2) id_tipo_cliente
//   3) presentacion ("UNIDAD" | "CAJA")

import { httpClient } from "../../../services/http/httpClient";
import type { VentaPresentacion, VentaProductoOption } from "../types";

export type VentaPrecioProductoVigente = {
  id_precio: number;
  id_producto: number;
  id_tipo_cliente: number;
  presentacion: VentaPresentacion;
  precio: number;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  activo?: boolean;
};

export type VentaPrecioVigenteQuery = {
  id_tipo_cliente: number;
  presentacion: VentaPresentacion;
};

function buildPrecioVigenteQuery(params: VentaPrecioVigenteQuery): string {
  const sp = new URLSearchParams();

  sp.set("id_tipo_cliente", String(params.id_tipo_cliente));
  sp.set("presentacion", String(params.presentacion));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function toMoney(value?: number | null): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) && n > 0 ? Number(n.toFixed(2)) : 0;
}

function resolveFallbackPrecioDesdeProducto(
  producto: VentaProductoOption,
  presentacion: VentaPresentacion,
): number {
  if (presentacion === "CAJA") {
    const precioCaja = toMoney(producto.precio_caja);
    if (precioCaja > 0) return precioCaja;

    const unidadesPorCaja = Number(producto.unidades_por_caja ?? 0);
    const precioVenta = toMoney(producto.precio_venta);

    if (unidadesPorCaja > 0 && precioVenta > 0) {
      return Number((unidadesPorCaja * precioVenta).toFixed(2));
    }
  }

  return toMoney(producto.precio_venta);
}

export const ventasProductosPreciosService = {
  // GET /productos/{id_producto}/precios/vigente?id_tipo_cliente=...&presentacion=...
  // Obtiene el precio vigente exacto desde backend.
  async obtenerVigente(
    id_producto: number,
    params: VentaPrecioVigenteQuery,
  ): Promise<VentaPrecioProductoVigente | null> {
    const qs = buildPrecioVigenteQuery(params);

    const { data } = await httpClient.get<VentaPrecioProductoVigente | null>(
      `/productos/${id_producto}/precios/vigente${qs}`,
    );

    return data;
  },

  // Resuelve el precio para la venta.
  // 1) Intenta obtener el precio vigente real desde backend.
  // 2) Si no existe, usa fallback desde los datos del producto buscado.
  async resolverPrecioVenta(params: {
    producto: VentaProductoOption;
    id_tipo_cliente?: number | null;
    presentacion: VentaPresentacion;
  }): Promise<number> {
    const { producto, id_tipo_cliente, presentacion } = params;

    if (id_tipo_cliente && id_tipo_cliente > 0) {
      try {
        const vigente = await this.obtenerVigente(producto.id_producto, {
          id_tipo_cliente,
          presentacion,
        });

        const precioVigente = toMoney(vigente?.precio);
        if (precioVigente > 0) return precioVigente;
      } catch {
        // Si falla el endpoint, se cae al fallback local.
      }
    }

    return resolveFallbackPrecioDesdeProducto(producto, presentacion);
  },
};