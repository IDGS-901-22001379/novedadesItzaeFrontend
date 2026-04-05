// src/modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/form/DevolucionesFormDetalle.tsx
// Bloque de detalle del formulario de Devoluciones/Cancelaciones.
// Responsabilidades:
// - Buscar producto con autocomplete.
// - Permitir selección con clic o teclado.
// - Capturar cantidad, precio e importe.

import type { KeyboardEvent } from "react";
import type { DevolucionProductoOption } from "../../../types/devoluciones_productos.types";
import type { FormState } from "./devolucionesForm.types";

type Props = {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  productoQuery: string;
  setProductoQuery: (value: string) => void;
  productosLoading: boolean;
  productosOptions: DevolucionProductoOption[];
  productoSeleccionado: DevolucionProductoOption | null;
  setProductoSeleccionado: (value: DevolucionProductoOption | null) => void;
  productoOpen: boolean;
  setProductoOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productoActiveIndex: number;
  setProductoActiveIndex: React.Dispatch<React.SetStateAction<number>>;
};

export default function DevolucionesFormDetalle({
  form,
  setForm,
  productoQuery,
  setProductoQuery,
  productosLoading,
  productosOptions,
  productoSeleccionado,
  setProductoSeleccionado,
  productoOpen,
  setProductoOpen,
  productoActiveIndex,
  setProductoActiveIndex,
}: Props) {
  function seleccionarProducto(item: DevolucionProductoOption) {
    setForm((p) => ({
      ...p,
      detalle: {
        ...p.detalle,
        id_producto: String(item.id_producto),
      },
    }));
    setProductoSeleccionado(item);
    setProductoQuery(item.label);
    setProductoOpen(false);
    setProductoActiveIndex(-1);
  }

  function limpiarProducto() {
    setForm((p) => ({
      ...p,
      detalle: {
        ...p.detalle,
        id_producto: "",
      },
    }));
    setProductoSeleccionado(null);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!productoOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (productosOptions.length > 0) {
        setProductoOpen(true);
        setProductoActiveIndex(0);
      }
      return;
    }

    if (!productoOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setProductoActiveIndex((prev) => {
        const next = prev + 1;
        return next >= productosOptions.length ? 0 : next;
      });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setProductoActiveIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? productosOptions.length - 1 : next;
      });
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (
        productoActiveIndex >= 0 &&
        productoActiveIndex < productosOptions.length
      ) {
        seleccionarProducto(productosOptions[productoActiveIndex]);
      }
    }

    if (e.key === "Escape") {
      setProductoOpen(false);
      setProductoActiveIndex(-1);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
      <div className="text-sm font-extrabold text-black/70">
        Detalle de devolución
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Producto</label>

          <div className="relative">
            <input
              value={productoQuery}
              onChange={(e) => {
                const value = e.target.value;
                setProductoQuery(value);
                setProductoOpen(true);
                setProductoActiveIndex(0);

                if (!value.trim()) {
                  limpiarProducto();
                }
              }}
              onFocus={() => {
                if (productosOptions.length > 0) {
                  setProductoOpen(true);
                }
              }}
              onKeyDown={onKeyDown}
              onBlur={() => {
                setTimeout(() => setProductoOpen(false), 150);
              }}
              placeholder="Buscar por nombre, modelo, código de barras o sku..."
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
            />

            {productoOpen &&
            (productosOptions.length > 0 || productosLoading) ? (
              <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-lg">
                {productosLoading ? (
                  <div className="px-3 py-2 text-sm font-semibold text-slate-500">
                    Buscando productos...
                  </div>
                ) : (
                  productosOptions.map((item, index) => {
                    const isActive = index === productoActiveIndex;

                    return (
                      <button
                        key={item.id_producto}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => seleccionarProducto(item)}
                        className={[
                          "block w-full px-3 py-2 text-left text-sm font-semibold",
                          isActive
                            ? "bg-[#E6F4EA] text-slate-900"
                            : "bg-white text-slate-900 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {item.label}
                      </button>
                    );
                  })
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Cantidad devuelta</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.detalle.cantidad_devuelta}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                detalle: {
                  ...p.detalle,
                  cantidad_devuelta: e.target.value,
                },
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Precio unitario</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.detalle.precio_unitario}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                detalle: {
                  ...p.detalle,
                  precio_unitario: e.target.value,
                },
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Importe</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.detalle.importe}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                detalle: {
                  ...p.detalle,
                  importe: e.target.value,
                },
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">
            Producto seleccionado
          </label>
          <input
            value={productoSeleccionado?.label ?? ""}
            disabled
            placeholder="Aún no has seleccionado un producto"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>
      </div>
    </div>
  );
}
