// src/modules/compras/components/compras/ComprasTable.tsx
// Tabla del listado de Compras.
// Responsabilidades: renderizar encabezado, filas, hover suave y acciones.
// Nota: el id_compra no se muestra en la tabla; solo se usa internamente.

import type { CompraListItem } from "../../types/compras.types";
import type { ComprasTheme } from "../../theme/comprasTheme";
import ComprasRowActions from "./ComprasRowActions";

type Props = {
  theme: ComprasTheme;
  items: CompraListItem[];
  onVer: (item: CompraListItem) => void;
  ubicacionesMap?: Record<number, string>;
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatFecha(value: string): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ComprasTable({
  theme,
  items,
  onVer,
  ubicacionesMap = {},
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Proveedor</th>
              <th className="px-4 py-3">Ubicación destino</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
              <th className="px-4 py-3 text-right">Impuestos</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((item) => (
              <tr key={item.id_compra} className={`bg-white ${theme.rowHover}`}>
                <td className="px-4 py-3 font-semibold">
                  {formatFecha(item.fecha)}
                </td>

                <td className="px-4 py-3">{item.proveedor}</td>

                <td className="px-4 py-3 font-semibold">
                  {ubicacionesMap[item.id_ubicacion_destino] ??
                    `Ubicación #${item.id_ubicacion_destino}`}
                </td>

                <td className="px-4 py-3 text-right font-semibold">
                  {formatMoney(item.subtotal)}
                </td>

                <td className="px-4 py-3 text-right font-semibold">
                  {formatMoney(item.impuestos_total)}
                </td>

                <td className="px-4 py-3 text-right font-extrabold">
                  {formatMoney(item.total)}
                </td>

                <td className="px-4 py-3">
                  <ComprasRowActions item={item} onVer={onVer} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay compras para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
