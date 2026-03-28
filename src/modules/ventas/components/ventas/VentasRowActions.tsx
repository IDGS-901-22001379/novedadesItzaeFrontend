// src/modules/ventas/components/ventas/VentasRowActions.tsx
// Acciones por fila en la tabla de Ventas.
// Responsabilidades:
// - Renderizar la acción principal de visualización.
// - Mantener el mismo patrón visual del resto de módulos.
// Nota:
// Las acciones de imprimir / facturar / mandar a crédito vivirán dentro
// del modal de visualización de la venta, no en la tabla.

import type { VentaListItem } from "../../types";

type Props = {
  item: VentaListItem;
  onVer: (item: VentaListItem) => void;
};

export default function VentasRowActions({ item, onVer }: Props) {
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
