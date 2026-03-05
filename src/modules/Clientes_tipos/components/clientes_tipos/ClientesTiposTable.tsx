// src/modules/clientes_tipos/components/clientes_tipos/ClientesTiposTable.tsx
// Tabla del listado de Clientes Tipos.
// Responsabilidades: renderizar encabezado, filas, hover suave, badge de activo/inactivo y acciones.

import type { ClienteTipo } from "../../types/clientes.types";
import type { ClientesTiposTheme } from "../../theme/clientesTiposTheme";
import ClienteTipoEstatusBadge from "./ClienteTipoEstatusBadge";
import ClientesTiposRowActions from "./ClientesTiposRowActions";

type Props = {
  theme: ClientesTiposTheme;
  items: ClienteTipo[];
  onVer: (item: ClienteTipo) => void;
  onEditar: (item: ClienteTipo) => void;
  onEliminar: (item: ClienteTipo) => void;
};

export default function ClientesTiposTable({
  theme,
  items,
  onVer,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm">
          {/* Encabezado fuerte */}
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-[11px] sm:text-xs font-extrabold">
              <th className="px-3 py-2 sm:px-4 sm:py-3">ID</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3">Nombre</th>
              <th className="hidden px-3 py-2 sm:table-cell sm:px-4 sm:py-3">
                Descripción
              </th>
              <th className="px-3 py-2 sm:px-4 sm:py-3">Estatus</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-right">Acciones</th>
            </tr>
          </thead>

          {/* Body siempre blanco */}
          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((item) => (
              <tr
                key={item.id_tipo_cliente}
                className={`bg-white ${theme.rowHover}`}
              >
                <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold">
                  {item.id_tipo_cliente}
                </td>

                <td className="px-3 py-2 sm:px-4 sm:py-3 font-semibold">
                  {item.nombre}
                </td>

                {/* en móvil se oculta para que no se vea grande */}
                <td className="hidden px-3 py-2 sm:table-cell sm:px-4 sm:py-3">
                  {item.descripcion || "-"}
                </td>

                <td className="px-3 py-2 sm:px-4 sm:py-3">
                  <ClienteTipoEstatusBadge theme={theme} activo={item.activo} />
                </td>

                <td className="px-3 py-2 sm:px-4 sm:py-3">
                  <ClientesTiposRowActions
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
          <div className="p-5 text-center text-xs sm:text-sm font-semibold text-slate-600">
            No hay tipos de cliente para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
