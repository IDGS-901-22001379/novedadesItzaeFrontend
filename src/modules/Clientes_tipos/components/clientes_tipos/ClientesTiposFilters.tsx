// src/modules/clientes_tipos/components/clientes_tipos/ClientesTiposFilters.tsx
// Panel de filtros del listado de Clientes Tipos.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { ClientesTiposTheme } from "../../theme/clientesTiposTheme";

export type ClientesTiposFiltersState = {
  q: string;
  activo: "TODOS" | "ACTIVOS" | "INACTIVOS";
};

type Props = {
  theme: ClientesTiposTheme;
  filters: ClientesTiposFiltersState;
  onChange: (patch: Partial<ClientesTiposFiltersState>) => void;
};

export default function ClientesTiposFilters({
  theme,
  filters,
  onChange,
}: Props) {
  return (
    <div className="mx-auto max-w-4xl grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por nombre, descripción o id..."
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
          value={filters.activo}
          onChange={(e) =>
            onChange({
              activo: e.target.value as ClientesTiposFiltersState["activo"],
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
          <option value="ACTIVOS">Activos</option>
          <option value="INACTIVOS">Inactivos</option>
        </select>
      </div>
    </div>
  );
}
