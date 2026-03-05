// src/modules/clientes_tipos/components/clientes_tipos/ClientesTiposRowActions.tsx
// Acciones por fila en la tabla de Clientes Tipos.
// Responsabilidades: renderizar botones Ver/Editar y Activar/Desactivar según estatus.
// Nota UI: botones compactos y responsivos para que el módulo se vea más pequeño.

import type { ClienteTipo } from "../../types/clientes.types";

type Props = {
  item: ClienteTipo;
  onVer: (item: ClienteTipo) => void;
  onEditar: (item: ClienteTipo) => void;
  onEliminar: (item: ClienteTipo) => void;
};

export default function ClientesTiposRowActions({
  item,
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  const isInactivo = item.activo === false;

  const btnEstatusClass = isInactivo
    ? "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]"
    : "bg-red-500 text-white hover:bg-red-600";

  const btnEstatusText = isInactivo ? "Activar" : "Desactivar";

  return (
    <div className="flex justify-end gap-1.5 sm:gap-2">
      <button
        type="button"
        onClick={() => onVer(item)}
        className="w-14.5 sm:w-16 rounded-lg bg-[#2B6CB0] px-2 py-1.5 text-center text-[11px] sm:text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>

      <button
        type="button"
        onClick={() => onEditar(item)}
        className="w-14.5 sm:w-16 rounded-lg bg-[#ECC94B] px-2 py-1.5 text-center text-[11px] sm:text-xs font-extrabold text-[#1A202C] hover:opacity-90"
      >
        Editar
      </button>

      <button
        type="button"
        onClick={() => onEliminar(item)}
        className={`w-19.5 sm:w-20 rounded-lg px-2 py-1.5 text-center text-[11px] sm:text-xs font-extrabold shadow-sm ${btnEstatusClass}`}
        title={btnEstatusText}
      >
        {btnEstatusText}
      </button>
    </div>
  );
}
