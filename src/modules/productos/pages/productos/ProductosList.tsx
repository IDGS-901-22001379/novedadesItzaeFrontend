// src/modules/productos/pages/productos/ProductosList.tsx
import { useEffect } from "react";
import { useProductosTheme } from "../../theme/useProductosTheme";

import ProductosHeader from "../../components/productos/ProductosHeader";
import ProductosFilters from "../../components/productos/ProductosFilters";
import ProductosTable from "../../components/productos/ProductosTable";
import ProductosPagination from "../../components/productos/ProductosPagination";
import ProductosAlert from "../../components/productos/ProductosAlert";

import { proveedoresService } from "../../services/proveedores.service";

import { useProductosListData } from "./list/useProductosListData";
import { useProductosListView } from "./list/useProductosListView";
import { useProductosPageEnrichment } from "./list/useProductosPageEnrichment";
import { useProductosSucursalStock } from "./list/useProductosSucursalStock";
import { useProductosListActions } from "./list/useProductosListActions";
import ProductosModals from "./list/ProductosModals";

export default function ProductosList() {
  const theme = useProductosTheme();

  const {
    allItems,
    items,
    setItems,
    categorias,
    proveedores,
    sucursales,
    state,
    errorMsg,
    cargar,
  } = useProductosListData();

  const {
    filters,
    updateFilters,
    page,
    setPage,
    totalPages,
    from,
    to,
    total,
    itemsPagina,
    resumen,
  } = useProductosListView(items, 10);

  useProductosPageEnrichment(itemsPagina, setItems);

  const stockByProductoId = useProductosSucursalStock(
    itemsPagina,
    filters,
    sucursales,
  );

  const actions = useProductosListActions({
    recargar: () => void cargar(),
  });

  useEffect(() => {
    let cancelled = false;

    async function aplicarFiltroProveedor() {
      if (filters.idProveedor === "TODOS") {
        setItems(allItems);
        return;
      }

      try {
        const relaciones = await proveedoresService.listarProductos(
          Number(filters.idProveedor),
          true,
        );

        if (cancelled) return;

        const ids = new Set(
          relaciones.filter((r) => r.activo).map((r) => r.id_producto),
        );

        const filtrados = allItems.filter((p) => ids.has(p.id_producto));
        setItems(filtrados);
      } catch {
        if (cancelled) return;
        setItems([]);
      }
    }

    void aplicarFiltroProveedor();

    return () => {
      cancelled = true;
    };
  }, [filters.idProveedor, allItems, setItems]);

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <ProductosHeader
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
          <ProductosFilters
            theme={theme}
            filters={filters}
            categoriasDisponibles={categorias}
            proveedoresDisponibles={proveedores}
            sucursalesDisponibles={sucursales}
            onChange={updateFilters}
          />

          {state === "error" ? (
            <div className="mt-3">
              <ProductosAlert type="error" message={errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <ProductosTable
          theme={theme}
          items={itemsPagina}
          onVer={actions.onVer}
          onEditar={actions.onEditar}
          onEliminar={actions.onEliminar}
          onPrecios={actions.onPrecios}
          getStockValue={(p) => {
            const v = stockByProductoId[p.id_producto];
            return v === undefined ? null : v;
          }}
        />

        <ProductosPagination
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

      <ProductosModals
        theme={theme}
        openNuevo={actions.openNuevo}
        openEditar={actions.openEditar}
        openVer={actions.openVer}
        openPrecios={actions.openPrecios}
        precioTarget={actions.precioTarget}
        openConfirmEstatus={actions.openConfirmEstatus}
        productoEstatusTarget={actions.productoEstatusTarget}
        savingEstatus={actions.savingEstatus}
        selectedProducto={actions.selectedProducto}
        estatusNuevo={actions.estatusNuevo}
        confirmVariant={actions.confirmVariant}
        confirmText={actions.confirmText}
        onCloseNuevo={actions.closeNuevo}
        onCloseEditar={actions.closeEditar}
        onCloseVer={actions.closeVer}
        onClosePrecios={actions.closePrecios}
        onSuccessForm={() => {
          actions.closeNuevo();
          actions.closeEditar();
          void cargar();
        }}
        onCancelConfirm={actions.closeConfirmEstatus}
        onConfirmEstatus={() => void actions.confirmarCambioEstatus()}
      />
    </div>
  );
}
