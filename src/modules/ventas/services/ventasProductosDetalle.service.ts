// src/modules/ventas/services/ventasProductosDetalle.service.ts
// Service de detalle de producto para el módulo de ventas.
// Responsabilidades:
// - Obtener el detalle completo de un producto seleccionado.
// - Complementar la búsqueda rápida de /productos/buscar.
// - Traer modelo, unidades por caja y configuración de venta por caja.

import { httpClient } from "../../../services/http/httpClient";
import type { VentaProductoOption } from "../types";

type ProductoDetalleApi = {
  id_producto: number;
  sku?: string | null;
  codigo_barras?: string | null;
  nombre: string;
  modelo?: string | null;
  permite_venta_por_caja?: boolean | null;
  unidades_por_caja?: number | null;
  iva_tasa?: number | null;
};

function toNullableString(value?: string | null): string | null {
  const text = value?.trim();
  return text ? text : null;
}

function toNullableNumber(value?: number | null): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export const ventasProductosDetalleService = {
  async obtener(id_producto: number): Promise<Partial<VentaProductoOption>> {
    const { data } = await httpClient.get<ProductoDetalleApi>(
      `/productos/${id_producto}`,
    );

    const nombre = String(data?.nombre ?? "").trim() || "Producto sin nombre";
    const sku = toNullableString(data?.sku);
    const codigo_barras = toNullableString(data?.codigo_barras);
    const modelo = toNullableString(data?.modelo);

    const partesSecundarias = [
      sku ? `SKU: ${sku}` : "",
      codigo_barras ? `Código: ${codigo_barras}` : "",
      modelo ? `Modelo: ${modelo}` : "",
    ].filter(Boolean);

    return {
      id_producto: data.id_producto,
      nombre,
      producto_label: nombre,
      label:
        partesSecundarias.length > 0
          ? `${nombre} · ${partesSecundarias.join(" · ")}`
          : nombre,

      sku,
      codigo_barras,
      modelo,

      unidades_por_caja: toNullableNumber(data?.unidades_por_caja),
      permite_venta_por_caja: Boolean(data?.permite_venta_por_caja),

      // Estos se dejan sin tocar aquí porque vienen de otros servicios.
      precio_venta: null,
      precio_mayoreo: null,
      precio_especial: null,
      precio_descuento: null,
      precio_caja: null,
    };
  },
};