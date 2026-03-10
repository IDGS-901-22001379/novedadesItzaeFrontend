// src/modules/inventario_sucursales/components/inventario_sucursales/InventarioSucursalesTable.tsx
// Tabla del listado de Inventario - Sucursales.
// Responsabilidades: renderizar encabezado, filas, hover suave, estatus visual y acciones.

import type { InventarioSucursalListItem } from "../../types";
import type { InventarioSucursalesTheme } from "../../theme/inventarioSucursalesTheme";
import InventarioSucursalEstatusBadge from "./InventarioSucursalEstatusBadge";
import InventarioSucursalesRowActions from "./InventarioSucursalesRowActions";

type Props = {
  theme: InventarioSucursalesTheme;
  items: InventarioSucursalListItem[];
  onVer: (item: InventarioSucursalListItem) => void;
  onEditar: (item: InventarioSucursalListItem) => void;
  onEliminar: (item: InventarioSucursalListItem) => void;
};

export default function InventarioSucursalesTable({
  theme,
  items,
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
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((item) => (
              <tr
                key={item.id_sucursal}
                className={`bg-white ${theme.rowHover}`}
              >
                <td className="px-4 py-3 font-semibold">{item.codigo}</td>
                <td className="px-4 py-3">{item.nombre}</td>
                <td className="px-4 py-3 font-semibold">Sucursal</td>
                <td className="px-4 py-3">
                  <InventarioSucursalEstatusBadge
                    theme={theme}
                    activo={item.activo}
                  />
                </td>
                <td className="px-4 py-3">
                  <InventarioSucursalesRowActions
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
            No hay sucursales para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
