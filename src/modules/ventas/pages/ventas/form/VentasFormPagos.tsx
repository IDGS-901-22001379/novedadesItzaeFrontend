// src/modules/ventas/pages/ventas/form/VentasFormPagos.tsx
// Bloque de pagos de la venta.
// Responsabilidades:
// - Mostrar y capturar los pagos registrados en el ticket.
// - Permitir agregar y eliminar pagos en modo CREAR.
// - Dejar la base lista para pagos mixtos más adelante.

import type { VentaPagoForm } from "./ventasForm.types";

type Props = {
  pagos: VentaPagoForm[];
  readOnly: boolean;
  onUpdatePago: (index: number, patch: Partial<VentaPagoForm>) => void;
  onAgregarPago: () => void;
  onEliminarPago: (index: number) => void;
};

export default function VentasFormPagos({
  pagos,
  readOnly,
  onUpdatePago,
  onAgregarPago,
  onEliminarPago,
}: Props) {
  function updateField<K extends keyof VentaPagoForm>(
    index: number,
    key: K,
    value: VentaPagoForm[K],
  ) {
    onUpdatePago(index, { [key]: value } as Partial<VentaPagoForm>);
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-extrabold text-black/70">Pagos</div>

        {!readOnly ? (
          <button
            type="button"
            onClick={onAgregarPago}
            className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] hover:bg-[#2fe72f]"
          >
            Agregar pago
          </button>
        ) : null}
      </div>

      <div className="space-y-3">
        {pagos.map((pago, index) => (
          <div
            key={`pago-${index}`}
            className="rounded-2xl border border-black/10 bg-black/2 p-3"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* Forma de pago visible */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold">Forma de pago</label>
                <input
                  value={pago.forma_pago_label}
                  disabled={true}
                  placeholder="Seleccionar forma de pago"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
                />
                {(readOnly || pago.id_forma_pago != null) && (
                  <div className="text-[11px] font-semibold text-black/45">
                    ID forma de pago: {pago.id_forma_pago ?? "-"}
                  </div>
                )}
              </div>

              {/* Monto */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  value={pago.monto}
                  onChange={(e) =>
                    updateField(index, "monto", Number(e.target.value || 0))
                  }
                  disabled={readOnly}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
                />
              </div>

              {/* Referencia */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold">Referencia</label>
                <input
                  value={pago.referencia}
                  onChange={(e) =>
                    updateField(index, "referencia", e.target.value)
                  }
                  disabled={readOnly}
                  placeholder="Referencia opcional"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
                />
              </div>
            </div>

            {!readOnly ? (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => onEliminarPago(index)}
                  disabled={pagos.length <= 1}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-extrabold text-white hover:bg-red-600 disabled:opacity-50"
                >
                  Eliminar pago
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
