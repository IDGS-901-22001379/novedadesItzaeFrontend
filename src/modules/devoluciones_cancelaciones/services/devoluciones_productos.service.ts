// src/modules/devoluciones_cancelaciones/services/devoluciones_productos.service.ts
// Service auxiliar de productos para el módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Buscar productos por nombre, modelo, código de barras o sku.
// - Buscar productos por código de barras.
// - Exponer opciones amigables para UI sin mostrar el id al usuario.
// - Mantener separado el consumo de productos propio del módulo de devoluciones.

import { httpClient } from "../../../services/http/httpClient";
import type {
  DevolucionProductoOption,
  DevolucionesProductosBuscarQuery,
  DevolucionesProductosBarcodeQuery,
} from "../types/devoluciones_productos.types";

type ProductoLiteApi = {
  id_producto: number;
  sku?: string | null;
  codigo_barras?: string | null;
  nombre?: string | null;
  modelo?: string | null;
  descripcion?: string | null;
};

function normalizeText(value?: string | null): string {
  return (value ?? "").trim();
}

function buildBuscarQuery(params: DevolucionesProductosBuscarQuery): string {
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

function buildBarcodeQuery(params: DevolucionesProductosBarcodeQuery): string {
  const sp = new URLSearchParams();

  sp.set("codigo", params.codigo);

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function buildProductoLabel(item: ProductoLiteApi): string {
  const nombre = normalizeText(item.nombre);
  const modelo = normalizeText(item.modelo);
  const sku = normalizeText(item.sku);
  const codigoBarras = normalizeText(item.codigo_barras);

  const nombreModelo = [nombre, modelo].filter(Boolean).join(" - ");

  if (sku && codigoBarras) {
    return `${nombreModelo || "Producto"} · SKU: ${sku} · CB: ${codigoBarras}`;
  }

  if (sku) {
    return `${nombreModelo || "Producto"} · SKU: ${sku}`;
  }

  if (codigoBarras) {
    return `${nombreModelo || "Producto"} · CB: ${codigoBarras}`;
  }

  return nombreModelo || `Producto #${item.id_producto}`;
}

function toProductoOption(item: ProductoLiteApi): DevolucionProductoOption {
  return {
    id_producto: item.id_producto,
    nombre: normalizeText(item.nombre) || `Producto #${item.id_producto}`,
    modelo: normalizeText(item.modelo) || null,
    sku: normalizeText(item.sku) || null,
    codigo_barras: normalizeText(item.codigo_barras) || null,
    label: buildProductoLabel(item),
  };
}

export const devolucionesProductosService = {
  // GET /productos/buscar
  // Búsqueda por nombre, modelo, sku o código escrito.
  async buscar(
    params: DevolucionesProductosBuscarQuery,
  ): Promise<DevolucionProductoOption[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<ProductoLiteApi[]>(
      `/productos/buscar${qs}`,
    );

    return (Array.isArray(data) ? data : []).map(toProductoOption);
  },

  // GET /productos/barcode
  // Búsqueda directa por código de barras.
  async barcode(
    params: DevolucionesProductosBarcodeQuery,
  ): Promise<DevolucionProductoOption | null> {
    const qs = buildBarcodeQuery(params);
    const { data } = await httpClient.get<ProductoLiteApi | null>(
      `/productos/barcode${qs}`,
    );

    if (!data) return null;
    return toProductoOption(data);
  },

  // GET /productos/{id_producto}
  // Obtiene el producto y lo adapta a opción amigable.
  async obtenerOpcion(id_producto: number): Promise<DevolucionProductoOption> {
    const { data } = await httpClient.get<ProductoLiteApi>(
      `/productos/${id_producto}`,
    );

    return toProductoOption(data);
  },
};