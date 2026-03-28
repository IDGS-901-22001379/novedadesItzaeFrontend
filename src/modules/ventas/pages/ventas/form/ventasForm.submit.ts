// src/modules/ventas/pages/ventas/form/ventasForm.submit.ts
// Guardado del formulario de ventas.
// Responsabilidades:
// - Construir el payload.
// - Ejecutar validación previa.
// - Enviar la venta al backend.

import { ventasService } from "../../../services/ventas.service";
import type { VentaCreatePayload, VentaFormState } from "./ventasForm.types";
import { calcDetalleImporte, calcDetalleImpuesto } from "./ventasForm.utils";
import { validarVenta } from "./ventasForm.validators";

type BuildPayloadParams = {
  form: VentaFormState;
  subtotal: number;
  descuentoTotal: number;
  impuestosTotal: number;
  total: number;
  montoPagado: number;
  cambio: number;
};

export function buildVentaCreatePayload({
  form,
  subtotal,
  descuentoTotal,
  impuestosTotal,
  total,
  montoPagado,
  cambio,
}: BuildPayloadParams): VentaCreatePayload {
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

      subtotal: Number(subtotal.toFixed(2)),
      descuento_total: Number(descuentoTotal.toFixed(2)),
      impuestos_total: Number(impuestosTotal.toFixed(2)),
      total: Number(total.toFixed(2)),
      monto_pagado: Number(montoPagado.toFixed(2)),
      cambio: Number(cambio.toFixed(2)),
    },

    detalles: form.detalles.map((d) => ({
      id_producto: Number(d.id_producto),
      presentacion: d.presentacion,
      unidades_por_caja: Number(d.unidades_por_caja),
      cantidad: Number(d.cantidad),
      precio_unitario: Number(d.precio_unitario),
      descuento: Number(d.descuento),
      iva_tasa: Number(d.iva_tasa),
      impuestos: Number(calcDetalleImpuesto(d).toFixed(2)),
      importe: Number(calcDetalleImporte(d).toFixed(2)),
    })),

    pagos: form.pagos.map((p) => ({
      id_forma_pago: Number(p.id_forma_pago),
      monto: Number(p.monto),
      referencia: p.referencia.trim() || null,
    })),
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
}): Promise<void> {
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
    montoPagado: params.montoPagado,
    cambio: params.cambio,
  });

  await ventasService.crear(payload);
}