// src/modules/creditos/components/creditos/CreditosTable.tsx
// Tabla del listado de Créditos.
// Responsabilidades: renderizar encabezado, filas, hover suave, estatus visual y acciones.

import type { CreditoListItem } from "../../types/creditos.types";
import type { CreditosTheme } from "../../theme/creditosTheme";
import CreditoEstatusBadge from "./CreditoEstatusBadge";
import CreditosRowActions from "./CreditosRowActions";

type Props = {
  theme: CreditosTheme;
  items: CreditoListItem[];
  onVer: (item: CreditoListItem) => void;
  onEditar: (item: CreditoListItem) => void;
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

export default function CreditosTable({
  theme,
  items,
  onVer,
  onEditar,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          {/* Encabezado fuerte (sí debe heredar blanco) */}
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Venta</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Total venta</th>
              <th className="px-4 py-3">Abonado</th>
              <th className="px-4 py-3">Saldo pendiente</th>
              <th className="px-4 py-3">Vencimiento</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          {/* Body siempre sobre blanco: fuerza texto negro */}
          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((item) => (
              <tr
                key={item.id_venta_credito}
                className={`bg-white ${theme.rowHover}`}
              >
                <td className="px-4 py-3 font-semibold">{item.id_venta}</td>
                <td className="px-4 py-3 font-semibold">{item.id_cliente}</td>
                <td className="px-4 py-3">
                  <CreditoEstatusBadge theme={theme} estatus={item.estado} />
                </td>
                <td className="px-4 py-3 font-semibold">
                  {formatMoney(item.total_venta)}
                </td>
                <td className="px-4 py-3 font-semibold">
                  {formatMoney(item.total_abonado)}
                </td>
                <td className="px-4 py-3 font-semibold">
                  {formatMoney(item.saldo_pendiente)}
                </td>
                <td className="px-4 py-3">{item.fecha_vencimiento}</td>
                <td className="px-4 py-3">
                  <CreditosRowActions
                    item={item}
                    onVer={onVer}
                    onEditar={onEditar}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay créditos para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
