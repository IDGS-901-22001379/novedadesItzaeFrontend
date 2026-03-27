// src/modules/ventas/pages/ventas/form/ventasFromdetalle/VentasFormDetalleBuscadorModal.tsx

import { X } from "lucide-react";
import type { VentaProductoOption } from "../../../../types";
import { formatMoney } from "./ventasFormDetalle.helpers";

type Props = {
  open: boolean;
  productoQuery: string;
  setProductoQuery: React.Dispatch<React.SetStateAction<string>>;
  productosPaginados: VentaProductoOption[];
  loadingProductos: boolean;
  paginaModal: number;
  totalPaginasModal: number;
  onSelectProducto: (producto: VentaProductoOption) => void;
  onClose: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  modalSearchInputRef: React.RefObject<HTMLInputElement | null>;
};

export default function VentasFormDetalleBuscadorModal({
  open,
  productoQuery,
  setProductoQuery,
  productosPaginados,
  loadingProductos,
  paginaModal,
  totalPaginasModal,
  onSelectProducto,
  onClose,
  onPrevPage,
  onNextPage,
  modalSearchInputRef,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div className="text-base font-extrabold text-black/80">
            Buscar productos
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-white text-black/70 hover:bg-slate-50"
          >
            <X size={17} />
          </button>
        </div>

        <div className="border-b border-black/10 px-5 py-4">
          <label className="mb-1 block text-xs font-extrabold">
            Buscar producto
          </label>
          <input
            ref={modalSearchInputRef}
            value={productoQuery}
            onChange={(e) => {
              setProductoQuery(e.target.value);
            }}
            placeholder="Buscar por nombre, modelo, SKU o código de barras..."
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loadingProductos ? (
            <div className="text-sm font-semibold text-slate-600">
              Buscando productos...
            </div>
          ) : productosPaginados.length > 0 ? (
            <div className="space-y-3">
              {productosPaginados.map((producto) => (
                <button
                  key={producto.id_producto}
                  type="button"
                  onClick={() => {
                    onSelectProducto(producto);
                    onClose();
                    setProductoQuery("");
                  }}
                  className="block w-full rounded-2xl border border-black/10 bg-white px-4 py-4 text-left transition hover:bg-slate-50"
                >
                  <div className="text-sm font-extrabold text-slate-800">
                    {producto.nombre}
                  </div>

                  <div className="mt-2 grid grid-cols-1 gap-2 text-xs font-semibold text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                    <div>Modelo: {producto.modelo ?? "-"}</div>
                    <div>Código: {producto.codigo_barras ?? "-"}</div>
                    <div>SKU: {producto.sku ?? "-"}</div>
                    <div>Unidades caja: {producto.unidades_por_caja ?? 1}</div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs font-bold text-black/65 md:grid-cols-2 xl:grid-cols-5">
                    <div>
                      Público: {formatMoney(producto.precio_venta ?? 0)}
                    </div>
                    <div>
                      Mayoreo: {formatMoney(producto.precio_mayoreo ?? 0)}
                    </div>
                    <div>
                      Especial: {formatMoney(producto.precio_especial ?? 0)}
                    </div>
                    <div>
                      Descuento: {formatMoney(producto.precio_descuento ?? 0)}
                    </div>
                    <div>
                      Caja:{" "}
                      {producto.precio_caja != null
                        ? formatMoney(producto.precio_caja)
                        : "Se calcula"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-sm font-semibold text-slate-500">
              No se encontraron productos.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-black/10 px-5 py-4">
          <div className="text-sm font-semibold text-slate-500">
            Página {paginaModal} de {totalPaginasModal}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevPage}
              disabled={paginaModal <= 1}
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-slate-50 disabled:opacity-50"
            >
              Anterior
            </button>

            <button
              type="button"
              onClick={onNextPage}
              disabled={paginaModal >= totalPaginasModal}
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-slate-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
