// src/modules/proveedores_productos/components/proveedores_productos/Proveedores_productosFilters.tsx
// Panel de filtros del listado de Proveedores-Productos.
// Responsabilidades: inputs/selects y notificar cambios al padre.

import type { ProveedorListItem } from "../../types/proveedores_productos.types";
import type { Proveedores_productosTheme } from "../../theme/proveedores_productosTheme";

export type Proveedores_productosFiltersState = {
  q: string;
  activo: "TODOS" | "ACTIVOS" | "INACTIVOS";
  idProveedor: "TODOS" | string;
};

type Props = {
  theme: Proveedores_productosTheme;
  filters: Proveedores_productosFiltersState;
  proveedoresDisponibles: ProveedorListItem[];
  onChange: (patch: Partial<Proveedores_productosFiltersState>) => void;
};

export default function Proveedores_productosFilters({
  theme,
  filters,
  proveedoresDisponibles,
  onChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Búsqueda</label>
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Buscar por producto, código de barras, modelo, sku o proveedor..."
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
              activo: e.target
                .value as Proveedores_productosFiltersState["activo"],
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

      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold">Proveedor</label>
        <select
          value={filters.idProveedor}
          onChange={(e) => onChange({ idProveedor: e.target.value })}
          className={[
            "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
            theme.inputBorder,
            theme.inputFocusRing,
            theme.inputText,
          ].join(" ")}
        >
          <option value="TODOS">Todos</option>
          {proveedoresDisponibles.map((prov) => (
            <option key={prov.id_proveedor} value={String(prov.id_proveedor)}>
              {prov.razon_social}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
