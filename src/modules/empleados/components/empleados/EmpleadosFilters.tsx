// src/modules/empleados/components/empleados/EmpleadosFilters.tsx
// Panel de filtros del listado de Empleados.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { EmpleadoEstatus } from "../../types/empleados.types";
import type { EmpleadosTheme } from "../../theme/empleadosTheme";

export type EmpleadosFiltersState = {
  q: string;
  puesto: string;
  estatus: "TODOS" | EmpleadoEstatus;
};

type Props = {
  theme: EmpleadosTheme;
  filters: EmpleadosFiltersState;
  onChange: (patch: Partial<EmpleadosFiltersState>) => void;
};

export default function EmpleadosFilters({ theme, filters, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por nombre, apellidos o usuario..."
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
              estatus: e.target.value as EmpleadosFiltersState["estatus"],
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
        <label className="text-xs font-extrabold">Puesto</label>
        <input
          value={filters.puesto}
          onChange={(e) => onChange({ puesto: e.target.value })}
          placeholder="Ej. Cajero, Gerente, Compras..."
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
            theme.inputPlaceholder,
          ].join(" ")}
        />
      </div>
    </div>
  );
}
