// src/modules/traspasos/pages/traspasos/form/TraspasosFormFields.tsx

import type { FormState, UbicacionOption } from "./traspasosForm.types";

type Props = {
  readOnly: boolean;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  ubicaciones: UbicacionOption[];
  ubicacionLabelById: Map<number, string>;
};

export default function TraspasosFormFields({
  readOnly,
  form,
  setForm,
  ubicaciones,
  ubicacionLabelById,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Ubicación origen</label>

        {readOnly ? (
          <input
            value={
              ubicacionLabelById.get(form.id_ubicacion_origen) ||
              (form.id_ubicacion_origen > 0
                ? `Ubicación #${form.id_ubicacion_origen}`
                : "")
            }
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        ) : (
          <select
            value={String(form.id_ubicacion_origen)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                id_ubicacion_origen: Number(e.target.value),
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          >
            <option value="0">Selecciona una ubicación</option>
            {ubicaciones.map((ubicacion) => (
              <option key={ubicacion.id} value={String(ubicacion.id)}>
                {ubicacion.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Ubicación destino</label>

        {readOnly ? (
          <input
            value={
              ubicacionLabelById.get(form.id_ubicacion_destino) ||
              (form.id_ubicacion_destino > 0
                ? `Ubicación #${form.id_ubicacion_destino}`
                : "")
            }
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        ) : (
          <select
            value={String(form.id_ubicacion_destino)}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                id_ubicacion_destino: Number(e.target.value),
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          >
            <option value="0">Selecciona una ubicación</option>
            {ubicaciones.map((ubicacion) => (
              <option key={ubicacion.id} value={String(ubicacion.id)}>
                {ubicacion.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Notas</label>
        <textarea
          value={form.notas}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, notas: e.target.value }))
          }
          disabled={readOnly}
          rows={3}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          placeholder="Notas del traspaso..."
        />
      </div>
    </div>
  );
}
