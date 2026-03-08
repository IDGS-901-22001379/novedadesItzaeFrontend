// src/modules/productos/components/productos/precios/ProductoPrecioHistorialHeader.tsx

import type { ProductosTheme } from "../../../theme/productosTheme";
import type {
  TipoClienteCatalogo,
  PresentacionPrecio,
} from "../../../types/productos.types";
import { PRESENTACIONES_PRECIO_OPTIONS } from "../../../types/productos.types";
import type { HistorialFiltersState } from "./useProductoPreciosModal";

type Props = {
  theme: ProductosTheme;
  tiposClienteOrdenados: TipoClienteCatalogo[];
  historialFilters: HistorialFiltersState;
  updateHistorialFilter: <K extends keyof HistorialFiltersState>(
    key: K,
    value: HistorialFiltersState[K],
  ) => void;
  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clearSaveMessages: () => void;
};

export default function ProductoPrecioHistorialHeader({
  theme,
  tiposClienteOrdenados,
  historialFilters,
  updateHistorialFilter,
  formOpen,
  setFormOpen,
  clearSaveMessages,
}: Props) {
  return (
    <div className="mb-4 flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="text-base font-extrabold text-slate-900">
            Historial de precios
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-500">
            Administra precios por cliente, presentación y estado.
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            clearSaveMessages();
            setFormOpen((prev) => !prev);
          }}
          className={[
            "rounded-xl px-4 py-2 text-sm font-extrabold shadow-sm transition",
            formOpen
              ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              : "border border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-600",
          ].join(" ")}
        >
          {formOpen ? "Cerrar registro" : "Nuevo registro"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold text-slate-900">
            Filtrar por cliente
          </label>
          <select
            value={historialFilters.id_tipo_cliente}
            onChange={(e) =>
              updateHistorialFilter(
                "id_tipo_cliente",
                e.target.value ? Number(e.target.value) : "",
              )
            }
            className={[
              "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
              theme.inputBorder,
              theme.inputFocusRing,
              theme.inputText,
            ].join(" ")}
          >
            {tiposClienteOrdenados.map((tipo) => (
              <option key={tipo.id_tipo_cliente} value={tipo.id_tipo_cliente}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold text-slate-900">
            Filtrar por presentación
          </label>
          <select
            value={historialFilters.presentacion}
            onChange={(e) =>
              updateHistorialFilter(
                "presentacion",
                e.target.value as PresentacionPrecio,
              )
            }
            className={[
              "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
              theme.inputBorder,
              theme.inputFocusRing,
              theme.inputText,
            ].join(" ")}
          >
            {PRESENTACIONES_PRECIO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold text-slate-900">
            Filtrar por estado
          </label>
          <select
            value={historialFilters.estado}
            onChange={(e) =>
              updateHistorialFilter(
                "estado",
                e.target.value as HistorialFiltersState["estado"],
              )
            }
            className={[
              "rounded-xl border bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2",
              theme.inputBorder,
              theme.inputFocusRing,
              theme.inputText,
            ].join(" ")}
          >
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
            <option value="TODOS">Todos</option>
          </select>
        </div>
      </div>
    </div>
  );
}
