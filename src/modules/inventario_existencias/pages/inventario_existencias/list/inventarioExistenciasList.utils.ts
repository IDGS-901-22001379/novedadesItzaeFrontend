import type {
  ExistenciaDetalle,
  ExistenciaProductoLite,
  ExistenciaUbicacionLite,
} from "../../../types/inventarioExistencias.types";
import type {
  SucursalOption,
} from "../../../components/inventario_existencias/InventarioExistenciasFilters";
import type { InventarioExistenciasUbicacion } from "../../../services/inventarioExistenciasUbicaciones.service";
import type {
  ExistenciaRow,
  ProductoListItem,
  SucursalApiItem,
} from "./inventarioExistenciasList.types";

export const PAGE_SIZE = 10;

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de existencias.";
}

export function normalizeSucursalesResponse(data: unknown): SucursalApiItem[] {
  if (Array.isArray(data)) {
    return data as SucursalApiItem[];
  }

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { items?: SucursalApiItem[] }).items)
  ) {
    return (data as { items: SucursalApiItem[] }).items;
  }

  return [];
}

export function normalizeProductosResponse(data: unknown): ProductoListItem[] {
  if (Array.isArray(data)) {
    return data as ProductoListItem[];
  }

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { items?: ProductoListItem[] }).items)
  ) {
    return (data as { items: ProductoListItem[] }).items;
  }

  return [];
}

export function sortSucursales(options: SucursalOption[]) {
  return [...options].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function sortUbicaciones(options: InventarioExistenciasUbicacion[]) {
  const tiendas = options
    .filter((u) => String(u.tipo).toUpperCase() === "TIENDA")
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  const bodegas = options
    .filter((u) => String(u.tipo).toUpperCase() !== "TIENDA")
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  return [...tiendas, ...bodegas];
}

export function buildSyntheticDetalle(item: ExistenciaRow): ExistenciaDetalle {
  const producto: ExistenciaProductoLite = item.producto ?? {
    id_producto: item.id_producto,
    sku: item.producto_sku ?? "",
    nombre: item.producto_nombre ?? `Producto #${item.id_producto}`,
    imagen_url: item.producto_imagen_url ?? null,
    codigo_barras: item.producto_codigo_barras ?? null,
    modelo: item.producto_modelo ?? null,
  };

  const ubicacion: ExistenciaUbicacionLite = item.ubicacion ?? {
    id_ubicacion: item.id_ubicacion,
    id_sucursal: 0,
    tipo: item.ubicacion_tipo ?? "",
    nombre: item.ubicacion_nombre ?? "Ubicación no disponible",
    codigo: item.ubicacion_codigo ?? "",
    vendible: item.ubicacion_vendible ?? false,
    activo: item.ubicacion_activo ?? true,
    sucursal_nombre: item.sucursal_nombre ?? "Sucursal no disponible",
    ubicacion_nombre_completo:
      item.ubicacion_nombre ?? "Ubicación no disponible",
  };

  return {
    id_existencia: item.id_existencia,
    id_producto: item.id_producto,
    id_ubicacion: item.id_ubicacion,
    existencia: item.existencia,
    creado_en: "",
    actualizado_en: item.actualizado_en ?? "",
    producto,
    ubicacion,
  };
}