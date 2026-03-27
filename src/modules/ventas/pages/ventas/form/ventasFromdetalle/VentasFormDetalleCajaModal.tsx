// src/modules/ventas/pages/ventas/form/ventasFromdetalle/VentasFormDetalleCajaModal.tsx

import type { VentaProductoOption } from "../../../../types";
import { formatMoney } from "./ventasFormDetalle.helpers";

type Props = {
  open: boolean;
  producto: VentaProductoOption | null;
  onClose: () => void;
};

export default function VentasFormDetalleCajaModal({
  open,
  producto,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-3 text-base font-extrabold text-black/80">
          Información de caja
        </div>

        {producto ? (
          <div className="space-y-2 text-sm font-semibold text-black/70">
            <div>
              <span className="font-extrabold">Producto:</span>{" "}
              {producto.nombre}
            </div>
            <div>
              <span className="font-extrabold">Unidades por caja:</span>{" "}
              {producto.unidades_por_caja ?? 1}
            </div>
            <div>
              <span className="font-extrabold">Precio caja:</span>{" "}
              {producto.precio_caja != null
                ? formatMoney(producto.precio_caja)
                : "Se calcula automáticamente"}
            </div>
          </div>
        ) : (
          <div className="text-sm font-semibold text-slate-500">
            No hay información disponible para este producto.
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
