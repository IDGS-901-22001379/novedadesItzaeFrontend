// src/modules/traspasos/components/traspasos/TraspasosRowActions.tsx
// Acciones por fila en la tabla de Traspasos.
// Responsabilidades: renderizar botón Ver.
// Nota UI: se conserva el mismo patrón visual del módulo Usuarios.

import type { TraspasoItemListado } from "../../types/traspasos.types";

type Props = {
  item: TraspasoItemListado;
  onVer: (item: TraspasoItemListado) => void;
};

export default function TraspasosRowActions({ item, onVer }: Props) {
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
