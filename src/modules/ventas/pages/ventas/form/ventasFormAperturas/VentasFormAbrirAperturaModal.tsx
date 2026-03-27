// src/modules/ventas/pages/ventas/form/ventasFormAperturas/VentasFormAbrirAperturaModal.tsx
// Modal pequeño para abrir una apertura de caja en ventas.
// Responsabilidades:
// - Mostrar la caja por defecto.
// - Capturar el monto inicial.
// - Permitir cancelar o abrir la caja.
// - Mantener el flujo separado del resto del formulario.

import type { Dispatch, SetStateAction } from "react";
import { VENTAS_APERTURA_UI_TEXTS } from "./ventasFormAperturas.constants";
import type { AbrirAperturaFormState } from "./ventasFormAperturas.types";

type Props = {
  open: boolean;
  loading?: boolean;
  msgError?: string;
  form: AbrirAperturaFormState;
  setForm: Dispatch<SetStateAction<AbrirAperturaFormState>>;
  onClose: () => void;
  onConfirm: () => void;
};

export default function VentasFormAbrirAperturaModal({
  open,
  loading = false,
  msgError = "",
  form,
  setForm,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-black/10 px-6 py-4">
          <div className="text-lg font-extrabold text-black/80">
            {VENTAS_APERTURA_UI_TEXTS.tituloAbrirApertura}
          </div>
          <div className="mt-1 text-sm font-semibold text-black/50">
            Captura el monto inicial para abrir la caja.
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          {msgError ? (
            <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {msgError}
            </div>
          ) : null}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold">Caja</label>
            <input
              value={form.caja_label}
              disabled={true}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold">Monto inicial</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.monto_inicial}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  monto_inicial:
                    e.target.value === "" ? "" : Number(e.target.value),
                }))
              }
              placeholder={VENTAS_APERTURA_UI_TEXTS.placeholderMontoInicial}
              disabled={loading}
              autoFocus
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-black/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5 disabled:opacity-50"
          >
            {VENTAS_APERTURA_UI_TEXTS.cancelar}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-[#34f334] px-5 py-2 text-sm font-extrabold text-[#0b2b0b] hover:bg-[#2fe72f] disabled:opacity-50"
          >
            {loading ? "Abriendo..." : VENTAS_APERTURA_UI_TEXTS.abrirCaja}
          </button>
        </div>
      </div>
    </div>
  );
}
