// src/modules/facturacion_cfdi/pages/facturacion_cfdi/Facturacion_cfdiForm.tsx
// Formulario principal de facturación CFDI.
// Responsabilidades:
// - conectar el hook del formulario
// - delegar el render por modo a componentes especializados
// - renderizar mensajes y acciones finales

import type { FacturacionCfdiFormProps } from "./form/facturacionCfdiForm.types";
import { useFacturacionCfdiForm } from "./form/useFacturacionCfdiForm";
import FacturacionCfdiFormEmitir from "./form/FacturacionCfdiFormEmitir";
import FacturacionCfdiFormEnviar from "./form/FacturacionCfdiFormEnviar";
import FacturacionCfdiFormVer from "./form/FacturacionCfdiFormVer";

export default function Facturacion_cfdiForm({
  modo,
  initialFactura,
  onSuccess,
  onCancel,
}: FacturacionCfdiFormProps) {
  const {
    form,
    setForm,
    saving,
    msgError,
    msgInfo,
    clientesFiscales,
    sucursales,
    series,
    loadingCatalogos,
    subtitulo,
    guardar,
  } = useFacturacionCfdiForm({
    modo,
    initialFactura,
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

      {modo === "EMITIR" ? (
        <FacturacionCfdiFormEmitir
          form={form}
          setForm={setForm}
          clientesFiscales={clientesFiscales}
          sucursales={sucursales}
          series={series}
          loadingCatalogos={loadingCatalogos}
        />
      ) : null}

      {modo === "ENVIAR" ? (
        <FacturacionCfdiFormEnviar
          initialFactura={initialFactura}
          form={form}
          setForm={setForm}
        />
      ) : null}

      {modo === "VER" ? (
        <FacturacionCfdiFormVer initialFactura={initialFactura} />
      ) : null}

      {modo !== "VER" ? (
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
            className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f] disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : modo === "EMITIR"
                ? "Emitir factura"
                : "Enviar factura"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
