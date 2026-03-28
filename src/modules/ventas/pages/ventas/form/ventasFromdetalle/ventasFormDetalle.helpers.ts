// src/modules/ventas/pages/ventas/form/ventasFromdetalle/ventasFormDetalle.helpers.ts

import type { VentaDetalleForm } from "../ventasForm.types";
import type { VentaProductoOption } from "../../../../types";
import type { EditableField } from "./ventasFormDetalle.types";

export const EDITABLE_FIELDS: EditableField[] = [
  "presentacion",
  "cantidad",
  "descuento",
  "iva_tasa",
];

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function toNumberSafe(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function resolveProductoFromDetalle(
  detalle: VentaDetalleForm | null | undefined,
  productosInfoMap: Map<number, VentaProductoOption>,
): VentaProductoOption | null {
  if (!detalle?.id_producto) return null;
  return productosInfoMap.get(detalle.id_producto) ?? null;
}

export function buildCellKey(rowIndex: number, field: EditableField): string {
  return `${rowIndex}__${field}`;
}