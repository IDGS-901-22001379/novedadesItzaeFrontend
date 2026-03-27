// src/modules/ventas/pages/ventas/form/cobro/CobroPagos.tsx

import type { VentaPagoForm } from "../ventasForm.types";
import type { FormaPagoOption } from "./cobro.types";

type Props = {
  pagos: VentaPagoForm[];
  formasPago: FormaPagoOption[];
  saving: boolean;
  onUpdatePago: (index: number, patch: Partial<VentaPagoForm>) => void;
  onAgregarPago: () => void;
  onEliminarPago: (index: number) => void;
};

export default function CobroPagos({
  pagos,
  formasPago,
  saving,
  onUpdatePago,
  onAgregarPago,
  onEliminarPago,
}: Props) {
  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold text-black/70">
          Métodos de pago
        </div>

        <button
          type="button"
          onClick={onAgregarPago}
          disabled={saving}
          className="rounded-xl bg-[#34f334] px-3 py-2 text-sm font-extrabold text-[#0b2b0b] hover:bg-[#2fe72f] disabled:opacity-50"
        >
          Agregar pago
        </button>
      </div>

      {pagos.map((pago, index) => (
        <div
          key={`pago-cobro-${index}`}
          className="rounded-2xl border border-black/10 bg-black/5 p-3"
        >
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-extrabold">Método de pago</label>
              <select
                value={pago.id_forma_pago ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value || 0) || null;
                  const selected =
                    formasPago.find((fp) => fp.id_forma_pago === id) ?? null;

                  onUpdatePago(index, {
                    id_forma_pago: id,
                    forma_pago_label: selected?.forma_pago_label ?? "",
                  });
                }}
                disabled={saving}
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50"
              >
                <option value="">Seleccionar método de pago</option>
                {formasPago.map((forma) => (
                  <option key={forma.id_forma_pago} value={forma.id_forma_pago}>
                    {forma.forma_pago_label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  value={pago.monto}
                  onChange={(e) =>
                    onUpdatePago(index, {
                      monto: Number(e.target.value || 0),
                    })
                  }
                  disabled={saving}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-extrabold">Referencia</label>
                <input
                  value={pago.referencia}
                  onChange={(e) =>
                    onUpdatePago(index, {
                      referencia: e.target.value,
                    })
                  }
                  disabled={saving}
                  placeholder="Opcional"
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onEliminarPago(index)}
                disabled={saving || pagos.length <= 1}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-extrabold text-white hover:bg-red-600 disabled:opacity-50"
              >
                Eliminar pago
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
