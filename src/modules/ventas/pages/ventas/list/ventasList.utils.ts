// src/modules/ventas/pages/ventas/list/ventasList.utils.ts
// Utilidades del listado de ventas.
// Responsabilidades:
// - Resolver mensajes de error amigables.
// - Calcular resumen del listado.
// - Calcular datos visibles de paginación.

import type { VentaListItem } from "../../../types";
import type { VentasResumen } from "./ventasList.types";

// Convierte errores desconocidos en un mensaje entendible para la UI.
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar la lista de ventas.";
}

// Calcula el resumen superior del módulo.
export function buildVentasResumen(items: VentaListItem[]): VentasResumen {
  const completadas = items.filter(
    (item) => item.estatus === "COMPLETADA",
  ).length;

  const canceladas = items.filter(
    (item) => item.estatus === "CANCELADA",
  ).length;

  const totalImporte = items.reduce(
    (acc, item) => acc + Number(item.total || 0),
    0,
  );

  return {
    completadas,
    canceladas,
    total: items.length,
    totalImporte,
  };
}

// Regresa solo los elementos visibles de la página actual.
export function buildItemsPagina<T>(
  items: T[],
  page: number,
  pageSize: number,
): T[] {
  const start = page * pageSize;
  return items.slice(start, start + pageSize);
}

// Calcula el total de páginas, asegurando mínimo 1 para no romper la UI.
export function buildTotalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

// Calcula el rango visual mostrado por la paginación.
export function buildPaginationRange(
  page: number,
  pageSize: number,
  total: number,
) {
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  return { from, to };
}