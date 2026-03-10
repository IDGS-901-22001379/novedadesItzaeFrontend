// src/modules/inventario_sucursales/components/inventario_sucursales/InventarioSucursalesRowActions.tsx
// Acciones por fila en la tabla de Inventario - Sucursales.
// Responsabilidades: renderizar botones Ver/Editar y Activar/Desactivar según estatus.
// Nota UI: el botón de estatus usa ancho fijo para que no se mueva el layout.

import type { InventarioSucursalListItem } from "../../types";

type Props = {
  item: InventarioSucursalListItem;
  onVer: (item: InventarioSucursalListItem) => void;
  onEditar: (item: InventarioSucursalListItem) => void;
  onEliminar: (item: InventarioSucursalListItem) => void;
};

export default function InventarioSucursalesRowActions({
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
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => onVer(item)}
        className="w-20 rounded-lg bg-[#2B6CB0] px-3 py-1.5 text-center text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>

      <button
        type="button"
        onClick={() => onEditar(item)}
        className="w-20 rounded-lg bg-[#ECC94B] px-3 py-1.5 text-center text-xs font-extrabold text-[#1A202C] hover:opacity-90"
      >
        Editar
      </button>

      <button
        type="button"
        onClick={() => onEliminar(item)}
        className={`w-24 rounded-lg px-3 py-1.5 text-center text-xs font-extrabold shadow-sm ${btnEstatusClass}`}
        title={btnEstatusText}
      >
        {btnEstatusText}
      </button>
    </div>
  );
}
