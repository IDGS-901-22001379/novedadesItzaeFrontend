// src/modules/movimientos_inventario/components/movimientos_inventario/Movimientos_inventarioRowActions.tsx
// Acciones por fila en la tabla de Movimientos de Inventario.
// Responsabilidades: renderizar botón Ver para consultar el detalle del movimiento.

import type { MovimientoInventarioItem } from "../../types/movimientos_inventario.types";

type Props = {
  item: MovimientoInventarioItem;
  onVer: (item: MovimientoInventarioItem) => void;
};

export default function Movimientos_inventarioRowActions({
  item,
  onVer,
}: Props) {
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => onVer(item)}
        className="w-20 rounded-lg bg-[#2B6CB0] px-3 py-1.5 text-center text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>
    </div>
  );
}
