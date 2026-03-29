// src/modules/cortes_caja/components/cortes_caja/Cortes_cajaTable.tsx
// Tabla del listado de Cortes de Caja.
// Se encarga de renderizar el encabezado, las filas, el estatus y las acciones disponibles para cada apertura.

import type { CorteCajaAperturaResumen } from "../../types";
import type { CortesCajaTheme } from "../../theme/cortesCajaTheme";
import Cortes_cajaEstatusBadge from "./Cortes_cajaEstatusBadge";
import Cortes_cajaRowActions from "./Cortes_cajaRowActions";

type Props = {
  theme: CortesCajaTheme;
  items: CorteCajaAperturaResumen[];
  onVer: (apertura: CorteCajaAperturaResumen) => void;
  onCerrar: (apertura: CorteCajaAperturaResumen) => void;
};

function formatDate(value?: string | null): string {
  if (!value) return "Sin cierre";

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

export default function Cortes_cajaTable({
  theme,
  items,
  onVer,
  onCerrar,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Caja</th>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Fecha de apertura</th>
              <th className="px-4 py-3">Fecha de cierre</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((apertura) => (
              <tr
                key={apertura.id_apertura}
                className={`bg-white ${theme.rowHover}`}
              >
                <td className="px-4 py-3 font-semibold">
                  Caja #{apertura.id_caja}
                </td>

                <td className="px-4 py-3 font-semibold">
                  Usuario #{apertura.id_usuario}
                </td>

                <td className="px-4 py-3">
                  {formatDate(apertura.fecha_hora_apertura)}
                </td>

                <td className="px-4 py-3">
                  {formatDate(apertura.fecha_hora_cierre)}
                </td>

                <td className="px-4 py-3">
                  <Cortes_cajaEstatusBadge
                    theme={theme}
                    estatus={apertura.estatus}
                  />
                </td>

                <td className="px-4 py-3">
                  <Cortes_cajaRowActions
                    apertura={apertura}
                    onVer={onVer}
                    onCerrar={onCerrar}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay aperturas de caja para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
