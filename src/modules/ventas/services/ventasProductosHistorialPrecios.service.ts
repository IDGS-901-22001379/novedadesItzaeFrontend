// src/modules/ventas/services/ventasProductosHistorialPrecios.service.ts
// Service de historial de precios para el módulo de ventas.
// Responsabilidades:
// - Leer el historial de precios de un producto.
// - Convertirlo a precios visibles para la UI de ventas.
// - Dejar listos los campos precio_venta, precio_mayoreo, precio_especial,
//   precio_descuento y precio_caja.

import { httpClient } from "../../../services/http/httpClient";
import { tiposClienteService } from "../../clientes/services/tiposCliente.service";
import type { VentaProductoOption, VentaPresentacion } from "../types";

type PrecioHistorialApiItem = {
  id_precio: number;
  id_producto: number;
  id_tipo_cliente: number;
  presentacion: VentaPresentacion;
  moneda?: string | null;
  precio: number;
  vigente_desde?: string | null;
  vigente_hasta?: string | null;
  activo?: boolean;
  creado_en?: string | null;
};

type TipoClienteCatalogItem = {
  id_tipo_cliente: number;
  nombre?: string | null;
  tipo_cliente?: string | null;
  tipo_cliente_label?: string | null;
  nombre_tipo_cliente?: string | null;
};

function toMoney(value?: number | null): number | null {
  const n = Number(value ?? 0);
  return Number.isFinite(n) && n > 0 ? Number(n.toFixed(2)) : null;
}

function normalizeText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function selectFirstAvailable(
  current: number | null,
  next: number | null,
): number | null {
  if (current != null) return current;
  return next;
}

async function buildTiposClienteMap(
  incomingMap?: Map<number, string>,
): Promise<Map<number, string>> {
  if (incomingMap && incomingMap.size > 0) {
    return incomingMap;
  }

  try {
    const catalogo = (await tiposClienteService.listar(true)) as TipoClienteCatalogItem[];
    const result = new Map<number, string>();

    for (const item of catalogo) {
      const label =
        item.tipo_cliente_label?.trim() ||
        item.nombre_tipo_cliente?.trim() ||
        item.tipo_cliente?.trim() ||
        item.nombre?.trim() ||
        "";

      if (item.id_tipo_cliente && label) {
        result.set(item.id_tipo_cliente, label);
      }
    }

    return result;
  } catch {
    return new Map<number, string>();
  }
}

export const ventasProductosHistorialPreciosService = {
  async listarHistorial(id_producto: number): Promise<PrecioHistorialApiItem[]> {
    const { data } = await httpClient.get<PrecioHistorialApiItem[]>(
      `/productos/${id_producto}/precios`,
    );

    return Array.isArray(data) ? data : [];
  },

  async resolverPreciosParaUi(params: {
    producto: VentaProductoOption;
    tiposClienteMap?: Map<number, string>;
  }): Promise<Partial<VentaProductoOption>> {
    const { producto, tiposClienteMap } = params;

    const [historial, tiposMap] = await Promise.all([
      this.listarHistorial(producto.id_producto),
      buildTiposClienteMap(tiposClienteMap),
    ]);

    const activos = historial.filter((item) => item.activo !== false);

    let precioVenta: number | null = toMoney(producto.precio_venta);
    let precioMayoreo: number | null = toMoney(producto.precio_mayoreo);
    let precioEspecial: number | null = toMoney(producto.precio_especial);
    let precioDescuento: number | null = toMoney(producto.precio_descuento);
    let precioCaja: number | null = toMoney(producto.precio_caja);

    for (const item of activos) {
      const precio = toMoney(item.precio);
      if (precio == null) continue;

      const tipoNombre = normalizeText(tiposMap.get(item.id_tipo_cliente));

      if (item.presentacion === "CAJA") {
        precioCaja = selectFirstAvailable(precioCaja, precio);
        continue;
      }

      const esPublicoGeneral =
        tipoNombre.includes("publico general") ||
        tipoNombre.includes("publico") ||
        item.id_tipo_cliente === 1;

      const esMayoreo =
        tipoNombre.includes("mayoreo") ||
        item.id_tipo_cliente === 2;

      const esEspecial = tipoNombre.includes("especial");
      const esDescuento = tipoNombre.includes("descuento");

      if (esPublicoGeneral) {
        precioVenta = selectFirstAvailable(precioVenta, precio);
        continue;
      }

      if (esMayoreo) {
        precioMayoreo = selectFirstAvailable(precioMayoreo, precio);
        continue;
      }

      if (esEspecial) {
        precioEspecial = selectFirstAvailable(precioEspecial, precio);
        continue;
      }

      if (esDescuento) {
        precioDescuento = selectFirstAvailable(precioDescuento, precio);
      }
    }

    return {
      precio_venta: precioVenta,
      precio_mayoreo: precioMayoreo,
      precio_especial: precioEspecial,
      precio_descuento: precioDescuento,
      precio_caja: precioCaja,
    };
  },
};