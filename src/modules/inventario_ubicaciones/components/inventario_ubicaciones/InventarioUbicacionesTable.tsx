// src/modules/inventario_ubicaciones/components/inventario_ubicaciones/InventarioUbicacionesTable.tsx

import type { InventarioUbicacion } from "../../types/inventario_ubicaciones.types";
import type { InventarioUbicacionesTheme } from "../../theme/inventarioUbicacionesTheme";
import InventarioUbicacionEstatusBadge from "./InventarioUbicacionEstatusBadge";
import InventarioUbicacionesRowActions from "./InventarioUbicacionesRowActions";

type Props = {
  theme: InventarioUbicacionesTheme;
  items: InventarioUbicacion[];
  sucursalMap: Map<number, string>;
  onVer: (item: InventarioUbicacion) => void;
  onEditar: (item: InventarioUbicacion) => void;
  onEliminar: (item: InventarioUbicacion) => void;
};

function getSucursalLabel(
  id_sucursal: number,
  sucursalMap: Map<number, string>,
): string {
  return sucursalMap.get(id_sucursal) ?? `Sucursal ${id_sucursal}`;
}

export default function InventarioUbicacionesTable({
  theme,
  items,
  sucursalMap,
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
              <th className="px-4 py-3">Sucursal</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Vendible</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((item) => (
              <tr
                key={item.id_ubicacion}
                className={`bg-white ${theme.rowHover}`}
              >
                <td className="px-4 py-3 font-semibold">
                  {getSucursalLabel(item.id_sucursal, sucursalMap)}
                </td>
                <td className="px-4 py-3 font-semibold">{item.tipo}</td>
                <td className="px-4 py-3">{item.nombre}</td>
                <td className="px-4 py-3 font-semibold">{item.codigo}</td>
                <td className="px-4 py-3 font-semibold">
                  {item.vendible ? "Sí" : "No"}
                </td>
                <td className="px-4 py-3">
                  <InventarioUbicacionEstatusBadge
                    theme={theme}
                    activo={item.activo}
                  />
                </td>
                <td className="px-4 py-3">
                  <InventarioUbicacionesRowActions
                    item={item}
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
            No hay ubicaciones para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
