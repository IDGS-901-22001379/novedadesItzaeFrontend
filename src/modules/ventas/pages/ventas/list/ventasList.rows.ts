// src/modules/ventas/pages/ventas/list/ventasList.rows.ts
// Preparación de filas del listado de ventas.
// Responsabilidades:
// - Dejar una capa lista para enriquecer filas antes de mandarlas a la tabla.
// - Evitar meter transformaciones visuales directamente en el hook o en la tabla.

import type { VentaListItem } from "../../../types";

// Tipo extendido para futuras mejoras visuales de la tabla.
export type VentaListRow = VentaListItem & {
  cliente_nombre?: string | null;
  vendedor_nombre?: string | null;
};

// Por ahora solo regresa los mismos items, pero deja la estructura lista
// para enriquecer filas más adelante con nombres y etiquetas visibles.
export function buildVentasRows(items: VentaListItem[]): VentaListRow[] {
  return items.map((item) => ({
    ...item,
    cliente_nombre: undefined,
    vendedor_nombre: undefined,
  }));
}