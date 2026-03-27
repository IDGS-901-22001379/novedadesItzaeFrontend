// src/modules/ventas/components/ventas/VentasTable.tsx
// Tabla del listado de Ventas.
// Responsabilidades:
// - Renderizar encabezado y filas.
// - Mostrar datos principales de la venta sin columna ID.
// - Mantener el mismo patrón visual del resto de módulos.

import type { VentaListItem } from "../../types";
import type { VentasTheme } from "../../theme/ventasTheme";
import VentasEstatusBadge from "./VentasEstatusBadge";
import VentasRowActions from "./VentasRowActions";

type VentaListItemUi = VentaListItem & {
  cliente_nombre?: string | null;
  vendedor_nombre?: string | null;
};

type Props = {
  theme: VentasTheme;
  items: VentaListItem[];
  onVer: (item: VentaListItem) => void;
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDate(value?: string | null): string {
  if (!value) return "—";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

function getClienteLabel(item: VentaListItemUi): string {
  if (item.cliente_nombre?.trim()) return item.cliente_nombre.trim();
  if (item.id_cliente) return `Cliente #${item.id_cliente}`;
  return "Público general";
}

function getVendedorLabel(item: VentaListItemUi): string {
  if (item.vendedor_nombre?.trim()) return item.vendedor_nombre.trim();
  return `Vendedor #${item.id_usuario_vendedor}`;
}

export default function VentasTable({ theme, items, onVer }: Props) {
  const rows = items as VentaListItemUi[];

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Folio</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Vendedor</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Pagado</th>
              <th className="px-4 py-3 text-right">Cambio</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {rows.map((item) => (
              <tr key={item.id_venta} className={`bg-white ${theme.rowHover}`}>
                <td className="px-4 py-3 font-semibold">
                  {item.folio || `Venta ${item.id_venta}`}
                </td>

                <td className="px-4 py-3">
                  {formatDate(item.fecha_hora_pos || item.fecha_hora)}
                </td>

                <td className="px-4 py-3 font-medium">
                  {getClienteLabel(item)}
                </td>

                <td className="px-4 py-3 font-medium">
                  {getVendedorLabel(item)}
                </td>

                <td className="px-4 py-3">
                  <VentasEstatusBadge theme={theme} estatus={item.estatus} />
                </td>

                <td className="px-4 py-3 text-right font-semibold">
                  {formatMoney(item.total)}
                </td>

                <td className="px-4 py-3 text-right font-medium">
                  {formatMoney(item.monto_pagado)}
                </td>

                <td className="px-4 py-3 text-right font-medium">
                  {formatMoney(item.cambio)}
                </td>

                <td className="px-4 py-3">
                  <VentasRowActions item={item} onVer={onVer} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay ventas para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
