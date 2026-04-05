// src/modules/devoluciones_cancelaciones/components/devoluciones_cancelaciones/DevolucionesFilters.tsx
// Panel de filtros del listado de Devoluciones/Cancelaciones.
// Responsabilidades: inputs/selects y notificar cambios al padre.
// Ajuste visual:
// - Se elimina ID cliente e ID venta.
// - La búsqueda permite escribir folio de venta, nombre del cliente o motivo.
// - Todos los filtros quedan en una sola fila en escritorio.
// - Búsqueda ocupa más espacio que tipo y fechas.

import type { DevolucionTipo } from "../../types/devoluciones_cancelaciones.types";
import type { DevolucionesCancelacionesTheme } from "../../theme/devolucionesCancelacionesTheme";

export type DevolucionesFiltersState = {
  q: string;
  tipo: "TODOS" | DevolucionTipo;
  desde: string;
  hasta: string;
};

type Props = {
  theme: DevolucionesCancelacionesTheme;
  filters: DevolucionesFiltersState;
  onChange: (patch: Partial<DevolucionesFiltersState>) => void;
};

export default function DevolucionesFilters({
  theme,
  filters,
  onChange,
}: Props) {
  const inputClass = [
    "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
    theme.inputBorder,
    theme.inputFocusRing,
    theme.inputText,
    theme.inputPlaceholder,
  ].join(" ");

  const selectClass = [
    "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
    theme.inputBorder,
    theme.inputFocusRing,
    theme.inputText,
  ].join(" ");

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-12 xl:items-end">
      {/* Búsqueda: más grande */}
      <div className="flex flex-col gap-1 xl:col-span-6">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por folio de venta, cliente o motivo..."
          className={inputClass}
        />
      </div>

      {/* Tipo: más chico */}
      <div className="flex flex-col gap-1 xl:col-span-2">
        <label className="text-xs font-extrabold">Tipo</label>
        <select
          value={filters.tipo}
          onChange={(e) =>
            onChange({
              tipo: e.target.value as DevolucionesFiltersState["tipo"],
            })
          }
          className={selectClass}
        >
          <option value="TODOS">Todos</option>
          <option value="TOTAL">Total</option>
          <option value="PARCIAL">Parcial</option>
          <option value="CANCELACION">Cancelación</option>
        </select>
      </div>

      {/* Desde: chico */}
      <div className="flex flex-col gap-1 xl:col-span-2">
        <label className="text-xs font-extrabold">Desde</label>
        <input
          type="datetime-local"
          value={filters.desde}
          onChange={(e) => onChange({ desde: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Hasta: chico */}
      <div className="flex flex-col gap-1 xl:col-span-2">
        <label className="text-xs font-extrabold">Hasta</label>
        <input
          type="datetime-local"
          value={filters.hasta}
          onChange={(e) => onChange({ hasta: e.target.value })}
          className={inputClass}
        />
      </div>
    </div>
  );
}
