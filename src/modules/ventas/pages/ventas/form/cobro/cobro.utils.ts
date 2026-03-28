// src/modules/ventas/pages/ventas/form/cobro/cobro.utils.ts

import type { VentaDetalleForm } from "../ventasForm.types";

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function calcDetalleBase(detalle: VentaDetalleForm): number {
  return (
    Math.max(0, Number(detalle.cantidad) * Number(detalle.precio_unitario)) -
    Math.max(0, Number(detalle.descuento))
  );
}

export function calcDetalleImpuesto(detalle: VentaDetalleForm): number {
  const base = calcDetalleBase(detalle);
  return base * (Math.max(0, Number(detalle.iva_tasa)) / 100);
}

export function calcDetalleTotal(detalle: VentaDetalleForm): number {
  return calcDetalleBase(detalle) + calcDetalleImpuesto(detalle);
}