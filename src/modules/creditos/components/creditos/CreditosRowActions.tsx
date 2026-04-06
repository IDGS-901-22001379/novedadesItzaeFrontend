// src/modules/creditos/components/creditos/CreditosRowActions.tsx
// Acciones por fila en la tabla de Créditos.
// Responsabilidades: renderizar botones Ver y Editar.
// Nota UI: los botones usan ancho fijo para que no se mueva el layout.

import type { CreditoListItem } from "../../types/creditos.types";

type Props = {
  item: CreditoListItem;
  onVer: (item: CreditoListItem) => void;
  onEditar: (item: CreditoListItem) => void;
};

export default function CreditosRowActions({ item, onVer, onEditar }: Props) {
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
    </div>
  );
}
