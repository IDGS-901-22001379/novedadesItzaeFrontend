// src/modules/traspasos/pages/traspasos/form/TraspasosFormItemsSection.tsx

import type { FormState, ProductoOption } from "./traspasosForm.types";
import ProductoAutocomplete from "../../../components/traspasos/ProductoAutocomplete";

type Props = {
  readOnly: boolean;
  form: FormState;
  productos: ProductoOption[];
  productoLabelById: Map<number, string>;
  setItem: (index: number, patch: Partial<FormState["items"][number]>) => void;
  agregarItem: () => void;
  eliminarItem: (index: number) => void;
};

export default function TraspasosFormItemsSection({
  readOnly,
  form,
  productos,
  productoLabelById,
  setItem,
  agregarItem,
  eliminarItem,
}: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-extrabold text-black/70">
          Productos del traspaso
        </div>

        {!readOnly ? (
          <button
            type="button"
            onClick={agregarItem}
            className="rounded-xl bg-[#34f334] px-3 py-2 text-xs font-extrabold text-[#0b2b0b] hover:bg-[#2fe72f]"
          >
            Agregar producto
          </button>
        ) : null}
      </div>

      {/* Scroll de la lista: aprox. 3 productos visibles */}
      <div className="mt-3 max-h-75 overflow-y-auto pr-1">
        <div className="space-y-3">
          {form.items.map((item, index) => (
            <div
              key={`${index}-${item.id_producto}`}
              className="grid grid-cols-1 gap-3 rounded-2xl border border-black/10 bg-black/2 p-3 md:grid-cols-12 md:items-end"
            >
              <div className="flex flex-col gap-1 md:col-span-8">
                <label className="text-xs font-extrabold">Producto</label>

                {readOnly ? (
                  <input
                    value={
                      productoLabelById.get(item.id_producto) ||
                      (item.id_producto > 0
                        ? `Producto #${item.id_producto}`
                        : "")
                    }
                    disabled
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
                  />
                ) : (
                  <ProductoAutocomplete
                    valueId={item.id_producto}
                    productos={productos}
                    onPick={(producto) =>
                      setItem(index, {
                        id_producto: producto.id,
                      })
                    }
                  />
                )}
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-xs font-extrabold">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={item.cantidad}
                  onChange={(e) => setItem(index, { cantidad: e.target.value })}
                  disabled={readOnly}
                  className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
                />
              </div>

              <div className="md:col-span-2">
                {!readOnly ? (
                  <button
                    type="button"
                    onClick={() => eliminarItem(index)}
                    disabled={form.items.length <= 1}
                    className="w-full rounded-xl bg-red-500 px-3 py-2 text-sm font-extrabold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    Quitar
                  </button>
                ) : null}
              </div>
            </div>
          ))}

          {form.items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/10 px-4 py-4 text-sm font-semibold text-black/60">
              No hay productos en este traspaso.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
