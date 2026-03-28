// src/modules/caja/components/caja/CajaTable.tsx
// Tabla del listado de Cajas.
// Responsabilidades: renderizar encabezado, filas, hover suave, estado visual y acciones.
// Nota: no muestra la columna de id, solo los datos más útiles para operación.

import type { Caja } from "../../types/caja.types";
import type { CajaTheme } from "../../theme/cajaTheme";
import CajaActivoBadge from "./CajaActivoBadge";
import CajaRowActions from "./CajaRowActions";

type SucursalOption = {
  id: number;
  label: string;
};

type Props = {
  theme: CajaTheme;
  items: Caja[];
  sucursalesDisponibles: SucursalOption[];
  onVer: (caja: Caja) => void;
  onEditar: (caja: Caja) => void;
  onEliminar: (caja: Caja) => void;
};

// Resuelve el nombre visible de la sucursal con base en su id.
function getSucursalLabel(
  idSucursal: number,
  sucursalesDisponibles: SucursalOption[],
): string {
  const found = sucursalesDisponibles.find((x) => x.id === idSucursal);
  return found?.label ?? `Sucursal ${idSucursal}`;
}

export default function CajaTable({
  theme,
  items,
  sucursalesDisponibles,
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Sucursal</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((caja) => (
              <tr key={caja.id_caja} className={`bg-white ${theme.rowHover}`}>
                <td className="px-4 py-3 font-semibold">{caja.nombre}</td>
                <td className="px-4 py-3">{caja.codigo}</td>
                <td className="px-4 py-3 font-semibold">
                  {getSucursalLabel(caja.id_sucursal, sucursalesDisponibles)}
                </td>
                <td className="px-4 py-3">
                  <CajaActivoBadge theme={theme} activo={caja.activo} />
                </td>
                <td className="px-4 py-3">
                  <CajaRowActions
                    caja={caja}
                    onVer={onVer}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay cajas para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
