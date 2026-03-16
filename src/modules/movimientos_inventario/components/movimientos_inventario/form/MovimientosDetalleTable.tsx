// src/modules/movimientos_inventario/components/movimientos_inventario/form/MovimientosDetalleTable.tsx
// Tabla del detalle del movimiento.
// Responsabilidades:
// - mostrar productos del detalle
// - traducir id_producto a nombre amigable
// - mostrar cantidad, costo unitario, precio unitario e importe
// - usar el color del theme en el header

import type { MovimientoInventarioDetalle } from "../../../types/movimientos_inventario.types";
import type { MovimientosInventarioTheme } from "../../../theme/movimientosInventarioTheme";

type Props = {
  theme: MovimientosInventarioTheme;
  detalle: MovimientoInventarioDetalle[];
  productosMap: Record<number, string>;
};

function formatMoney(value?: number | null): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(n);
}

function getProductoLabel(
  idProducto: number,
  productosMap: Record<number, string>,
): string {
  return productosMap[idProducto] ?? `Producto #${idProducto}`;
}

export default function MovimientosDetalleTable({
  theme,
  detalle,
  productosMap,
}: Props) {
  if (!detalle || detalle.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-black/5 px-4 py-4 text-sm font-semibold text-black/70">
        Este movimiento no tiene detalles registrados.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Costo unitario</th>
              <th className="px-4 py-3">Precio unitario</th>
              <th className="px-4 py-3">Importe</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {detalle.map((item) => (
              <tr key={item.id_movimiento_detalle} className="bg-white">
                <td className="px-4 py-3 font-semibold">
                  {getProductoLabel(item.id_producto, productosMap)}
                </td>

                <td className="px-4 py-3 font-semibold">
                  {Number(item.cantidad ?? 0)}
                </td>

                <td className="px-4 py-3">
                  {formatMoney(item.costo_unitario)}
                </td>

                <td className="px-4 py-3">
                  {formatMoney(item.precio_unitario)}
                </td>

                <td className="px-4 py-3 font-extrabold">
                  {formatMoney(item.importe)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
