// src/modules/productos/components/productos/form/ProductosBasicFields.tsx
// Campos generales del producto (SKU, nombre, modelo, descripción, código barras).

import type { ProductosFormState } from "../../../pages/productos/form/productosForm.types";

type Props = {
  readOnly: boolean;
  form: ProductosFormState;
  onChange: (patch: Partial<ProductosFormState>) => void;
};

export default function ProductosBasicFields({
  readOnly,
  form,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">SKU *</label>
        <input
          value={form.sku}
          disabled={readOnly}
          onChange={(e) => onChange({ sku: e.target.value })}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Código de barras</label>
        <input
          value={form.codigo_barras}
          disabled={readOnly}
          onChange={(e) => onChange({ codigo_barras: e.target.value })}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Nombre *</label>
        <input
          value={form.nombre}
          disabled={readOnly}
          onChange={(e) => onChange({ nombre: e.target.value })}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Modelo</label>
        <input
          value={form.modelo}
          disabled={readOnly}
          onChange={(e) => onChange({ modelo: e.target.value })}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Descripción</label>
        <textarea
          value={form.descripcion}
          disabled={readOnly}
          onChange={(e) => onChange({ descripcion: e.target.value })}
          rows={3}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        />
      </div>
    </div>
  );
}
