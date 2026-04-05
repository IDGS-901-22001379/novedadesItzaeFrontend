// src/modules/devoluciones_cancelaciones/components/devoluciones_cancelaciones/DevolucionesTable.tsx
// Tabla del listado de Devoluciones/Cancelaciones.
// Responsabilidades: renderizar encabezado, filas, hover suave y acciones.
// Nota: no se muestra la columna ID; solo se presentan los datos más útiles para el usuario.

import type { Devolucion } from "../../types/devoluciones_cancelaciones.types";
import type { DevolucionesCancelacionesTheme } from "../../theme/devolucionesCancelacionesTheme";
import DevolucionesTipoBadge from "./DevolucionesTipoBadge";
import DevolucionesRowActions from "./DevolucionesRowActions";

type Props = {
  theme: DevolucionesCancelacionesTheme;
  items: Devolucion[];
  loading?: boolean;
  onVer: (item: Devolucion) => void;
  onEditar: (item: Devolucion) => void;
  onCambiarEstatus: (item: Devolucion) => void;
};

function formatFechaHora(value: string): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value || 0));
}

function getVentaFolio(item: Devolucion): string {
  const raw = item as Devolucion & {
    venta_folio?: string | null;
    folio_venta?: string | null;
    numero_venta?: string | null;
  };

  return (
    raw.venta_folio?.trim() ||
    raw.folio_venta?.trim() ||
    raw.numero_venta?.trim() ||
    `Venta #${item.id_venta}`
  );
}

export default function DevolucionesTable({
  theme,
  items,
  loading = false,
  onVer,
  onEditar,
  onCambiarEstatus,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          {/* Encabezado fuerte */}
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Fecha y hora</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Importe devuelto</th>
              <th className="px-4 py-3">Folio venta</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((item) => (
              <tr
                key={item.id_devolucion}
                className={`bg-white ${theme.rowHover}`}
              >
                <td className="px-4 py-3 font-semibold">
                  {formatFechaHora(item.fecha_hora)}
                </td>

                <td className="px-4 py-3">
                  <DevolucionesTipoBadge theme={theme} tipo={item.tipo} />
                </td>

                <td className="px-4 py-3 font-semibold">
                  {formatMoney(item.importe_devuelto)}
                </td>

                <td className="px-4 py-3 font-semibold">
                  {getVentaFolio(item)}
                </td>

                <td className="px-4 py-3">
                  <DevolucionesRowActions
                    item={item}
                    onVer={onVer}
                    onEditar={onEditar}
                    onCambiarEstatus={onCambiarEstatus}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay devoluciones para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
