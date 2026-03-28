// src/modules/caja/components/caja/CajaRowActions.tsx
// Acciones por fila en la tabla de Cajas.
// Responsabilidades: renderizar botones Ver, Editar y Activar/Desactivar según el estado actual.
// Nota UI: el botón de estado usa ancho fijo para que no se mueva el layout.

import type { Caja } from "../../types/caja.types";

type Props = {
  caja: Caja;
  onVer: (caja: Caja) => void;
  onEditar: (caja: Caja) => void;
  onEliminar: (caja: Caja) => void;
};

export default function CajaRowActions({
  caja,
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  const isInactiva = caja.activo === false;

  const btnEstadoClass = isInactiva
    ? "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]"
    : "bg-red-500 text-white hover:bg-red-600";

  const btnEstadoText = isInactiva ? "Activar" : "Desactivar";

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => onVer(caja)}
        className="w-20 rounded-lg bg-[#2B6CB0] px-3 py-1.5 text-center text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>

      <button
        type="button"
        onClick={() => onEditar(caja)}
        className="w-20 rounded-lg bg-[#ECC94B] px-3 py-1.5 text-center text-xs font-extrabold text-[#1A202C] hover:opacity-90"
      >
        Editar
      </button>

      <button
        type="button"
        onClick={() => onEliminar(caja)}
        className={`w-24 rounded-lg px-3 py-1.5 text-center text-xs font-extrabold shadow-sm ${btnEstadoClass}`}
        title={btnEstadoText}
      >
        {btnEstadoText}
      </button>
    </div>
  );
}
