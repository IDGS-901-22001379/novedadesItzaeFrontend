// src/modules/productos/components/productos/precios/ProductoPrecioHistorialSection.tsx

import type { ProductosTheme } from "../../../theme/productosTheme";
import type {
  PrecioProducto,
  PrecioProductoFormState,
  ProductoLite,
  TipoClienteCatalogo,
} from "../../../types/productos.types";

import type {
  HistorialFiltersState,
  LoadState,
  PrecioFormMode,
} from "./useProductoPreciosModal";

import ProductoPrecioHistorialHeader from "./ProductoPrecioHistorialHeader";
import ProductoPrecioRegistroPanel from "./ProductoPrecioRegistroPanel";
import ProductoPrecioHistorialStates from "./ProductoPrecioHistorialStates";
import ProductoPrecioHistorialTable from "./ProductoPrecioHistorialTable";

type Props = {
  theme: ProductosTheme;
  producto: ProductoLite;

  tiposCliente: TipoClienteCatalogo[];
  tiposClienteOrdenados: TipoClienteCatalogo[];

  historialFilters: HistorialFiltersState;
  updateHistorialFilter: <K extends keyof HistorialFiltersState>(
    key: K,
    value: HistorialFiltersState[K],
  ) => void;

  loadHistorialState: LoadState;
  errorHistorial: string;
  historialFiltrado: PrecioProducto[];

  // Registro
  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formMode: PrecioFormMode;
  form: PrecioProductoFormState;
  updateForm: <K extends keyof PrecioProductoFormState>(
    key: K,
    value: PrecioProductoFormState[K],
  ) => void;
  tipoClienteNombreSeleccionado: string;
  loadTiposState: LoadState;
  errorTipos: string;
  saveError: string;
  saveSuccess: string;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  clearSaveMessages: () => void;
  resetAndCloseForm: () => void;

  // Acciones tabla
  onVerPrecio: (precio: PrecioProducto) => void;
  onEditarPrecio: (precio: PrecioProducto) => void;
  onDesactivarPrecio: (precio: PrecioProducto) => void | Promise<void>;
  onActivarPrecio: (precio: PrecioProducto) => void | Promise<void>;
};

export default function ProductoPrecioHistorialSection({
  theme,
  producto,

  tiposCliente,
  tiposClienteOrdenados,

  historialFilters,
  updateHistorialFilter,

  loadHistorialState,
  errorHistorial,
  historialFiltrado,

  formOpen,
  setFormOpen,
  formMode,
  form,
  updateForm,
  tipoClienteNombreSeleccionado,
  loadTiposState,
  errorTipos,
  saveError,
  saveSuccess,
  saving,
  onSubmit,
  clearSaveMessages,
  resetAndCloseForm,

  onVerPrecio,
  onEditarPrecio,
  onDesactivarPrecio,
  onActivarPrecio,
}: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <ProductoPrecioHistorialHeader
        theme={theme}
        tiposClienteOrdenados={tiposClienteOrdenados}
        historialFilters={historialFilters}
        updateHistorialFilter={updateHistorialFilter}
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        clearSaveMessages={clearSaveMessages}
      />

      <ProductoPrecioRegistroPanel
        theme={theme}
        producto={producto}
        tiposClienteOrdenados={tiposClienteOrdenados}
        formOpen={formOpen}
        formMode={formMode}
        form={form}
        updateForm={updateForm}
        tipoClienteNombreSeleccionado={tipoClienteNombreSeleccionado}
        loadTiposState={loadTiposState}
        errorTipos={errorTipos}
        saveError={saveError}
        saveSuccess={saveSuccess}
        saving={saving}
        onSubmit={onSubmit}
        resetAndCloseForm={resetAndCloseForm}
      />

      <ProductoPrecioHistorialStates
        loadHistorialState={loadHistorialState}
        errorHistorial={errorHistorial}
        historialFiltrado={historialFiltrado}
      />

      {loadHistorialState !== "loading" && historialFiltrado.length > 0 ? (
        <ProductoPrecioHistorialTable
          theme={theme}
          tiposCliente={tiposCliente}
          historialFiltrado={historialFiltrado}
          onVerPrecio={onVerPrecio}
          onEditarPrecio={onEditarPrecio}
          onDesactivarPrecio={onDesactivarPrecio}
          onActivarPrecio={onActivarPrecio}
        />
      ) : null}
    </div>
  );
}
