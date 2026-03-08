// src/modules/productos/pages/productos/list/ProductosModals.tsx

import type { ProductosTheme } from "../../../theme/productosTheme";
import type { Producto, ProductoLite } from "../../../types/productos.types";

import ProductosForm from "../ProductosForm";

import ProductosModalForm from "../../../components/productos/ProductosModalForm";
import ConfirmActionModal from "../../../components/productos/ConfirmActionModal";
import ProductoPreciosModal from "../../../components/productos/precios/ProductoPreciosModal";

type Props = {
  theme: ProductosTheme;

  // Estados/control de modales
  openNuevo: boolean;
  openEditar: boolean;
  openVer: boolean;

  openPrecios: boolean;
  precioTarget: ProductoLite | null;

  openConfirmEstatus: boolean;
  productoEstatusTarget: ProductoLite | null;
  savingEstatus: boolean;

  // Datos
  selectedProducto: Producto | null;

  // Derivados confirm
  estatusNuevo: string;
  confirmVariant: "success" | "warning" | "danger" | "info";
  confirmText: string;

  // Handlers
  onCloseNuevo: () => void;
  onCloseEditar: () => void;
  onCloseVer: () => void;
  onClosePrecios: () => void;

  onSuccessForm: () => void;

  onCancelConfirm: () => void;
  onConfirmEstatus: () => void;
};

export default function ProductosModals({
  theme,

  openNuevo,
  openEditar,
  openVer,

  openPrecios,
  precioTarget,

  openConfirmEstatus,
  productoEstatusTarget,
  savingEstatus,

  selectedProducto,

  estatusNuevo,
  confirmVariant,
  confirmText,

  onCloseNuevo,
  onCloseEditar,
  onCloseVer,
  onClosePrecios,

  onSuccessForm,

  onCancelConfirm,
  onConfirmEstatus,
}: Props) {
  return (
    <>
      {/* MODAL: NUEVO */}
      <ProductosModalForm
        open={openNuevo}
        title="Nuevo producto"
        theme={theme}
        onClose={onCloseNuevo}
      >
        <ProductosForm
          key="nuevo"
          modo="CREAR"
          initialProducto={null}
          onSuccess={onSuccessForm}
          onCancel={onCloseNuevo}
        />
      </ProductosModalForm>

      {/* MODAL: EDITAR */}
      <ProductosModalForm
        open={openEditar}
        title="Editar producto"
        theme={theme}
        onClose={onCloseEditar}
      >
        <ProductosForm
          key={selectedProducto?.id_producto ?? "editar"}
          modo="EDITAR"
          initialProducto={selectedProducto}
          onSuccess={onSuccessForm}
          onCancel={onCloseEditar}
        />
      </ProductosModalForm>

      {/* MODAL: VER */}
      <ProductosModalForm
        open={openVer}
        title="Visualizar producto"
        theme={theme}
        onClose={onCloseVer}
      >
        <ProductosForm
          key={selectedProducto?.id_producto ?? "ver"}
          modo="VER"
          initialProducto={selectedProducto}
          onSuccess={() => {}}
          onCancel={onCloseVer}
        />
      </ProductosModalForm>

      {/* MODAL: PRECIOS */}
      <ProductosModalForm
        open={openPrecios}
        title={`Precios: ${precioTarget?.nombre ?? ""}`}
        theme={theme}
        onClose={onClosePrecios}
      >
        {precioTarget ? (
          <ProductoPreciosModal
            theme={theme}
            producto={precioTarget}
            onClose={onClosePrecios}
          />
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            No se encontró el producto para administrar precios.
          </div>
        )}
      </ProductosModalForm>

      {/* CONFIRM: CAMBIAR ESTATUS */}
      <ConfirmActionModal
        open={openConfirmEstatus}
        title="¡Atención!"
        variant={confirmVariant}
        message={
          <span>
            ¿Estás seguro de cambiar el estatus de{" "}
            <span className="font-extrabold">
              {productoEstatusTarget?.nombre ?? ""}
            </span>{" "}
            a <span className="font-extrabold">{estatusNuevo}</span>?
          </span>
        }
        cancelText="Cancelar"
        confirmText={confirmText}
        loading={savingEstatus}
        onCancel={onCancelConfirm}
        onConfirm={onConfirmEstatus}
      />
    </>
  );
}
