// src/modules/productos/components/productos/form/ProductosCatalogFields.tsx
// Campos de clasificación y catálogos (tipo, categoría, marca, unidad principal, estatus).

import type {
  ProductoTipo,
  ProductoCategoria,
  ProductoMarca,
  UnidadMedida,
  ProductoEstatus,
} from "../../../types/productos.types";
import type { ProductosFormState } from "../../../pages/productos/ProductosForm";

type Props = {
  readOnly: boolean;
  form: ProductosFormState;

  tipos: ProductoTipo[];
  categorias: ProductoCategoria[];
  marcas: ProductoMarca[];
  unidades: UnidadMedida[];

  onChange: (patch: Partial<ProductosFormState>) => void;
};

export default function ProductosCatalogFields({
  readOnly,
  form,
  tipos,
  categorias,
  marcas,
  unidades,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Tipo *</label>
        <select
          value={String(form.id_producto_tipo)}
          disabled={readOnly}
          onChange={(e) =>
            onChange({ id_producto_tipo: Number(e.target.value) })
          }
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="0">Selecciona...</option>
          {tipos.map((t) => (
            <option key={t.id_producto_tipo} value={String(t.id_producto_tipo)}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Categoría *</label>
        <select
          value={String(form.id_categoria)}
          disabled={readOnly}
          onChange={(e) => onChange({ id_categoria: Number(e.target.value) })}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="0">Selecciona...</option>
          {categorias.map((c) => (
            <option key={c.id_categoria} value={String(c.id_categoria)}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Marca *</label>
        <select
          value={String(form.id_marca)}
          disabled={readOnly}
          onChange={(e) => onChange({ id_marca: Number(e.target.value) })}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="0">Selecciona...</option>
          {marcas.map((m) => (
            <option key={m.id_marca} value={String(m.id_marca)}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Unidad principal *</label>
        <select
          value={String(form.id_unidad_medida_principal)}
          disabled={readOnly}
          onChange={(e) =>
            onChange({ id_unidad_medida_principal: Number(e.target.value) })
          }
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="0">Selecciona...</option>
          {unidades.map((u) => (
            <option key={u.id_unidad_medida} value={String(u.id_unidad_medida)}>
              {u.nombre} ({u.abreviatura})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Estatus</label>
        <select
          value={form.estatus}
          disabled={readOnly}
          onChange={(e) =>
            onChange({ estatus: e.target.value as ProductoEstatus })
          }
          className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
        >
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
        </select>
      </div>
    </div>
  );
}
