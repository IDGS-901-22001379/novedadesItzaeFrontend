// src/modules/traspasos/pages/traspasos/TraspasosList.tsx
// Vista principal del módulo Traspasos.
// Responsabilidades: conectar hooks del listado, filtros, tabla, paginación y modales.

import { useTraspasosTheme } from "../../theme/useTraspasosTheme";

import TraspasosHeader from "../../components/traspasos/TraspasosHeader";
import TraspasosFilters from "../../components/traspasos/TraspasosFilters";
import TraspasosTable from "../../components/traspasos/TraspasosTable";
import TraspasosPagination from "../../components/traspasos/TraspasosPagination";
import TraspasosAlert from "../../components/traspasos/TraspasosAlert";

import { useTraspasosListData } from "./list/useTraspasosListData";
import { useTraspasosListView } from "./list/useTraspasosListView";
import { useTraspasosCatalogos } from "./list/useTraspasosCatalogos";
import { useTraspasosListActions } from "./list/useTraspasosListActions";
import TraspasosModals from "./list/TraspasosModals";

export default function TraspasosList() {
  const theme = useTraspasosTheme();

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
    obtenerTraspaso,
  } = useTraspasosListData();

  const { itemsPagina } = useTraspasosListView(items);
  const { usuariosMap, usuariosRolMap } = useTraspasosCatalogos(itemsPagina);

  const actions = useTraspasosListActions({
    obtenerTraspaso,
  });

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <TraspasosHeader
          theme={theme}
          resumen={resumen}
          loading={state === "loading"}
          onNuevo={actions.onNuevo}
        />

        <div
          className={[
            "mt-4 rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <TraspasosFilters
            theme={theme}
            filters={filters}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <TraspasosAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <TraspasosTable
          theme={theme}
          items={itemsPagina}
          loading={state === "loading"}
          onVer={actions.onVer}
          usuariosMap={usuariosMap}
          usuariosRolMap={usuariosRolMap}
        />

        <TraspasosPagination
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

      <TraspasosModals
        theme={theme}
        openNuevo={actions.openNuevo}
        openVer={actions.openVer}
        selectedTraspaso={actions.selectedTraspaso}
        onCloseNuevo={actions.closeNuevo}
        onCloseVer={actions.closeVer}
        onSuccessNuevo={() => {
          actions.closeNuevo();
          void recargar();
        }}
      />
    </div>
  );
}
