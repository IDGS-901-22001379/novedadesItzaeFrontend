// src/modules/ventas/pages/ventas/form/cobro/CobroProductosTable.tsx

import type { VentaDetalleForm } from "../ventasForm.types";
import {
  calcDetalleImpuesto,
  calcDetalleTotal,
  formatMoney,
} from "./cobro.utils";

type Props = {
  detalles: VentaDetalleForm[];
};

export default function CobroProductosTable({ detalles }: Props) {
  return (
    <div className="min-h-0 rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 text-sm font-extrabold text-black/70">
        Productos de la venta
      </div>

      <div className="max-h-[60vh] overflow-auto rounded-2xl border border-black/10">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-[#f8f8f8]">
            <tr className="border-b border-black/10 text-left">
              <th className="px-3 py-2 text-xs font-extrabold text-black/60">
                Producto
              </th>
              <th className="px-3 py-2 text-xs font-extrabold text-black/60">
                Presentación
              </th>
              <th className="px-3 py-2 text-xs font-extrabold text-black/60">
                Cantidad
              </th>
              <th className="px-3 py-2 text-xs font-extrabold text-black/60">
                Precio
              </th>
              <th className="px-3 py-2 text-xs font-extrabold text-black/60">
                Desc.
              </th>
              <th className="px-3 py-2 text-xs font-extrabold text-black/60">
                IVA
              </th>
              <th className="px-3 py-2 text-xs font-extrabold text-black/60">
                Importe
              </th>
            </tr>
          </thead>

          <tbody>
            {detalles.map((detalle, index) => (
              <tr
                key={`detalle-cobro-${index}`}
                className="border-b border-black/5"
              >
                <td className="px-3 py-2 text-sm font-semibold text-black/80">
                  {detalle.producto_label || "Producto sin seleccionar"}
                </td>
                <td className="px-3 py-2 text-sm font-semibold text-black/70">
                  {detalle.presentacion}
                </td>
                <td className="px-3 py-2 text-sm font-semibold text-black/70">
                  {detalle.cantidad}
                </td>
                <td className="px-3 py-2 text-sm font-semibold text-black/70">
                  {formatMoney(detalle.precio_unitario)}
                </td>
                <td className="px-3 py-2 text-sm font-semibold text-black/70">
                  {formatMoney(detalle.descuento)}
                </td>
                <td className="px-3 py-2 text-sm font-semibold text-black/70">
                  {formatMoney(calcDetalleImpuesto(detalle))}
                </td>
                <td className="px-3 py-2 text-sm font-extrabold text-black/80">
                  {formatMoney(calcDetalleTotal(detalle))}
                </td>
              </tr>
            ))}

            {!detalles.length ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-6 text-center text-sm font-semibold text-black/45"
                >
                  No hay productos agregados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
