// src/modules/ventas/pages/ventas/form/VentasCobroModal.tsx
// Modal de cobro de ventas.
// Responsabilidades:
// - Mostrar el resumen final antes de registrar la venta.
// - Mostrar todos los productos de la venta.
// - Capturar método de pago, monto pagado y referencia.
// - Calcular restante y cambio.
// - Permitir confirmar con Enter.
// - Dejar lista la decisión final de cancelar o imprimir.

import type { VentasCobroModalProps } from "./cobro/cobro.types";
import {
  CobroFooter,
  CobroHeader,
  CobroPagos,
  CobroProductosTable,
  CobroResumen,
} from "./cobro";
import { useCobroHotkeys } from "./cobro";

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
}: VentasCobroModalProps) {
  useCobroHotkeys({
    open,
    onClose,
    onConfirmar,
  });

  if (!open) return null;

  return (
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
                Al confirmar se registrará la venta. Después podrás cancelar o
                imprimir el ticket.
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
          onImprimir={onImprimir}
          onConfirmar={onConfirmar}
        />
      </div>
    </div>
  );
}
