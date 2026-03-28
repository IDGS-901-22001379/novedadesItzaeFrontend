// src/modules/ventas/pages/ventas/form/VentasFormToolbar.tsx
// Barra de acciones inferior del formulario de ventas.
// Responsabilidades:
// - Mostrar botones finales según el modo del formulario.
// - Reutilizar la misma base para CREAR y VER.

import type { VentasFormModo } from "./ventasForm.types";

type Props = {
  modo: VentasFormModo;
  saving: boolean;
  onCancel: () => void;
  onGuardar: () => void;
};

export default function VentasFormToolbar({
  modo,
  saving,
  onCancel,
  onGuardar,
}: Props) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving && modo === "CREAR"}
        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5 disabled:opacity-50"
      >
        {modo === "VER" ? "Cerrar" : "Cancelar"}
      </button>

      {modo === "CREAR" ? (
        <button
          type="button"
          onClick={onGuardar}
          disabled={saving}
          className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f] disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Registrar venta"}
        </button>
      ) : null}
    </div>
  );
}
