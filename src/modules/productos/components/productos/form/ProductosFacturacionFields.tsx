// src/modules/productos/components/productos/form/ProductosFacturacionFields.tsx
// Campos fiscales CFDI/SAT.
// Regla:
// - Si facturable = false -> campos se muestran pero NO obligan y quedan deshabilitados.
// - Si facturable = true  -> campos se habilitan (y el form valida que se llenen).

import type { ProductosFormState } from "../../../pages/productos/ProductosForm";

type Props = {
  readOnly: boolean;
  facturable: boolean;
  form: ProductosFormState;
  onChange: (patch: Partial<ProductosFormState>) => void;
};

export default function ProductosFacturacionFields({
  readOnly,
  facturable,
  form,
  onChange,
}: Props) {
  const disabled = readOnly || !facturable;

  return (
    <div className="space-y-3">
      {!facturable ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          Si el producto NO es facturable, estos campos no son obligatorios. Si
          activas <span className="font-extrabold">Facturable</span>, se
          habilitan y serán requeridos.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">
            Clave Prod/Serv SAT {facturable ? "*" : ""}
          </label>
          <input
            value={form.clave_prod_serv_sat}
            disabled={disabled}
            onChange={(e) => onChange({ clave_prod_serv_sat: e.target.value })}
            placeholder="Ej. 43211500"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">
            Clave Unidad SAT {facturable ? "*" : ""}
          </label>
          <input
            value={form.clave_unidad_sat}
            disabled={disabled}
            onChange={(e) => onChange({ clave_unidad_sat: e.target.value })}
            placeholder="Ej. H87"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">
            Unidad CFDI {facturable ? "*" : ""}
          </label>
          <input
            value={form.unidad_cfdi}
            disabled={disabled}
            onChange={(e) => onChange({ unidad_cfdi: e.target.value })}
            placeholder="Ej. Pieza"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">
            IVA (%) {facturable ? "*" : ""}
          </label>
          <input
            value={form.iva_tasa}
            disabled={disabled}
            onChange={(e) => onChange({ iva_tasa: e.target.value })}
            placeholder="Ej. 16"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
