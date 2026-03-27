// src/modules/ventas/pages/ventas/form/VentasFormFacturacion.tsx
// Bloque de facturación de la venta.
// Responsabilidades:
// - Mostrar los campos fiscales solo cuando la venta se marca para facturar.
// - Mantener separada la captura rápida de la captura fiscal.
// - Reutilizarse tanto en CREAR como en VER.

import type { VentaFormState } from "./ventasForm.types";

type Props = {
  form: VentaFormState;
  readOnly: boolean;
};

export default function VentasFormFacturacion({ form, readOnly }: Props) {
  if (!form.mostrar_datos_factura && !readOnly) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 text-sm font-extrabold text-black/70">
        Datos de facturación
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Cliente fiscal</label>
          <input
            value={form.cliente_fiscal_label}
            disabled={true}
            placeholder="Seleccionar cliente fiscal"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
          {(readOnly || form.id_cliente_fiscal) && (
            <div className="text-[11px] font-semibold text-black/45">
              ID cliente fiscal: {form.id_cliente_fiscal ?? "-"}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">
            Forma de pago principal
          </label>
          <input
            value={form.forma_pago_principal_label}
            disabled={true}
            placeholder="Seleccionar forma de pago"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
          {(readOnly || form.id_forma_pago_principal) && (
            <div className="text-[11px] font-semibold text-black/45">
              ID forma de pago: {form.id_forma_pago_principal ?? "-"}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Método CFDI</label>
          <input
            value={form.metodo_cfdi_label}
            disabled={true}
            placeholder="Seleccionar método CFDI"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
          {(readOnly || form.id_metodo_pago_cfdi) && (
            <div className="text-[11px] font-semibold text-black/45">
              ID método CFDI: {form.id_metodo_pago_cfdi ?? "-"}
            </div>
          )}
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            Completa estos datos solo cuando la venta requiera factura.
          </div>
        </div>
      </div>
    </div>
  );
}
