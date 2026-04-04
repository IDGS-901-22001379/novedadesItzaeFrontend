// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/FacturacionCfdiFormEnviar.tsx
// Bloque visual del modo ENVIAR.
// Responsabilidades: capturar correo destino y mostrar resumen de la factura.

import type { Factura } from "../../../types/facturacion_cfdi.types";
import type { FacturacionCfdiFormState } from "./facturacionCfdiForm.types";

type Props = {
  initialFactura: Factura | null;
  form: FacturacionCfdiFormState;
  setForm: React.Dispatch<React.SetStateAction<FacturacionCfdiFormState>>;
};

export default function FacturacionCfdiFormEnviar({
  initialFactura,
  form,
  setForm,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs font-extrabold text-black/50">Factura</div>
            <div className="text-sm font-semibold text-black/80">
              {initialFactura?.serie ?? ""}
              {initialFactura?.folio ?? ""}
            </div>
          </div>

          <div>
            <div className="text-xs font-extrabold text-black/50">UUID</div>
            <div className="break-all text-sm font-semibold text-black/80">
              {initialFactura?.uuid ?? "Sin UUID"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Correo destino</label>
        <input
          value={form.correo_destino}
          onChange={(e) =>
            setForm((p) => ({ ...p, correo_destino: e.target.value }))
          }
          placeholder="correo@ejemplo.com"
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
        />
      </div>
    </div>
  );
}
