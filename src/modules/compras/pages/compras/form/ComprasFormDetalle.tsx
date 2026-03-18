// src/modules/compras/pages/compras/form/ComprasFormDetalle.tsx

import { useMemo, useState } from "react";
import type { DetalleFormRow, ProductoBusquedaItem } from "./comprasForm.types";

type Props = {
  readOnly: boolean;
  detalles: DetalleFormRow[];

  updateDetalle: (rowId: string, patch: Partial<DetalleFormRow>) => void;
  agregarRenglon: () => void;
  eliminarRenglon: (rowId: string) => void;

  productoQuery: string;
  setProductoQuery: React.Dispatch<React.SetStateAction<string>>;
  productosEncontrados: ProductoBusquedaItem[];
  loadingProductos: boolean;
  onSelectProducto: (producto: ProductoBusquedaItem) => void;

  actualizarCantidad: (rowId: string, cantidad: number | "") => void;
  actualizarCosto: (rowId: string, costo_unitario: number | "") => void;
  actualizarDescuento: (rowId: string, descuento: number | "") => void;
  actualizarImpuestos: (rowId: string, impuestos: number | "") => void;
};

export default function ComprasFormDetalle({
  readOnly,
  detalles,
  eliminarRenglon,

  productoQuery,
  setProductoQuery,
  productosEncontrados,
  loadingProductos,
  onSelectProducto,

  actualizarCantidad,
  actualizarCosto,
  actualizarDescuento,
  actualizarImpuestos,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const showDropdown = useMemo(() => {
    return !readOnly && productoQuery.trim().length > 0;
  }, [productoQuery, readOnly]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) return;
    if (!productosEncontrados.length) return;

    const maxIndex = productosEncontrados.length - 1;
    const currentIndex = Math.min(activeIndex, maxIndex);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const producto = productosEncontrados[currentIndex];
      if (producto) {
        onSelectProducto(producto);
        setActiveIndex(0);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setProductoQuery("");
      setActiveIndex(0);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-extrabold text-black/70">
          Detalle de productos
        </div>
      </div>

      {!readOnly ? (
        <div className="relative mb-4">
          <label className="mb-1 block text-xs font-extrabold">
            Buscar producto
          </label>

          <input
            value={productoQuery}
            onChange={(e) => {
              setProductoQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por nombre, modelo o código de barras..."
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          />

          {showDropdown ? (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
              {loadingProductos ? (
                <div className="px-3 py-3 text-sm font-semibold text-slate-600">
                  Buscando productos...
                </div>
              ) : productosEncontrados.length > 0 ? (
                <div className="max-h-72 overflow-y-auto">
                  {productosEncontrados.map((producto, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={producto.id_producto}
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => {
                          onSelectProducto(producto);
                          setActiveIndex(0);
                        }}
                        className={[
                          "block w-full border-b border-black/5 px-3 py-3 text-left text-sm last:border-b-0",
                          isActive ? "bg-slate-100" : "hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div className="font-extrabold text-slate-800">
                          {producto.nombre}
                        </div>

                        <div className="mt-1 text-xs font-semibold text-slate-500">
                          {producto.modelo
                            ? `Modelo: ${producto.modelo}`
                            : "Sin modelo"}
                          {" · "}
                          {producto.codigo_barras
                            ? `Código: ${producto.codigo_barras}`
                            : "Sin código de barras"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-3 py-3 text-sm font-semibold text-slate-500">
                  No se encontraron productos.
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black/5 text-xs font-extrabold text-black/70">
            <tr>
              <th className="w-[36%] px-3 py-3">Producto</th>
              <th className="w-[10%] px-2 py-3 text-right">Cantidad</th>
              <th className="w-[12%] px-2 py-3 text-right">Costo unitario</th>
              <th className="w-[10%] px-2 py-3 text-right">Descuento</th>
              <th className="w-[10%] px-2 py-3 text-right">Impuestos</th>
              <th className="w-[12%] px-2 py-3 text-right">Importe</th>
              {!readOnly ? (
                <th className="w-[10%] px-2 py-3 text-right">Acciones</th>
              ) : null}
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5">
            {detalles.map((row) => (
              <tr key={row.id} className="bg-white">
                <td className="px-3 py-3">
                  <input
                    value={row.producto_label}
                    disabled
                    placeholder="Selecciona un producto desde la búsqueda"
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
                  />
                </td>

                <td className="px-2 py-3">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={row.cantidad}
                    onChange={(e) =>
                      actualizarCantidad(
                        row.id,
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    disabled={readOnly}
                    className="w-full rounded-xl border border-black/10 bg-white px-2 py-2 text-center text-sm font-semibold disabled:opacity-90"
                  />
                </td>

                <td className="px-2 py-3">
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={row.costo_unitario}
                    onChange={(e) =>
                      actualizarCosto(
                        row.id,
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    disabled={readOnly}
                    className="w-full rounded-xl border border-black/10 bg-white px-2 py-2 text-center text-sm font-semibold disabled:opacity-90"
                  />
                </td>

                <td className="px-2 py-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.descuento}
                    onChange={(e) =>
                      actualizarDescuento(
                        row.id,
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    disabled={readOnly}
                    className="w-full rounded-xl border border-black/10 bg-white px-2 py-2 text-center text-sm font-semibold disabled:opacity-90"
                  />
                </td>

                <td className="px-2 py-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.impuestos}
                    onChange={(e) =>
                      actualizarImpuestos(
                        row.id,
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    disabled={readOnly}
                    className="w-full rounded-xl border border-black/10 bg-white px-2 py-2 text-center text-sm font-semibold disabled:opacity-90"
                  />
                </td>

                <td className="px-2 py-3">
                  <input
                    value={
                      row.importe === "" ? "" : Number(row.importe).toFixed(2)
                    }
                    disabled
                    className="w-full rounded-xl border border-black/10 bg-black/5 px-2 py-2 text-center text-sm font-extrabold"
                  />
                </td>

                {!readOnly ? (
                  <td className="px-2 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => eliminarRenglon(row.id)}
                      disabled={detalles.length <= 1}
                      className="rounded-xl bg-[#ff3131] px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#e32828] disabled:opacity-50"
                    >
                      Quitar
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}

            {detalles.length === 0 ? (
              <tr>
                <td
                  colSpan={readOnly ? 6 : 7}
                  className="px-3 py-6 text-center text-sm font-semibold text-slate-500"
                >
                  Aún no hay productos agregados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
