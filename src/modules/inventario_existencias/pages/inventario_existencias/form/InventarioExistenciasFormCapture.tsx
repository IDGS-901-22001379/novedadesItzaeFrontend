// src/modules/inventario_existencias/pages/inventario_existencias/form/InventarioExistenciasFormCapture.tsx

import type { FormSetter, FormState } from "./inventarioExistenciasForm.types";

type Props = {
  form: FormState;
  setForm: FormSetter;
  existenciaActual: number;
};

export default function InventarioExistenciasFormCapture({
  form,
  setForm,
  existenciaActual,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Tipo</label>
        <select
          value={form.tipo}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              tipo: e.target.value as FormState["tipo"],
            }))
          }
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
        >
          <option value="AJUSTE">AJUSTE</option>
          <option value="MERMA">MERMA</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Forma de captura</label>
        <select
          value={form.modo_captura}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              modo_captura: e.target.value as FormState["modo_captura"],
              cantidad_movimiento:
                e.target.value === "MOVIMIENTO" ? p.cantidad_movimiento : "",
              nueva_existencia:
                e.target.value === "CAMBIO_FINAL"
                  ? p.nueva_existencia || String(existenciaActual)
                  : p.nueva_existencia,
            }))
          }
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
        >
          <option value="CAMBIO_FINAL">Capturar nueva existencia</option>
          <option value="MOVIMIENTO">Capturar movimiento</option>
        </select>
      </div>

      {form.modo_captura === "CAMBIO_FINAL" ? (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Nueva existencia</label>
          <input
            value={form.nueva_existencia}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                nueva_existencia: e.target.value,
              }))
            }
            placeholder="Ej. 100"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">
            Cantidad del movimiento
          </label>
          <input
            value={form.cantidad_movimiento}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                cantidad_movimiento: e.target.value,
              }))
            }
            placeholder="Ej. 5"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          />
        </div>
      )}

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Motivo</label>
        <input
          value={form.motivo}
          onChange={(e) => setForm((p) => ({ ...p, motivo: e.target.value }))}
          placeholder="Describe el motivo del ajuste..."
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">
          Referencia tipo (opcional)
        </label>
        <input
          value={form.referencia_tipo}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              referencia_tipo: e.target.value,
            }))
          }
          placeholder="Ej. INVENTARIO, REVISIÓN..."
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">
          Referencia ID (opcional)
        </label>
        <input
          value={form.referencia_id}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              referencia_id: e.target.value,
            }))
          }
          placeholder="Ej. 1001"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
        />
      </div>
    </div>
  );
}
