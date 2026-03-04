// src/modules/clientes_fiscales/components/clientes_fiscales/ClientesFiscalesTable.tsx
// Tabla del listado de Clientes Fiscales.
// Ajuste: mostrar Nombre cliente, RFC, Predeterminado, Estatus, Acciones.

import type { ClienteFiscalBuscarItem } from "../../types/clientes_fiscales.types";
import type { ClientesFiscalesTheme } from "../../theme/clientesFiscalesTheme";

import ClienteFiscalEstatusBadge from "./ClienteFiscalEstatusBadge";
import ClientesFiscalesRowActions from "./ClientesFiscalesRowActions";

type Props = {
  theme: ClientesFiscalesTheme;
  items: ClienteFiscalBuscarItem[];
  getClienteNombre: (id_cliente: number) => string;
  onVer: (x: ClienteFiscalBuscarItem) => void;
  onEditar: (x: ClienteFiscalBuscarItem) => void;
  onEliminar: (x: ClienteFiscalBuscarItem) => void;
};

export default function ClientesFiscalesTable({
  theme,
  items,
  getClienteNombre,
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
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">RFC</th>
              <th className="px-4 py-3">Predeterminado</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((x) => (
              <tr
                key={x.id_cliente_fiscal}
                className={`bg-white ${theme.rowHover}`}
              >
                <td className="px-4 py-3 font-semibold">
                  {getClienteNombre(x.id_cliente)}
                </td>

                <td className="px-4 py-3 font-semibold">{x.rfc}</td>

                <td className="px-4 py-3 font-semibold">
                  {x.es_predeterminado ? "Sí" : "No"}
                </td>

                <td className="px-4 py-3">
                  <ClienteFiscalEstatusBadge
                    theme={theme}
                    estatus={x.estatus}
                  />
                </td>

                <td className="px-4 py-3">
                  <ClientesFiscalesRowActions
                    item={x}
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
            No hay clientes fiscales para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
