// src/modules/productos/components/productos/form/ProductosInventarioFields.tsx
// Campos de inventario y configuración de venta por caja.
//
// NUEVO (UI de stock con colores):
// - Recibe un "stockActual" (número) desde el padre (list / form / modal).
// - Usa form.stock_minimo_tienda (mínimo) para calcular estado visual:
//   - stock === 0  -> rojo (crítico)
//   - stock <= min -> amarillo (bajo / en mínimo)
//   - stock > min  -> verde (ok)
//
// Importante:
// - Este componente NO calcula el stock desde backend. Solo lo muestra.
// - La obtención del stock (por sucursal) se hace en el listado (ProductosList)
//   usando el endpoint /inventario/existencias/resumen.
// - Aquí solo pintamos el indicador y lo mostramos junto al input.

import type { UnidadMedida } from "../../../types/productos.types";
import type { ProductosFormState } from "../../../pages/productos/form/productosForm.types";

type Props = {
  readOnly: boolean;
  form: ProductosFormState;
  unidades: UnidadMedida[];
  onChange: (patch: Partial<ProductosFormState>) => void;

  // NUEVO: stock actual para pintar semáforo (opcional)
  // Si no lo mandas, se mostrará "-" y sin color fuerte.
  stockActual?: number | null;
};

function parseMinStock(v: string): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  // mínimo no debería ser negativo (pero si viene, lo tratamos como 0)
  return Math.max(0, Math.trunc(n));
}

function getStockVariant(stock: number | null | undefined, min: number) {
  if (stock === null || stock === undefined) {
    return {
      label: "Stock: -",
      pill: "border-black/10 bg-white text-black/60",
      dot: "bg-black/30",
      hint: "Sin datos de stock (selecciona sucursal o carga existencias).",
    };
  }

  if (stock === 0) {
    return {
      label: `Stock: ${stock}`,
      pill: "border-red-200 bg-red-50 text-red-800",
      dot: "bg-red-500",
      hint: "Sin existencia (0).",
    };
  }

  if (stock <= min) {
    return {
      label: `Stock: ${stock}`,
      pill: "border-yellow-200 bg-yellow-50 text-yellow-900",
      dot: "bg-yellow-400",
      hint: `En mínimo / bajo (mínimo: ${min}).`,
    };
  }

  return {
    label: `Stock: ${stock}`,
    pill: "border-green-200 bg-green-50 text-green-800",
    dot: "bg-green-500",
    hint: `OK (mínimo: ${min}).`,
  };
}

export default function ProductosInventarioFields({
  readOnly,
  form,
  unidades,
  onChange,
  stockActual = null,
}: Props) {
  const min = parseMinStock(form.stock_minimo_tienda);
  const badge = getStockVariant(stockActual, min);

  return (
    <div className="space-y-4">
      {/* Inventario mínimo / notas */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Stock mínimo + indicador */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-extrabold">
              Stock mínimo tienda *
            </label>

            {/* Indicador de stock (semáforo) */}
            <div
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold",
                badge.pill,
              ].join(" ")}
              title={badge.hint}
            >
              <span
                className={["h-2.5 w-2.5 rounded-full", badge.dot].join(" ")}
              />
              {badge.label}
            </div>
          </div>

          <input
            value={form.stock_minimo_tienda}
            disabled={readOnly}
            onChange={(e) => onChange({ stock_minimo_tienda: e.target.value })}
            inputMode="numeric"
            placeholder="Ej. 10"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />

          <div className="text-[11px] font-semibold text-black/50">
            Reglas: <span className="font-extrabold">0</span> = rojo ·{" "}
            <span className="font-extrabold">≤ mínimo</span> = amarillo ·{" "}
            <span className="font-extrabold">&gt; mínimo</span> = verde
          </div>
        </div>

        {/* Notas internas */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Notas internas</label>
          <textarea
            value={form.notas_internas}
            disabled={readOnly}
            onChange={(e) => onChange({ notas_internas: e.target.value })}
            rows={3}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>
      </div>

      {/* Venta por caja */}
      <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-extrabold text-black/70">
            Venta por caja
          </div>

          <label className="flex items-center gap-2 text-sm font-extrabold text-black/70">
            <input
              type="checkbox"
              checked={form.permite_venta_por_caja}
              disabled={readOnly}
              onChange={(e) =>
                onChange({
                  permite_venta_por_caja: e.target.checked,
                  // si se apaga, limpiamos datos para evitar basura
                  ...(e.target.checked
                    ? {}
                    : { unidades_por_caja: "", id_unidad_medida_caja: 0 }),
                })
              }
              className="h-4 w-4"
            />
            Permite venta por caja
          </label>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold">Unidades por caja</label>
            <input
              value={form.unidades_por_caja}
              disabled={readOnly || !form.permite_venta_por_caja}
              onChange={(e) => onChange({ unidades_por_caja: e.target.value })}
              placeholder="Ej. 20"
              inputMode="numeric"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold">Unidad de caja</label>
            <select
              value={String(form.id_unidad_medida_caja)}
              disabled={readOnly || !form.permite_venta_por_caja}
              onChange={(e) =>
                onChange({ id_unidad_medida_caja: Number(e.target.value) })
              }
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
            >
              <option value="0">Selecciona...</option>
              {unidades.map((u) => (
                <option
                  key={u.id_unidad_medida}
                  value={String(u.id_unidad_medida)}
                >
                  {u.nombre} ({u.abreviatura})
                </option>
              ))}
            </select>
          </div>
        </div>

        {!form.permite_venta_por_caja ? (
          <div className="mt-2 text-xs font-semibold text-black/50">
            Si activas “Permite venta por caja”, debes registrar unidades por
            caja y unidad de caja.
          </div>
        ) : null}
      </div>
    </div>
  );
}
