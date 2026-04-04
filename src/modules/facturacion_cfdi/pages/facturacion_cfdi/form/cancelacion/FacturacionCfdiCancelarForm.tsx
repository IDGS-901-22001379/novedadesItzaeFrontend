// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/cancelacion/FacturacionCfdiCancelarForm.tsx
// Formulario de cancelación CFDI.
// Responsabilidades:
// - mostrar datos base de la factura a cancelar
// - permitir seleccionar motivo de cancelación
// - mostrar uuid de sustitución
// - ejecutar la cancelación usando el hook

import type { FacturacionCfdiCancelarFormProps } from "./facturacionCfdiCancelarForm.types";
import { useFacturacionCfdiCancelarForm } from "./useFacturacionCfdiCancelarForm";

export default function FacturacionCfdiCancelarForm({
  factura,
  onSuccess,
  onCancel,
}: FacturacionCfdiCancelarFormProps) {
  const {
    form,
    setForm,
    saving,
    loadingCatalogos,
    msgError,
    msgInfo,
    motivosCancelacion,
    subtitulo,
    guardar,
  } = useFacturacionCfdiCancelarForm({
    factura,
    onSuccess,
  });

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

      {msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {msgError}
        </div>
      ) : null}

      {msgInfo ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          {msgInfo}
        </div>
      ) : null}

      {loadingCatalogos ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          Cargando motivos de cancelación...
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Factura</label>
          <input
            value={`${factura?.serie ?? ""}${factura?.folio ?? ""}`}
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">ID factura</label>
          <input
            value={form.id_factura}
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">
            Motivo de cancelación
          </label>
          <select
            value={form.id_motivo_cancelacion_cfdi}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                id_motivo_cancelacion_cfdi: e.target.value,
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          >
            <option value="">Selecciona un motivo</option>
            {motivosCancelacion.map((motivo) => (
              <option
                key={motivo.id_motivo_cancelacion_cfdi}
                value={String(motivo.id_motivo_cancelacion_cfdi)}
              >
                {motivo.codigo} - {motivo.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">UUID sustitución</label>
          <input
            value={form.uuid_sustitucion}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                uuid_sustitucion: e.target.value,
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
            placeholder="UUID de sustitución"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Usuario</label>
          <input
            value={form.id_usuario}
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">UUID actual</label>
          <input
            value={factura?.uuid ?? ""}
            disabled
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={() => void guardar()}
          disabled={saving}
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-red-600 disabled:opacity-50"
        >
          {saving ? "Cancelando..." : "Confirmar cancelación"}
        </button>
      </div>
    </div>
  );
}
