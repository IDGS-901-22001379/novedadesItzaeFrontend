// src/modules/compras/components/compras/ComprasRowActions.tsx
// Acciones por fila en la tabla de Compras.

import type { CompraListItem } from "../../types/compras.types";

type Props = {
  item: CompraListItem;
  onVer: (item: CompraListItem) => void;
};

export default function ComprasRowActions({ item, onVer }: Props) {
  return (
    <div className="flex justify-end">
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
