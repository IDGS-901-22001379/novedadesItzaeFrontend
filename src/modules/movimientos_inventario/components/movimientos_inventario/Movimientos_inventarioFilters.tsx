// src/modules/movimientos_inventario/components/movimientos_inventario/Movimientos_inventarioFilters.tsx
// Panel de filtros del listado de Movimientos de Inventario.
// Responsabilidades: inputs/selects de búsqueda, tipo y rango de fechas,
// y notificar cambios al padre.
// Nota: la búsqueda humana puede incluir producto, código de barras, modelo,
// usuario, ubicación o referencia según lo soporte el backend.

import type { MovimientoInventarioTipo } from "../../types/movimientos_inventario.types";
import type { MovimientosInventarioTheme } from "../../theme/movimientosInventarioTheme";

export type Movimientos_inventarioFiltersState = {
  q: string;
  tipo: "TODOS" | MovimientoInventarioTipo;
  desde: string;
  hasta: string;
};

type Props = {
  theme: MovimientosInventarioTheme;
  filters: Movimientos_inventarioFiltersState;
  onChange: (patch: Partial<Movimientos_inventarioFiltersState>) => void;
};

export default function Movimientos_inventarioFilters({
  theme,
  filters,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por producto, código de barras, modelo, usuario, ubicación o referencia..."
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
        <label className="text-xs font-extrabold">Tipo</label>
        <select
          value={filters.tipo}
          onChange={(e) =>
            onChange({
              tipo: e.target
                .value as Movimientos_inventarioFiltersState["tipo"],
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
          <option value="COMPRA">Compras</option>
          <option value="VENTA">Ventas</option>
          <option value="AJUSTE">Ajustes</option>
          <option value="TRASPASO">Transferencias</option>
          <option value="OTRO">Otros</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Desde</label>
        <input
          type="date"
          value={filters.desde}
          onChange={(e) => onChange({ desde: e.target.value })}
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Hasta</label>
        <input
          type="date"
          value={filters.hasta}
          onChange={(e) => onChange({ hasta: e.target.value })}
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        />
      </div>
    </div>
  );
}
