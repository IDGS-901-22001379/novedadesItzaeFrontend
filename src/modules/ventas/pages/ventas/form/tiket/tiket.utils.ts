// src/modules/ventas/pages/ventas/form/tiket/tiket.utils.ts
// Utilidades del ticket.
// Responsabilidades:
// - Construir el ticket desde la venta del backend.
// - Construir vista previa del ticket desde el formulario.
// - Centralizar formatos de dinero y fecha.

import type { VentaObtenerResponse } from "../../../../types";
import type {
  VentaDetalleForm,
  VentaFormState,
  VentaPagoForm,
} from "../ventasForm.types";
import type { TiketData, TiketDetalleItem, TiketPagoItem } from "./tiket.types";

type VentaDetalleResponseLike = {
  id_producto: number;
  presentacion: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  impuestos: number;
  importe: number;
  producto_label?: string | null;
};

type VentaPagoResponseLike = {
  id_forma_pago: number;
  monto: number;
  referencia?: string | null;
  forma_pago_label?: string | null;
};

type VentaResponseLike = {
  folio?: string | null;
  fecha_hora_pos?: string | null;
  fecha_hora?: string | null;
  cliente_label?: string | null;
  vendedor_label?: string | null;
  apertura_label?: string | null;
  notas?: string | null;
  es_credito?: boolean | null;
  subtotal?: number | null;
  descuento_total?: number | null;
  impuestos_total?: number | null;
  total?: number | null;
  monto_pagado?: number | null;
  saldo_pendiente?: number | null;
  cambio?: number | null;
  detalles?: VentaDetalleResponseLike[] | null;
  pagos?: VentaPagoResponseLike[] | null;
};

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function mapDetalleFormToTicket(detalle: VentaDetalleForm): TiketDetalleItem {
  return {
    id_producto: detalle.id_producto ?? null,
    producto_label: detalle.producto_label || "Producto",
    presentacion: detalle.presentacion || "UNIDAD",
    cantidad: Number(detalle.cantidad || 0),
    precio_unitario: Number(detalle.precio_unitario || 0),
    descuento: Number(detalle.descuento || 0),
    impuestos: Number(detalle.impuestos || 0),
    importe: Number(detalle.importe || 0),
  };
}

function mapPagoFormToTicket(pago: VentaPagoForm): TiketPagoItem {
  return {
    forma_pago_label: pago.forma_pago_label || "Forma de pago",
    monto: Number(pago.monto || 0),
    referencia: pago.referencia?.trim() || null,
  };
}

export function buildTiketFromForm(params: {
  form: VentaFormState;
  subtotal: number;
  descuentoTotal: number;
  impuestosTotal: number;
  total: number;
  montoPagado: number;
  saldoPendiente: number;
  cambio: number;
}): TiketData {
  const {
    form,
    subtotal,
    descuentoTotal,
    impuestosTotal,
    total,
    montoPagado,
    saldoPendiente,
    cambio,
  } = params;

  return {
    folio: form.folio?.trim() || "Vista previa",
    fecha_hora: form.fecha_hora_pos,
    cliente_label: form.cliente_label?.trim() || "Público General",
    vendedor_label: form.vendedor_label?.trim() || "Vendedor",
    apertura_label: form.apertura_label?.trim() || "",
    notas: form.notas?.trim() || "",
    es_credito: Boolean(form.es_credito),

    subtotal: Number(subtotal || 0),
    descuento_total: Number(descuentoTotal || 0),
    impuestos_total: Number(impuestosTotal || 0),
    total: Number(total || 0),
    monto_pagado: Number(montoPagado || 0),
    saldo_pendiente: Number(saldoPendiente || 0),
    cambio: Number(cambio || 0),

    detalles: Array.isArray(form.detalles)
      ? form.detalles.map(mapDetalleFormToTicket)
      : [],

    pagos: Array.isArray(form.pagos)
      ? form.pagos
          .filter(
            (p) =>
              Boolean(p.id_forma_pago) ||
              Number(p.monto) > 0 ||
              p.referencia.trim() !== "",
          )
          .map(mapPagoFormToTicket)
      : [],
  };
}

export function buildTiketFromVentaResponse(
  ventaResponse: VentaObtenerResponse,
): TiketData {
  const venta = ventaResponse?.venta as unknown as VentaResponseLike;

  return {
    folio: venta?.folio?.trim() || "Sin folio",
    fecha_hora: venta?.fecha_hora_pos || venta?.fecha_hora || "",
    cliente_label: venta?.cliente_label?.trim() || "Cliente",
    vendedor_label: venta?.vendedor_label?.trim() || "Vendedor",
    apertura_label: venta?.apertura_label?.trim() || "",
    notas: venta?.notas || "",
    es_credito: Boolean(venta?.es_credito),

    subtotal: Number(venta?.subtotal || 0),
    descuento_total: Number(venta?.descuento_total || 0),
    impuestos_total: Number(venta?.impuestos_total || 0),
    total: Number(venta?.total || 0),
    monto_pagado: Number(venta?.monto_pagado || 0),
    saldo_pendiente: Number(venta?.saldo_pendiente || 0),
    cambio: Number(venta?.cambio || 0),

    detalles: Array.isArray(venta?.detalles)
      ? venta.detalles.map((d) => ({
          id_producto: d.id_producto,
          producto_label:
            d.producto_label?.trim() || `Producto #${d.id_producto}`,
          presentacion: d.presentacion,
          cantidad: Number(d.cantidad || 0),
          precio_unitario: Number(d.precio_unitario || 0),
          descuento: Number(d.descuento || 0),
          impuestos: Number(d.impuestos || 0),
          importe: Number(d.importe || 0),
        }))
      : [],

    pagos: Array.isArray(venta?.pagos)
      ? venta.pagos.map((p) => ({
          forma_pago_label:
            p.forma_pago_label?.trim() || `Forma #${p.id_forma_pago}`,
          monto: Number(p.monto || 0),
          referencia: p.referencia || null,
        }))
      : [],
  };
}