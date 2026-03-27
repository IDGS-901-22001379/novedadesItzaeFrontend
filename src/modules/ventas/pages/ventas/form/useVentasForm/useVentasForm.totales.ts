// src/modules/ventas/pages/ventas/form/useVentasForm/useVentasForm.totales.ts

import type { VentaDetalleForm, VentaPagoForm } from "../ventasForm.types";
import { calcDetalleImporte, calcDetalleImpuesto } from "../ventasForm.utils";

export function calcSubtotal(detalles: VentaDetalleForm[]): number {
  return detalles.reduce(
    (acc, d) => acc + Number(d.cantidad) * Number(d.precio_unitario),
    0,
  );
}

export function calcDescuentoTotal(detalles: VentaDetalleForm[]): number {
  return detalles.reduce((acc, d) => acc + Number(d.descuento), 0);
}

export function calcImpuestosTotal(detalles: VentaDetalleForm[]): number {
  return detalles.reduce((acc, d) => acc + calcDetalleImpuesto(d), 0);
}

export function calcTotal(detalles: VentaDetalleForm[]): number {
  return detalles.reduce((acc, d) => acc + calcDetalleImporte(d), 0);
}

export function calcMontoPagado(pagos: VentaPagoForm[]): number {
  return pagos.reduce((acc, p) => acc + Number(p.monto), 0);
}

export function calcCambio(montoPagado: number, total: number): number {
  return Math.max(0, montoPagado - total);
}