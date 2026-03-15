// src/modules/inventario_existencias/pages/inventario_existencias/list/inventarioExistenciasList.rows.ts

import { productosService } from "../../../../productos/services/productos.service";

import type {
  ExistenciaItem,
} from "../../../types/inventarioExistencias.types";

import type {
  ExistenciaRow,
} from "./inventarioExistenciasList.types";

import {
  normalizeProductosResponse,
} from "./inventarioExistenciasList.utils";

type ProductoDetalleLite = Awaited<ReturnType<typeof productosService.obtener>>;

type BuildRowsParams = {
  existenciasBase: ExistenciaItem[];
  productosRaw: unknown;
  filtersQ: string;
  estadoProductos: "ACTIVOS" | "INACTIVOS" | "TODOS";
  sucursalMap: Map<number, string>;
  ubicacionMap: Map<number, {
    id_ubicacion: number;
    id_sucursal: number;
    nombre: string;
    tipo: string;
    codigo: string;
    vendible: boolean;
    activo: boolean;
  }>;
};

export async function buildExistenciasRows({
  existenciasBase,
  productosRaw,
  filtersQ,
  estadoProductos,
  sucursalMap,
  ubicacionMap,
}: BuildRowsParams): Promise<ExistenciaRow[]> {
  const productosListado = normalizeProductosResponse(productosRaw);

  const idsProductosDeExistencias = Array.from(
    new Set(
      existenciasBase
        .map((item) => item.id_producto)
        .filter((id): id is number => Number.isFinite(Number(id))),
    ),
  );

  const idsProductosDeListado = Array.from(
    new Set(
      productosListado
        .map((p) => p.id_producto)
        .filter((id): id is number => Number.isFinite(Number(id))),
    ),
  );

  const idsProductos = Array.from(
    new Set([...idsProductosDeExistencias, ...idsProductosDeListado]),
  );

  const productosDetalles = await Promise.all(
    idsProductos.map(async (id_producto) => {
      try {
        return await productosService.obtener(id_producto);
      } catch {
        const lite = productosListado.find(
          (p) => p.id_producto === id_producto,
        );
        if (!lite) return null;

        return {
          id_producto: lite.id_producto,
          nombre: lite.nombre ?? `Producto #${lite.id_producto}`,
          sku: lite.sku ?? "",
          codigo_barras: lite.codigo_barras ?? null,
          modelo: lite.modelo ?? null,
          imagen_ruta: lite.imagen_ruta ?? null,
        } as ProductoDetalleLite;
      }
    }),
  );

  const productosMap = new Map<number, ProductoDetalleLite>();
  productosDetalles.forEach((prod) => {
    if (prod) productosMap.set(prod.id_producto, prod);
  });

  let rows: ExistenciaRow[] = existenciasBase.map((item) => {
    const producto = productosMap.get(item.id_producto);

    const ubicacionCatalogo = ubicacionMap.get(item.id_ubicacion);
    const idSucursal =
      ubicacionCatalogo?.id_sucursal ??
      item.ubicacion?.id_sucursal ??
      0;

    const sucursalNombre =
      sucursalMap.get(idSucursal) ??
      item.ubicacion?.sucursal_nombre ??
      item.sucursal_nombre ??
      "Sucursal no disponible";

    const ubicacionNombre =
      ubicacionCatalogo?.nombre ??
      item.ubicacion?.nombre ??
      item.ubicacion_nombre ??
      "Ubicación no disponible";

    const ubicacionTipo =
      ubicacionCatalogo?.tipo ??
      item.ubicacion?.tipo ??
      item.ubicacion_tipo ??
      "";

    const ubicacionCodigo =
      ubicacionCatalogo?.codigo ??
      item.ubicacion?.codigo ??
      item.ubicacion_codigo ??
      null;

    const ubicacionVendible =
      ubicacionCatalogo?.vendible ??
      item.ubicacion?.vendible ??
      item.ubicacion_vendible ??
      null;

    const ubicacionActivo =
      ubicacionCatalogo?.activo ??
      item.ubicacion?.activo ??
      item.ubicacion_activo ??
      null;

    return {
      ...item,
      id_existencia: item.id_existencia != null ? item.id_existencia : null,
      actualizado_en: item.actualizado_en ?? null,
      es_existencia_real: item.es_existencia_real ?? true,

      producto_nombre:
        item.producto?.nombre ??
        producto?.nombre ??
        item.producto_nombre ??
        `Producto #${item.id_producto}`,

      producto_sku:
        item.producto?.sku ??
        item.producto_sku ??
        producto?.sku ??
        null,

      producto_codigo_barras:
        item.producto?.codigo_barras ??
        item.producto_codigo_barras ??
        producto?.codigo_barras ??
        null,

      producto_modelo:
        item.producto_modelo ??
        producto?.modelo ??
        null,

      producto_imagen_ruta:
        item.producto_imagen_url ??
        producto?.imagen_ruta ??
        null,

      sucursal_nombre: sucursalNombre,
      ubicacion_nombre: ubicacionNombre,
      ubicacion_tipo: ubicacionTipo,
      ubicacion_codigo: ubicacionCodigo,
      ubicacion_vendible: ubicacionVendible,
      ubicacion_activo: ubicacionActivo,

      ubicacion: {
        id_ubicacion: item.id_ubicacion,
        id_sucursal: idSucursal,
        tipo: ubicacionTipo || item.ubicacion?.tipo || "",
        nombre: ubicacionNombre,
        codigo: ubicacionCodigo ?? "",
        vendible: ubicacionVendible ?? false,
        activo: ubicacionActivo ?? true,
        sucursal_nombre: sucursalNombre,
        ubicacion_nombre_completo: `${sucursalNombre} - ${ubicacionNombre}`,
      },

      producto: item.producto
        ? {
            ...item.producto,
            codigo_barras:
              item.producto.codigo_barras ?? producto?.codigo_barras ?? null,
            modelo: item.producto.modelo ?? producto?.modelo ?? null,
            estatus: item.producto.estatus ?? null,
          }
        : producto
          ? {
              id_producto: producto.id_producto,
              sku: producto.sku ?? "",
              nombre: producto.nombre ?? `Producto #${item.id_producto}`,
              imagen_url: producto.imagen_ruta ?? null,
              codigo_barras: producto.codigo_barras ?? null,
              modelo: producto.modelo ?? null,
              estatus: null,
            }
          : undefined,
    };
  });

  if (filtersQ.trim()) {
    const q = filtersQ.trim().toLowerCase();

    rows = rows.filter((row) => {
      const nombre = row.producto_nombre?.toLowerCase() ?? "";
      const sku = row.producto_sku?.toLowerCase() ?? "";
      const codigoBarras = row.producto_codigo_barras?.toLowerCase() ?? "";
      const modelo = row.producto_modelo?.toLowerCase() ?? "";

      return (
        nombre.includes(q) ||
        sku.includes(q) ||
        codigoBarras.includes(q) ||
        modelo.includes(q)
      );
    });
  }

  if (estadoProductos === "ACTIVOS") {
    rows = rows.filter((row) => row.producto?.estatus !== "INACTIVO");
  }

  rows.sort((a, b) => {
    const ubicacionA = a.ubicacion_nombre ?? a.ubicacion?.nombre ?? "";
    const ubicacionB = b.ubicacion_nombre ?? b.ubicacion?.nombre ?? "";
    const cmpUbicacion = ubicacionA.localeCompare(ubicacionB, "es");
    if (cmpUbicacion !== 0) return cmpUbicacion;

    const realesA = a.es_existencia_real ? 0 : 1;
    const realesB = b.es_existencia_real ? 0 : 1;
    if (realesA !== realesB) return realesA - realesB;

    const nombreA = a.producto_nombre ?? "";
    const nombreB = b.producto_nombre ?? "";
    return nombreA.localeCompare(nombreB, "es");
  });

  return rows;
}