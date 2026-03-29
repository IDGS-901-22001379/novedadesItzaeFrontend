// src/modules/cortes_caja/components/cortes_caja/Cortes_cajaFilters.tsx
// Panel de filtros del listado de Cortes de Caja.
// Se encarga de mostrar los campos de búsqueda y estatus, y notificar los cambios al componente padre.

import type { AperturaCajaEstatus } from "../../types";
import type { CortesCajaTheme } from "../../theme/cortesCajaTheme";

export type CortesCajaFiltersState = {
  q: string;
  estatus: "TODOS" | AperturaCajaEstatus;
};

type Props = {
  theme: CortesCajaTheme;
  filters: CortesCajaFiltersState;
  onChange: (patch: Partial<CortesCajaFiltersState>) => void;
};

export default function Cortes_cajaFilters({
  theme,
  filters,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por apertura, caja, usuario, estatus o fecha..."
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
              estatus: e.target.value as CortesCajaFiltersState["estatus"],
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
          <option value="ABIERTA">Abierta</option>
          <option value="CERRADA">Cerrada</option>
        </select>
      </div>
    </div>
  );
}
