// src/modules/movimientos_inventario/pages/movimientos_inventario/Movimientos_inventarioList.tsx
// Vista principal del módulo Movimientos de Inventario.
// Responsabilidades: conectar hooks del listado, filtros, tabla, paginación y modal de detalle.

import { useMovimientosInventarioTheme } from "../../theme/useMovimientosInventarioTheme";

import Movimientos_inventarioHeader from "../../components/movimientos_inventario/Movimientos_inventarioHeader";
import Movimientos_inventarioFilters from "../../components/movimientos_inventario/Movimientos_inventarioFilters";
import Movimientos_inventarioTable from "../../components/movimientos_inventario/Movimientos_inventarioTable";
import Movimientos_inventarioPagination from "../../components/movimientos_inventario/Movimientos_inventarioPagination";
import Movimientos_inventarioAlert from "../../components/movimientos_inventario/Movimientos_inventarioAlert";

import { useMovimientosListData } from "./list/useMovimientosListData";
import { useMovimientosListView } from "./list/useMovimientosListView";
import { useMovimientosCatalogos } from "./list/useMovimientosCatalogos";
import { useMovimientosListActions } from "./list/useMovimientosListActions";
import MovimientosModals from "./list/MovimientosModals";

export default function Movimientos_inventarioList() {
  const theme = useMovimientosInventarioTheme();

  const {
    items,
    state,
    errorMsg,
    filters,
    updateFilters,
    page,
    setPage,
    total,
    totalPages,
    from,
    to,
    resumen,
    recargar,
    obtenerMovimiento,
  } = useMovimientosListData();

  const { itemsPagina } = useMovimientosListView(items);

  const {
    usuariosMap,
    usuariosRolMap,
    productosMap,
    productosPorMovimientoMap,
    ubicacionesMap,
  } = useMovimientosCatalogos(itemsPagina);

  const actions = useMovimientosListActions({
    obtenerMovimiento,
  });

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <Movimientos_inventarioHeader
          theme={theme}
          resumen={resumen}
          loading={state === "loading"}
          onReload={() => void recargar()}
        />

        <div
          className={[
            "mt-4 rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <Movimientos_inventarioFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <Movimientos_inventarioAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <Movimientos_inventarioTable
          theme={theme}
          items={itemsPagina}
          loading={state === "loading"}
          onVer={actions.onVer}
          usuariosMap={usuariosMap}
          usuariosRolMap={usuariosRolMap}
          ubicacionesMap={ubicacionesMap}
          productosPorMovimientoMap={productosPorMovimientoMap}
        />

        <Movimientos_inventarioPagination
          theme={theme}
          page={page}
          totalPages={totalPages}
          from={from}
          to={to}
          total={total}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        />
      </div>

      <MovimientosModals
        theme={theme}
        openVer={actions.openVer}
        selectedMovimiento={actions.selectedMovimiento}
        usuariosMap={usuariosMap}
        productosMap={productosMap}
        ubicacionesMap={ubicacionesMap}
        onCloseVer={actions.closeVer}
      />
    </div>
  );
}
