// src/modules/inventario_existencias/pages/inventario_existencias/InventarioExistenciasForm.tsx

import type { InventarioExistenciasFormProps } from "./form/inventarioExistenciasForm.types";

import { useInventarioExistenciasForm } from "./form/useInventarioExistenciasForm";
import InventarioExistenciasFormInfo from "./form/InventarioExistenciasFormInfo";
import InventarioExistenciasFormCapture from "./form/InventarioExistenciasFormCapture";
import InventarioExistenciasFormSummary from "./form/InventarioExistenciasFormSummary";

export type { InventarioExistenciasFormModo } from "./form/inventarioExistenciasForm.types";

export default function InventarioExistenciasForm(
  props: InventarioExistenciasFormProps,
) {
  const vm = useInventarioExistenciasForm(props);

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">{vm.subtitulo}</div>

      {vm.esRegistroVirtual ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Este producto aún no tiene un registro real en esta ubicación. Al
          guardar el ajuste, se creará automáticamente con la nueva existencia.
        </div>
      ) : null}

      {vm.msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {vm.msgError}
        </div>
      ) : null}

      {vm.msgOk ? (
        <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {vm.msgOk}
        </div>
      ) : null}

      <InventarioExistenciasFormInfo item={props.initialExistencia} />

      {props.modo === "AJUSTE" ? (
        <>
          <InventarioExistenciasFormCapture
            form={vm.form}
            setForm={vm.setForm}
            existenciaActual={vm.existenciaActual}
          />

          <InventarioExistenciasFormSummary
            existenciaActual={vm.existenciaActual}
            deltaCalculado={vm.deltaCalculado}
            nuevaExistenciaPreview={vm.nuevaExistenciaPreview}
          />
        </>
      ) : null}

      {vm.readOnly ? (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={props.onCancel}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={props.onCancel}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void vm.guardar()}
            disabled={vm.saving}
            className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f] disabled:opacity-50"
          >
            {vm.saving ? "Guardando..." : "Guardar ajuste"}
          </button>
        </div>
      )}
    </div>
  );
}
