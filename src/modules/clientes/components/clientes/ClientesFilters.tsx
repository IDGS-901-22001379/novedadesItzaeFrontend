// src/modules/clientes/components/clientes/ClientesFilters.tsx
// Panel de filtros del listado de Clientes.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { ClienteEstatus, TipoCliente } from "../../types/clientes.types";
import type { ClientesTheme } from "../../theme/clientesTheme";

export type ClientesFiltersState = {
  q: string;
  estatus: "TODOS" | ClienteEstatus;
  idTipoCliente: "TODOS" | string;
};

type Props = {
  theme: ClientesTheme;
  filters: ClientesFiltersState;
  tiposDisponibles: TipoCliente[];
  onChange: (patch: Partial<ClientesFiltersState>) => void;
};

export default function ClientesFilters({
  theme,
  filters,
  tiposDisponibles,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por número, nombre, correo o teléfono..."
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
            theme.inputPlaceholder,
          ].join(" ")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Estatus</label>
        <select
          value={filters.estatus}
          onChange={(e) =>
            onChange({
              estatus: e.target.value as ClientesFiltersState["estatus"],
            })
          }
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        >
          <option value="TODOS">Todos</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Tipo de cliente</label>
        <select
          value={filters.idTipoCliente}
          onChange={(e) => onChange({ idTipoCliente: e.target.value })}
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        >
          <option value="TODOS">Todos</option>
          {tiposDisponibles.map((t) => (
            <option key={t.id_tipo_cliente} value={String(t.id_tipo_cliente)}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
