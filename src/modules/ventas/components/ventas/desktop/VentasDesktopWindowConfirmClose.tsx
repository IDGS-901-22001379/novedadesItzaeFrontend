// src/modules/ventas/components/ventas/desktop/VentasDesktopWindowConfirmClose.tsx
// Confirmación pequeña al cerrar una ventana de ventas.
// Responsabilidades:
// - Preguntar si se desea cerrar cuando hay datos capturados.
// - Permitir cancelar, cerrar sin guardar o guardar y cerrar.

import type { VentasDesktopWindowConfirmCloseProps } from "./ventasDesktopWindow.types";

export default function VentasDesktopWindowConfirmClose({
  open,
  saving,
  onCancel,
  onCloseWithoutSave,
  onSaveAndClose,
}: VentasDesktopWindowConfirmCloseProps) {
  if (!open) return null;

  return (
    <div className="absolute right-5 top-12 z-60 w-full max-w-sm rounded-2xl border border-black/10 bg-white p-4 shadow-2xl">
      <div className="text-sm font-extrabold text-black/80">
        ¿Deseas cerrar esta ventana?
      </div>

      <div className="mt-2 text-sm font-semibold text-black/65">
        Hay información capturada. Puedes cancelar, cerrar sin guardar o guardar
        y cerrar.
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onCloseWithoutSave}
          disabled={saving}
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-extrabold text-white hover:bg-red-600 disabled:opacity-50"
        >
          Cerrar sin guardar
        </button>

        <button
          type="button"
          onClick={() => void onSaveAndClose()}
          disabled={saving}
          className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] hover:bg-[#2fe72f] disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar y cerrar"}
        </button>
      </div>
    </div>
  );
}
