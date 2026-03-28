// src/modules/ventas/components/ventas/VentasFilters.tsx
// Panel de filtros del listado de Ventas.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { VentaEstatus } from "../../types";
import type { VentasTheme } from "../../theme/ventasTheme";

export type VentasFiltersState = {
  q: string;
  estatus: "TODOS" | VentaEstatus;
  idCliente: "TODOS" | string;
  desde: string;
  hasta: string;
};

export type VentaClienteFilterOption = {
  id_cliente: number;
  label: string;
};

type Props = {
  theme: VentasTheme;
  filters: VentasFiltersState;
  clientesDisponibles?: VentaClienteFilterOption[];
  onChange: (patch: Partial<VentasFiltersState>) => void;
};

export default function VentasFilters({
  theme,
  filters,
  clientesDisponibles = [],
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
      <div className="flex flex-col gap-1 xl:col-span-2">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por folio, cliente o vendedor..."
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
              estatus: e.target.value as VentasFiltersState["estatus"],
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
          <option value="COMPLETADA">Completada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Cliente</label>
        <select
          value={filters.idCliente}
          onChange={(e) => onChange({ idCliente: e.target.value })}
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        >
          <option value="TODOS">Todos</option>
          {clientesDisponibles.map((cliente) => (
            <option key={cliente.id_cliente} value={String(cliente.id_cliente)}>
              {cliente.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Desde</label>
        <input
          type="datetime-local"
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
          type="datetime-local"
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
