// src/modules/proveedores/components/proveedores/ProveedoresTable.tsx
// Tabla del listado de Proveedores.
// Responsabilidades: renderizar encabezado, filas, hover suave, estatus tipo ORM y acciones.
// Nota: no se muestra el id_proveedor; en su lugar se muestran datos más útiles en pantalla.

import type { ProveedorListItem } from "../../types/proveedores.types";
import type { ProveedoresTheme } from "../../theme/proveedoresTheme";
import ProveedorEstatusBadge from "./ProveedorEstatusBadge";
import ProveedoresRowActions from "./ProveedoresRowActions";

type Props = {
  theme: ProveedoresTheme;
  items: ProveedorListItem[];
  onVer: (p: ProveedorListItem) => void;
  onEditar: (p: ProveedorListItem) => void;
  onEliminar: (p: ProveedorListItem) => void;
};

export default function ProveedoresTable({
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
          {/* Encabezado fuerte */}
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Razón social</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          {/* Body siempre sobre blanco */}
          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((p) => (
              <tr key={p.id_proveedor} className={`bg-white ${theme.rowHover}`}>
                <td className="px-4 py-3 font-semibold">{p.razon_social}</td>
                <td className="px-4 py-3 font-semibold">{p.tipo}</td>
                <td className="px-4 py-3">{p.telefono ?? "—"}</td>
                <td className="px-4 py-3">{p.correo ?? "—"}</td>
                <td className="px-4 py-3">
                  <ProveedorEstatusBadge theme={theme} estatus={p.estatus} />
                </td>
                <td className="px-4 py-3">
                  <ProveedoresRowActions
                    proveedor={p}
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
            No hay proveedores para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
