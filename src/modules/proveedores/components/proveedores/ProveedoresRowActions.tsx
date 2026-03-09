// src/modules/proveedores/components/proveedores/ProveedoresRowActions.tsx
// Acciones por fila en la tabla de Proveedores.
// Responsabilidades: renderizar botones Ver/Editar y Activar/Desactivar según estatus.
// Nota UI: el botón de estatus usa ancho fijo para que no se mueva el layout.

import type { ProveedorListItem } from "../../types/proveedores.types";

type Props = {
  proveedor: ProveedorListItem;
  onVer: (p: ProveedorListItem) => void;
  onEditar: (p: ProveedorListItem) => void;
  onEliminar: (p: ProveedorListItem) => void; // mantiene el mismo handler
};

export default function ProveedoresRowActions({
  proveedor,
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  const isInactivo = proveedor.estatus === "INACTIVO";

  const btnEstatusClass = isInactivo
    ? "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]"
    : "bg-red-500 text-white hover:bg-red-600";

  const btnEstatusText = isInactivo ? "Activar" : "Desactivar";

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => onVer(proveedor)}
        className="w-20 rounded-lg bg-[#2B6CB0] px-3 py-1.5 text-center text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>

      <button
        type="button"
        onClick={() => onEditar(proveedor)}
        className="w-20 rounded-lg bg-[#ECC94B] px-3 py-1.5 text-center text-xs font-extrabold text-[#1A202C] hover:opacity-90"
      >
        Editar
      </button>

      <button
        type="button"
        onClick={() => onEliminar(proveedor)}
        className={`w-24 rounded-lg px-3 py-1.5 text-center text-xs font-extrabold shadow-sm ${btnEstatusClass}`}
        title={btnEstatusText}
      >
        {btnEstatusText}
      </button>
    </div>
  );
}
