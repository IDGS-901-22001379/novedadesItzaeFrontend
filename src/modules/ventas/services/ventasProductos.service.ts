// src/modules/ventas/services/ventasProductos.service.ts
// Service de productos para el módulo de ventas.
// Responsabilidades:
// - Buscar productos activos para agregarlos a la venta.
// - Preparar la información visual del autocomplete.
// - Regresar precios disponibles según tipo de cliente y presentación.
// - Dejar lista la data base para la lógica de unidad/caja.
// - Conservar datos de facturación como bandera de facturable e IVA.

import { httpClient } from "../../../services/http/httpClient";
import type { VentaProductoOption } from "../types";

function buildProductosBuscarQuery(params: {
  q: string;
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
}): string {
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

type ProductoBuscarApiItem = {
  id_producto: number;
  nombre: string;
  sku?: string | null;
  codigo_barras?: string | null;
  modelo?: string | null;

  precio_venta?: number | null;
  precio_mayoreo?: number | null;
  precio_especial?: number | null;
  precio_descuento?: number | null;
  precio_caja?: number | null;

  unidades_por_caja?: number | null;
  permite_venta_por_caja?: boolean | null;

  facturable?: boolean | null;
  es_facturable?: boolean | null;
  iva?: number | null;
  iva_tasa?: number | null;

  clave_prod_serv_sat?: string | null;
  clave_unidad_sat?: string | null;
  unidad_cfdi?: string | null;
};

function toNullableString(value?: string | null): string | null {
  const text = value?.trim();
  return text ? text : null;
}

function toNullableNumber(value?: number | null): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export const ventasProductosService = {
  async buscar(params: {
    q: string;
    limit?: number;
    offset?: number;
  }): Promise<VentaProductoOption[]> {
    const qs = buildProductosBuscarQuery({
      q: params.q,
      solo_activos: true,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
    });

    const { data } = await httpClient.get<ProductoBuscarApiItem[]>(
      `/productos/buscar${qs}`,
    );

    return (Array.isArray(data) ? data : []).map((item): VentaProductoOption => {
      const nombre = item.nombre.trim();

      const partesSecundarias = [
        item.sku?.trim() ? `SKU: ${item.sku.trim()}` : "",
        item.codigo_barras?.trim() ? `Código: ${item.codigo_barras.trim()}` : "",
        item.modelo?.trim() ? `Modelo: ${item.modelo.trim()}` : "",
      ].filter(Boolean);

      return {
        id_producto: item.id_producto,
        nombre,
        producto_label: nombre,
        label:
          partesSecundarias.length > 0
            ? `${nombre} · ${partesSecundarias.join(" · ")}`
            : nombre,

        sku: toNullableString(item.sku),
        codigo_barras: toNullableString(item.codigo_barras),
        modelo: toNullableString(item.modelo),

        precio_venta: toNullableNumber(item.precio_venta),
        precio_mayoreo: toNullableNumber(item.precio_mayoreo),
        precio_especial: toNullableNumber(item.precio_especial),
        precio_descuento: toNullableNumber(item.precio_descuento),
        precio_caja: toNullableNumber(item.precio_caja),

        unidades_por_caja: toNullableNumber(item.unidades_por_caja),
        permite_venta_por_caja: item.permite_venta_por_caja ?? false,

        facturable: item.facturable ?? item.es_facturable ?? false,
        es_facturable: item.es_facturable ?? item.facturable ?? false,
        iva: toNullableNumber(item.iva),
        iva_tasa: toNullableNumber(item.iva_tasa),

        clave_prod_serv_sat: toNullableString(item.clave_prod_serv_sat),
        clave_unidad_sat: toNullableString(item.clave_unidad_sat),
        unidad_cfdi: toNullableString(item.unidad_cfdi),
      };
    });
  },
};