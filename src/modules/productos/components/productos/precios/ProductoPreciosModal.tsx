// src/modules/productos/components/productos/precios/ProductoPreciosModal.tsx

import type { ProductosTheme } from "../../../theme/productosTheme";
import type { ProductoLite } from "../../../types/productos.types";

import { useProductoPreciosModal } from "./useProductoPreciosModal";
import ProductoPrecioHistorialSection from "./ProductoPrecioHistorialSection";

type Props = {
  theme: ProductosTheme;
  producto: ProductoLite;
  onClose: () => void;
};

export default function ProductoPreciosModal({ theme, producto }: Props) {
  const vm = useProductoPreciosModal(producto);

  return (
    <div className="space-y-4">
      <ProductoPrecioHistorialSection
        theme={theme}
        producto={producto}
        tiposCliente={vm.tiposCliente}
        tiposClienteOrdenados={vm.tiposClienteOrdenados}
        historialFilters={vm.historialFilters}
        updateHistorialFilter={vm.updateHistorialFilter}
        loadHistorialState={vm.loadHistorialState}
        errorHistorial={vm.errorHistorial}
        historialFiltrado={vm.historialFiltrado}
        formOpen={vm.formOpen}
        setFormOpen={vm.setFormOpen}
        formMode={vm.formMode}
        form={vm.form}
        updateForm={vm.updateForm}
        tipoClienteNombreSeleccionado={vm.tipoClienteNombreSeleccionado}
        loadTiposState={vm.loadTiposState}
        errorTipos={vm.errorTipos}
        saveError={vm.saveError}
        saveSuccess={vm.saveSuccess}
        saving={vm.saving}
        onSubmit={vm.handleSubmit}
        clearSaveMessages={vm.clearSaveMessages}
        resetAndCloseForm={vm.resetAndCloseForm}
        onVerPrecio={vm.onVerPrecio}
        onEditarPrecio={vm.onEditarPrecio}
        onDesactivarPrecio={vm.onDesactivarPrecio}
        onActivarPrecio={vm.onActivarPrecio}
      />
    </div>
  );
}
