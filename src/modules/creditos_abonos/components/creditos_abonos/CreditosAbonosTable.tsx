// src/modules/creditos_abonos/components/creditos_abonos/CreditosAbonosTable.tsx
// Tabla del listado de Créditos Abonos.
// Responsabilidades: renderizar encabezado, filas, hover suave, estatus y acciones.
// Nota: en este módulo no se muestra la columna ID.

import type { CreditoAbonoResumen } from "../../types/creditos_abonos.types";
import type { CreditosAbonosTheme } from "../../theme/creditosAbonosTheme";
import CreditosAbonosEstatusBadge from "./CreditosAbonosEstatusBadge";
import CreditosAbonosRowActions from "./CreditosAbonosRowActions";

type Props = {
  theme: CreditosAbonosTheme;
  items: CreditoAbonoResumen[];
  onVer: (abono: CreditoAbonoResumen) => void;
  onEditar: (abono: CreditoAbonoResumen) => void;
  onCancelar: (abono: CreditoAbonoResumen) => void;
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value ?? 0);
}

function formatFecha(fecha: string): string {
  if (!fecha) return "-";

  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return fecha;

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

function formaPagoLabel(id_forma_pago: number): string {
  switch (id_forma_pago) {
    case 1:
      return "Efectivo";
    case 2:
      return "Transferencia";
    case 3:
      return "Tarjeta";
    default:
      return `Forma ${id_forma_pago}`;
  }
}

export default function CreditosAbonosTable({
  theme,
  items,
  onVer,
  onEditar,
  onCancelar,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          {/* Encabezado fuerte */}
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Folio</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Forma de pago</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          {/* Body siempre sobre blanco */}
          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((abono) => (
              <tr key={abono.id_abono} className={`bg-white ${theme.rowHover}`}>
                <td className="px-4 py-3 font-semibold">{abono.folio}</td>
                <td className="px-4 py-3 font-semibold">
                  Cliente #{abono.id_cliente}
                </td>
                <td className="px-4 py-3">{formatFecha(abono.fecha_hora)}</td>
                <td className="px-4 py-3 font-semibold">
                  {formaPagoLabel(abono.id_forma_pago)}
                </td>
                <td className="px-4 py-3 font-semibold">
                  {formatMoney(abono.monto_total)}
                </td>
                <td className="px-4 py-3">
                  <CreditosAbonosEstatusBadge
                    theme={theme}
                    estatus={abono.estatus}
                  />
                </td>
                <td className="px-4 py-3">
                  <CreditosAbonosRowActions
                    abono={abono}
                    onVer={onVer}
                    onEditar={onEditar}
                    onCancelar={onCancelar}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay abonos para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
