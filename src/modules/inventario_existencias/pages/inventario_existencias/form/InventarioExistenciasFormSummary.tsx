// src/modules/inventario_existencias/pages/inventario_existencias/form/InventarioExistenciasFormSummary.tsx

import InventarioExistenciasFormField from "./InventarioExistenciasFormField";

type Props = {
  existenciaActual: number;
  deltaCalculado: number;
  nuevaExistenciaPreview: number;
};

export default function InventarioExistenciasFormSummary({
  existenciaActual,
  deltaCalculado,
  nuevaExistenciaPreview,
}: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
      <div className="text-sm font-extrabold text-black/70">
        Resumen del ajuste
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <InventarioExistenciasFormField
          label="Existencia actual"
          value={String(existenciaActual)}
          compact
        />

        <InventarioExistenciasFormField
          label="Delta calculado"
          value={Number.isFinite(deltaCalculado) ? String(deltaCalculado) : "-"}
          compact
        />

        <InventarioExistenciasFormField
          label="Nueva existencia"
          value={
            Number.isFinite(nuevaExistenciaPreview)
              ? String(nuevaExistenciaPreview)
              : String(existenciaActual)
          }
          compact
        />
      </div>
    </div>
  );
}
