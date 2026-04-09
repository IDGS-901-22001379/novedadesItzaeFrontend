// src/modules/ventas/pages/ventas/form/VentasCobroModal.tsx
// Modal de cobro de ventas.
// Responsabilidades:
// - Mostrar el resumen final antes de registrar la venta.
// - Mostrar todos los productos de la venta.
// - Capturar método de pago, monto pagado y referencia.
// - Calcular restante y cambio.
// - Permitir confirmar con Enter.
// - Abrir la vista previa del ticket antes de imprimir.

import { useMemo, useState } from "react";

import type { VentasCobroModalProps } from "./cobro/cobro.types";
import {
  CobroFooter,
  CobroHeader,
  CobroPagos,
  CobroProductosTable,
  CobroResumen,
} from "./cobro";
import { useCobroHotkeys } from "./cobro";
import type { TiketData } from "./tiket";
import { TiketPreviewModal } from "./tiket";

type CobroDetalleLike = {
  id_producto?: number | null;
  producto_label?: string | null;
  presentacion?: string | null;
  cantidad?: number | null;
  precio_unitario?: number | null;
  descuento?: number | null;
  impuestos?: number | null;
  importe?: number | null;
};

type CobroPagoLike = {
  id_forma_pago?: number | null;
  forma_pago_label?: string | null;
  monto?: number | null;
  referencia?: string | null;
};

type Props = VentasCobroModalProps & {
  ticketData?: TiketData | null;
};

export default function VentasCobroModal({
  open,
  saving = false,
  detalles,
  pagos,
  subtotal,
  descuentoTotal,
  impuestosTotal,
  total,
  montoPagado,
  cambio,
  formasPago = [],
  onClose,
  onConfirmar,
  onImprimir,
  onUpdatePago,
  onAgregarPago,
  onEliminarPago,
  ticketData,
}: Props) {
  const [ticketPreviewOpen, setTicketPreviewOpen] = useState(false);

  useCobroHotkeys({
    open,
    onClose,
    onConfirmar,
  });

  const restante = useMemo(() => {
    const value = Number(total || 0) - Number(montoPagado || 0);
    return value > 0 ? value : 0;
  }, [total, montoPagado]);

  const detallesPreview = useMemo<CobroDetalleLike[]>(() => {
    return Array.isArray(detalles) ? (detalles as CobroDetalleLike[]) : [];
  }, [detalles]);

  const pagosPreview = useMemo<CobroPagoLike[]>(() => {
    return Array.isArray(pagos) ? (pagos as CobroPagoLike[]) : [];
  }, [pagos]);

  const previewData = useMemo<TiketData>(() => {
    if (ticketData) return ticketData;

    return {
      folio: "Vista previa",
      fecha_hora: new Date().toISOString(),
      cliente_label: "Cliente",
      vendedor_label: "Vendedor",
      apertura_label: "",
      notas: "",
      es_credito: restante > 0,

      subtotal: Number(subtotal || 0),
      descuento_total: Number(descuentoTotal || 0),
      impuestos_total: Number(impuestosTotal || 0),
      total: Number(total || 0),
      monto_pagado: Number(montoPagado || 0),
      saldo_pendiente: Number(restante || 0),
      cambio: Number(cambio || 0),

      detalles: detallesPreview.map((d, index) => ({
        id_producto: d.id_producto ?? index,
        producto_label: d.producto_label || "Producto",
        presentacion: d.presentacion || "UNIDAD",
        cantidad: Number(d.cantidad || 0),
        precio_unitario: Number(d.precio_unitario || 0),
        descuento: Number(d.descuento || 0),
        impuestos: Number(d.impuestos || 0),
        importe: Number(d.importe || 0),
      })),

      pagos: pagosPreview
        .filter(
          (p) =>
            Boolean(p.id_forma_pago) ||
            Number(p.monto) > 0 ||
            String(p.referencia || "").trim() !== "",
        )
        .map((p) => ({
          forma_pago_label: p.forma_pago_label || "Forma de pago",
          monto: Number(p.monto || 0),
          referencia: p.referencia?.trim() || null,
        })),
    };
  }, [
    ticketData,
    subtotal,
    descuentoTotal,
    impuestosTotal,
    total,
    montoPagado,
    cambio,
    restante,
    detallesPreview,
    pagosPreview,
  ]);

  function handleOpenPreview() {
    setTicketPreviewOpen(true);
    onImprimir();
  }

  function handleClosePreview() {
    setTicketPreviewOpen(false);
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/40 p-4">
        <div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          <CobroHeader saving={saving} onClose={onClose} />

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden p-4 xl:grid-cols-[1.5fr_1fr]">
            <CobroProductosTable detalles={detalles} />

            <div className="min-h-0 overflow-auto rounded-2xl border border-black/10 bg-white p-4">
              <div className="mb-3 text-sm font-extrabold text-black/70">
                Resumen y cobro
              </div>

              <CobroResumen
                subtotal={subtotal}
                descuentoTotal={descuentoTotal}
                impuestosTotal={impuestosTotal}
                total={total}
                montoPagado={montoPagado}
                cambio={cambio}
              />

              <CobroPagos
                pagos={pagos}
                formasPago={formasPago}
                saving={saving}
                onUpdatePago={onUpdatePago}
                onAgregarPago={onAgregarPago}
                onEliminarPago={onEliminarPago}
              />

              <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <div className="text-sm font-extrabold text-blue-800">
                  Vista previa del ticket
                </div>
                <div className="mt-1 text-sm font-semibold text-blue-700">
                  Puedes revisar el ticket antes de confirmar o imprimir la
                  venta.
                </div>
                <div className="mt-2 text-xs font-semibold text-blue-600">
                  Puedes presionar Enter para confirmar el cobro.
                </div>
              </div>
            </div>
          </div>

          <CobroFooter
            saving={saving}
            onClose={onClose}
            onImprimir={handleOpenPreview}
            onConfirmar={onConfirmar}
          />
        </div>
      </div>

      <TiketPreviewModal
        open={ticketPreviewOpen}
        data={previewData}
        title="Vista previa del ticket"
        onClose={handleClosePreview}
      />
    </>
  );
}
