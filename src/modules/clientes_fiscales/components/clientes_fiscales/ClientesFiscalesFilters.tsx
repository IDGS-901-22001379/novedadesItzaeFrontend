// src/modules/clientes_fiscales/components/clientes_fiscales/ClientesFiscalesFilters.tsx
// Panel de filtros del listado de Clientes Fiscales.
// Responsabilidades: inputs/selects y notificar cambios al padre.
// MISMO diseño que UsuariosFilters.

import type { EstatusGenerico } from "../../types/clientes_fiscales.types";
import type { ClientesFiscalesTheme } from "../../theme/clientesFiscalesTheme";

export type ClientesFiscalesFiltersState = {
  q: string;
  estatus: "TODOS" | EstatusGenerico;
  soloActivos: boolean; // para /buscar?solo_activos=true|false
};

type Props = {
  theme: ClientesFiscalesTheme;
  filters: ClientesFiscalesFiltersState;
  onChange: (patch: Partial<ClientesFiscalesFiltersState>) => void;
};

export default function ClientesFiscalesFilters({
  theme,
  filters,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por RFC, razón social, correo o teléfono..."
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
              estatus: e.target
                .value as ClientesFiscalesFiltersState["estatus"],
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
        <label className="text-xs font-extrabold">Solo activos</label>
        <select
          value={filters.soloActivos ? "true" : "false"}
          onChange={(e) => onChange({ soloActivos: e.target.value === "true" })}
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        >
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>
    </div>
  );
}
