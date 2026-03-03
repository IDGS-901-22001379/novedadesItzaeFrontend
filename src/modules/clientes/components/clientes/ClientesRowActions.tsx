// src/modules/clientes/components/clientes/ClientesRowActions.tsx
// Acciones por fila en la tabla de Clientes.
// Responsabilidades: renderizar botones Ver/Editar y Activar/Desactivar según estatus.
// Nota UI: el botón de estatus usa ancho fijo para que no se mueva el layout.

import type { ClienteListItem } from "../../types/clientes.types";

type Props = {
  cliente: ClienteListItem;
  onVer: (c: ClienteListItem) => void;
  onEditar: (c: ClienteListItem) => void;
  onEliminar: (c: ClienteListItem) => void;
};

export default function ClientesRowActions({
  cliente,
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  const isInactivo = cliente.estatus === "INACTIVO";

  const btnEstatusClass = isInactivo
    ? "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]"
    : "bg-red-500 text-white hover:bg-red-600";

  const btnEstatusText = isInactivo ? "Activar" : "Desactivar";

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => onVer(cliente)}
        className="w-20 rounded-lg bg-[#2B6CB0] px-3 py-1.5 text-center text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>

      <button
        type="button"
        onClick={() => onEditar(cliente)}
        className="w-20 rounded-lg bg-[#ECC94B] px-3 py-1.5 text-center text-xs font-extrabold text-[#1A202C] hover:opacity-90"
      >
        Editar
      </button>

      <button
        type="button"
        onClick={() => onEliminar(cliente)}
        className={`w-24 rounded-lg px-3 py-1.5 text-center text-xs font-extrabold shadow-sm ${btnEstatusClass}`}
        title={btnEstatusText}
      >
        {btnEstatusText}
      </button>
    </div>
  );
}
