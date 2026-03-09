// src/modules/proveedores/components/proveedores/ProveedoresFilters.tsx
// Panel de filtros del listado de Proveedores.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type {
  ProveedorEstatus,
  ProveedorTipo,
} from "../../types/proveedores.types";
import type { ProveedoresTheme } from "../../theme/proveedoresTheme";

export type ProveedoresFiltersState = {
  q: string;
  estatus: "TODOS" | ProveedorEstatus;
  tipo: "TODOS" | ProveedorTipo;
};

type Props = {
  theme: ProveedoresTheme;
  filters: ProveedoresFiltersState;
  onChange: (patch: Partial<ProveedoresFiltersState>) => void;
};

export default function ProveedoresFilters({
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
          placeholder="Buscar por razón social, teléfono, correo o id..."
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
              estatus: e.target.value as ProveedoresFiltersState["estatus"],
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
        <label className="text-xs font-extrabold">Tipo</label>
        <select
          value={filters.tipo}
          onChange={(e) =>
            onChange({
              tipo: e.target.value as ProveedoresFiltersState["tipo"],
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
          <option value="REGISTRADO">Registrado</option>
          <option value="EXTERNO">Externo</option>
        </select>
      </div>
    </div>
  );
}
