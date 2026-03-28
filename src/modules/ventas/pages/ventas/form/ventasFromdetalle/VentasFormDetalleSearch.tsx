// src/modules/ventas/pages/ventas/form/ventasFromdetalle/VentasFormDetalleSearch.tsx

import type { VentaProductoOption } from "../../../../types";
import { formatMoney } from "./ventasFormDetalle.helpers";

type Props = {
  readOnly: boolean;
  productoQuery: string;
  setProductoQuery: React.Dispatch<React.SetStateAction<string>>;
  productosEncontrados: VentaProductoOption[];
  loadingProductos: boolean;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  onSelectProducto: (producto: VentaProductoOption) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  modalBuscadorOpen: boolean;
  setPaginaModal: React.Dispatch<React.SetStateAction<number>>;
};

export default function VentasFormDetalleSearch({
  readOnly,
  productoQuery,
  setProductoQuery,
  productosEncontrados,
  loadingProductos,
  activeIndex,
  setActiveIndex,
  onSelectProducto,
  onKeyDown,
  searchInputRef,
  modalBuscadorOpen,
  setPaginaModal,
}: Props) {
  const showDropdown =
    !readOnly && productoQuery.trim().length > 0 && !modalBuscadorOpen;

  if (readOnly) return null;

  return (
    <div className="relative mb-4 w-full max-w-sm">
      <label className="mb-1 block text-xs font-extrabold">
        Buscar producto
      </label>

      <input
        ref={searchInputRef}
        value={productoQuery}
        onChange={(e) => {
          setProductoQuery(e.target.value);
          setActiveIndex(0);
          setPaginaModal(1);
        }}
        onKeyDown={onKeyDown}
        placeholder="Buscar por nombre, modelo, SKU o código..."
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
                      setProductoQuery("");
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
                        : "Sin código"}
                      {" · "}
                      {producto.sku ? `SKU: ${producto.sku}` : "Sin SKU"}
                    </div>

                    <div className="mt-1 text-[11px] font-bold text-black/60">
                      Público general: {formatMoney(producto.precio_venta ?? 0)}
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
  );
}
