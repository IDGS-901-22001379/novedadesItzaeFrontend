// src/modules/ventas/pages/ventas/form/ventasFromdetalle/VentasFormDetallePreciosModal.tsx

import type { VentaProductoOption } from "../../../../types";
import { formatMoney } from "./ventasFormDetalle.helpers";

type Props = {
  open: boolean;
  producto: VentaProductoOption | null;
  onClose: () => void;
};

export default function VentasFormDetallePreciosModal({
  open,
  producto,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-3 text-base font-extrabold text-black/80">
          Precios del producto
        </div>

        {producto ? (
          <div className="space-y-2 text-sm font-semibold text-black/70">
            <div className="flex items-center justify-between gap-4">
              <span>Público general</span>
              <span>{formatMoney(producto.precio_venta ?? 0)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Mayoreo</span>
              <span>{formatMoney(producto.precio_mayoreo ?? 0)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Especial</span>
              <span>{formatMoney(producto.precio_especial ?? 0)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Descuento</span>
              <span>{formatMoney(producto.precio_descuento ?? 0)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Caja</span>
              <span>
                {producto.precio_caja != null
                  ? formatMoney(producto.precio_caja)
                  : "Se calcula"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-sm font-semibold text-slate-500">
            No hay información de precios disponible.
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-black px-4 py-2 text-sm font-extrabold text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
