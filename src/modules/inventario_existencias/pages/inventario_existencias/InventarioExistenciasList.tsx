// src/modules/inventario_existencias/pages/inventario_existencias/InventarioExistenciasList.tsx

import InventarioExistenciasForm from "./InventarioExistenciasForm";
import InventarioExistenciasDetail from "./InventarioExistenciasDetail";

import { useInventarioExistenciasTheme } from "../../theme/useInventarioExistenciasTheme";

import InventarioExistenciasHeader from "../../components/inventario_existencias/InventarioExistenciasHeader";
import InventarioExistenciasFilters from "../../components/inventario_existencias/InventarioExistenciasFilters";
import InventarioExistenciasTable from "../../components/inventario_existencias/InventarioExistenciasTable";
import InventarioExistenciasPagination from "../../components/inventario_existencias/InventarioExistenciasPagination";
import InventarioExistenciasAlert from "../../components/inventario_existencias/InventarioExistenciasAlert";
import InventarioExistenciasModalForm from "../../components/inventario_existencias/InventarioExistenciasModalForm";

import { useInventarioExistenciasList } from "./list/useInventarioExistenciasList";
import { sortUbicaciones } from "./list/inventarioExistenciasList.utils";

export default function InventarioExistenciasList() {
  const theme = useInventarioExistenciasTheme();
  const vm = useInventarioExistenciasList();

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <InventarioExistenciasHeader
          theme={theme}
          resumen={vm.resumen}
          loading={vm.state === "loading"}
          onNuevo={() => {
            void vm.onAbrirAjuste(null);
          }}
        />

        <div
          className={[
            "mt-4 rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <InventarioExistenciasFilters
            theme={theme}
            filters={vm.filters}
            sucursalesDisponibles={vm.sucursalesDisponibles}
            ubicacionesDisponibles={vm.ubicacionesDisponibles}
            onChange={(patch) => {
              const nextPatch = { ...patch };

              if (patch.idSucursal && patch.idSucursal !== "TODAS") {
                const nuevaSucursalId = Number(patch.idSucursal);

                const ubicacionesDeSucursal = sortUbicaciones(
                  vm.ubicacionesCatalogo.filter(
                    (u) => u.id_sucursal === nuevaSucursalId,
                  ),
                );

                const primeraTienda =
                  ubicacionesDeSucursal.find(
                    (u) => String(u.tipo).toUpperCase() === "TIENDA",
                  ) ?? null;

                nextPatch.idUbicacion = primeraTienda
                  ? String(primeraTienda.id_ubicacion)
                  : "TODAS";
              }

              if (patch.idSucursal === "TODAS") {
                nextPatch.idUbicacion = "TODAS";
              }

              vm.updateFilters(nextPatch);
            }}
          />

          {vm.state === "error" ? (
            <div className="mt-3">
              <InventarioExistenciasAlert type="error" message={vm.errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <InventarioExistenciasTable
          theme={theme}
          items={vm.items}
          loading={vm.state === "loading"}
          onVer={vm.onVer}
          onEditar={vm.onAbrirAjuste}
        />

        <InventarioExistenciasPagination
          theme={theme}
          page={vm.page}
          totalPages={vm.totalPages}
          from={vm.from}
          to={vm.to}
          total={vm.total}
          onPrev={() => vm.setPage((p) => Math.max(0, p - 1))}
          onNext={() => vm.setPage((p) => Math.min(vm.totalPages - 1, p + 1))}
        />
      </div>

      <InventarioExistenciasModalForm
        open={vm.openAjuste}
        title="Ajuste de existencias"
        theme={theme}
        onClose={() => vm.setOpenAjuste(false)}
      >
        <InventarioExistenciasForm
          key={
            vm.selectedItem
              ? `${vm.selectedItem.id_producto}-${vm.selectedItem.id_ubicacion}-${vm.selectedItem.id_existencia ?? "nuevo"}`
              : "ajuste"
          }
          modo="AJUSTE"
          initialExistencia={vm.selectedItem}
          onSuccess={() => {
            vm.setOpenAjuste(false);
            void vm.cargar();
          }}
          onCancel={() => vm.setOpenAjuste(false)}
        />
      </InventarioExistenciasModalForm>

      <InventarioExistenciasModalForm
        open={vm.openVer}
        title="Visualizar existencia"
        theme={theme}
        onClose={() => vm.setOpenVer(false)}
      >
        <InventarioExistenciasDetail item={vm.selectedItem} />
      </InventarioExistenciasModalForm>
    </div>
  );
}
