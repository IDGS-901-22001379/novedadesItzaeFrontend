// src/modules/clientes/components/clientes/ClientesTable.tsx
// Tabla del listado de Clientes.
// Responsabilidades: renderizar encabezado, filas, hover suave, estatus tipo ORM y acciones.

import type { ClienteListItem, TipoCliente } from "../../types/clientes.types";
import type { ClientesTheme } from "../../theme/clientesTheme";
import ClienteEstatusBadge from "./ClienteEstatusBadge";
import ClientesRowActions from "./ClientesRowActions";

type Props = {
  theme: ClientesTheme;
  items: ClienteListItem[];
  tiposDisponibles: TipoCliente[];
  onVer: (c: ClienteListItem) => void;
  onEditar: (c: ClienteListItem) => void;
  onEliminar: (c: ClienteListItem) => void;
};

function tipoClienteLabelById(tipos: TipoCliente[], id: number): string {
  const found = tipos.find((x) => x.id_tipo_cliente === id);
  return found?.nombre ?? `Tipo ${id}`;
}

function nombreCompleto(c: ClienteListItem): string {
  const am = c.apellido_materno ? ` ${c.apellido_materno}` : "";
  return `${c.nombre} ${c.apellido_paterno}${am}`;
}

export default function ClientesTable({
  theme,
  items,
  tiposDisponibles,
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
              <th className="px-4 py-3">Número</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((c) => (
              <tr key={c.id_cliente} className={`bg-white ${theme.rowHover}`}>
                <td className="px-4 py-3 font-semibold">{c.numero_cliente}</td>
                <td className="px-4 py-3 font-semibold">{nombreCompleto(c)}</td>
                <td className="px-4 py-3 font-semibold">
                  {tipoClienteLabelById(tiposDisponibles, c.id_tipo_cliente)}
                </td>
                <td className="px-4 py-3">
                  <ClienteEstatusBadge theme={theme} estatus={c.estatus} />
                </td>
                <td className="px-4 py-3">
                  <ClientesRowActions
                    cliente={c}
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
            No hay clientes para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
