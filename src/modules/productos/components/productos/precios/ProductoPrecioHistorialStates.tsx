// src/modules/productos/components/productos/precios/ProductoPrecioHistorialStates.tsx

import type { PrecioProducto } from "../../../types/productos.types";
import type { LoadState } from "./useProductoPreciosModal";

type Props = {
  loadHistorialState: LoadState;
  errorHistorial: string;
  historialFiltrado: PrecioProducto[];
};

export default function ProductoPrecioHistorialStates({
  loadHistorialState,
  errorHistorial,
  historialFiltrado,
}: Props) {
  return (
    <>
      {errorHistorial ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {errorHistorial}
        </div>
      ) : null}

      {loadHistorialState === "loading" ? (
        <div className="rounded-2xl border border-black/10 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-500">
          Cargando historial de precios...
        </div>
      ) : null}

      {loadHistorialState !== "loading" && historialFiltrado.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-500">
          No hay precios para mostrar con los filtros actuales.
        </div>
      ) : null}
    </>
  );
}
