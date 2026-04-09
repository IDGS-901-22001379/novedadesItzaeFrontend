// src/modules/ventas/pages/ventas/form/ventasForm.submit.ts
// Guardado del formulario de ventas.
// Responsabilidades:
// - Construir el payload.
// - Ejecutar validación previa.
// - Enviar la venta al backend.
// - Soportar ventas de contado y ventas a crédito.

import { ventasService } from "../../../services/ventas.service";
import type {
  VentaCreatePayload,
  VentaCreateResponse,
  VentaFormState,
} from "./ventasForm.types";
import { calcDetalleImporte, calcDetalleImpuesto } from "./ventasForm.utils";
import { validarVenta } from "./ventasForm.validators";

type BuildPayloadParams = {
  form: VentaFormState;
  subtotal: number;
  descuentoTotal: number;
  impuestosTotal: number;
  total: number;
  cambio: number;
};

function round2(value: number): number {
  return Number(value.toFixed(2));
}

function calcSaldoPendiente(total: number, montoPagado: number): number {
  const saldo = total - montoPagado;
  return saldo > 0 ? saldo : 0;
}

export function buildVentaCreatePayload({
  form,
  subtotal,
  descuentoTotal,
  impuestosTotal,
  total,
  cambio,
}: BuildPayloadParams): VentaCreatePayload {
  const esCredito = Boolean(form.es_credito);

  const pagosLimpios = form.pagos
    .filter((p) => p.id_forma_pago && Number(p.monto) > 0)
    .map((p) => ({
      id_forma_pago: Number(p.id_forma_pago),
      monto: round2(Number(p.monto)),
      referencia: p.referencia.trim() || null,
    }));

  const montoPagadoFinal = round2(
    pagosLimpios.reduce((acc, p) => acc + Number(p.monto || 0), 0),
  );

  const saldoPendiente = round2(calcSaldoPendiente(total, montoPagadoFinal));

  return {
    header: {
      id_cliente: form.id_cliente ?? null,
      id_usuario_vendedor: Number(form.id_usuario_vendedor),
      id_apertura: form.id_apertura ?? null,
      notas: form.notas.trim() || null,
      fecha_hora_pos: form.fecha_hora_pos
        ? new Date(form.fecha_hora_pos).toISOString()
        : null,
      timezone_pos: form.timezone_pos.trim() || "America/Mexico_City",
      offset_minutos_pos: Number(form.offset_minutos_pos || 0),
      fuente_hora: form.fuente_hora,

      es_credito: esCredito,

      marcada_para_facturar: Boolean(form.marcada_para_facturar),

      id_cliente_fiscal: form.marcada_para_facturar
        ? form.id_cliente_fiscal ?? null
        : null,

      id_forma_pago_principal: form.marcada_para_facturar
        ? form.id_forma_pago_principal ?? null
        : null,

      id_metodo_pago_cfdi: form.marcada_para_facturar
        ? form.id_metodo_pago_cfdi ?? null
        : null,

      folio: null,
      estatus: "COMPLETADA",

      subtotal: round2(subtotal),
      descuento_total: round2(descuentoTotal),
      impuestos_total: round2(impuestosTotal),
      total: round2(total),
      monto_pagado: montoPagadoFinal,
      saldo_pendiente: saldoPendiente,
      cambio: esCredito ? 0 : round2(cambio),
    },

    detalles: form.detalles.map((d) => ({
      id_producto: Number(d.id_producto),
      presentacion: d.presentacion,
      unidades_por_caja: Number(d.unidades_por_caja),
      cantidad: Number(d.cantidad),
      precio_unitario: Number(d.precio_unitario),
      descuento: Number(d.descuento),
      iva_tasa: Number(d.iva_tasa),
      impuestos: round2(calcDetalleImpuesto(d)),
      importe: round2(calcDetalleImporte(d)),
    })),

    pagos: pagosLimpios,
  };
}

export async function submitVenta(params: {
  form: VentaFormState;
  total: number;
  montoPagado: number;
  subtotal: number;
  descuentoTotal: number;
  impuestosTotal: number;
  cambio: number;
}): Promise<VentaCreateResponse> {
  const err = validarVenta({
    form: params.form,
    total: params.total,
    montoPagado: params.montoPagado,
  });

  if (err) {
    throw new Error(err);
  }

  const payload = buildVentaCreatePayload({
    form: params.form,
    subtotal: params.subtotal,
    descuentoTotal: params.descuentoTotal,
    impuestosTotal: params.impuestosTotal,
    total: params.total,
    cambio: params.cambio,
  });

  return await ventasService.crear(payload);
}