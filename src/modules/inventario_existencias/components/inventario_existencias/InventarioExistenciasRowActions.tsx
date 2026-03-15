// src/modules/inventario_existencias/components/inventario_existencias/InventarioExistenciasRowActions.tsx

import type { ExistenciaItem } from "../../types/inventarioExistencias.types";

type Props = {
  item: ExistenciaItem;
  onVer: (item: ExistenciaItem) => void;
  onEditar: (item: ExistenciaItem) => void;
};

export default function InventarioExistenciasRowActions({
  item,
  onVer,
  onEditar,
}: Props) {
  const esVirtual = item.es_existencia_real === false;

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => onVer(item)}
        title={esVirtual ? "Ver registro virtual de cobertura" : "Ver detalle"}
        className="w-20 rounded-lg bg-[#2B6CB0] px-3 py-1.5 text-center text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>

      <button
        type="button"
        onClick={() => onEditar(item)}
        title={
          esVirtual
            ? "Ajustar existencia y crear registro real"
            : "Ajustar existencia"
        }
        className="w-20 rounded-lg bg-[#ECC94B] px-3 py-1.5 text-center text-xs font-extrabold text-[#1A202C] hover:opacity-90"
      >
        Ajustar
      </button>
    </div>
  );
}
