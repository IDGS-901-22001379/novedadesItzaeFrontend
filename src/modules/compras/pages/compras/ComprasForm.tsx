// src/modules/compras/pages/compras/ComprasForm.tsx

import type { ComprasFormProps } from "./form/comprasForm.types";
import { useComprasForm } from "./form/useComprasForm";

import ComprasFormGeneral from "./form/ComprasFormGeneral";
import ComprasFormDetalle from "./form/ComprasFormDetalle";
import ComprasFormSummary from "./form/ComprasFormSummary";

export type { ComprasFormModo } from "./form/comprasForm.types";

export default function ComprasForm(props: ComprasFormProps) {
  const vm = useComprasForm(props);

  return (
    <div className="space-y-5">
      <div className="text-sm font-extrabold text-black/70">{vm.subtitulo}</div>

      {vm.msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {vm.msgError}
        </div>
      ) : null}

      <ComprasFormGeneral
        readOnly={vm.readOnly}
        form={vm.form}
        setForm={vm.setForm}
        ubicacionesDestino={vm.ubicacionesDestino}
        loadingUbicaciones={vm.loadingUbicaciones}
        onSelectUbicacion={vm.seleccionarUbicacionDestino}
        proveedorQuery={vm.proveedorQuery}
        setProveedorQuery={vm.setProveedorQuery}
        escribirProveedorQuery={vm.escribirProveedorQuery}
        proveedoresEncontrados={vm.proveedoresEncontrados}
        loadingProveedores={vm.loadingProveedores}
        onSelectProveedor={vm.seleccionarProveedor}
        onClearProveedor={vm.limpiarProveedorSeleccionado}
        viewProveedorLabel={props.initialProveedorLabel}
        viewUbicacionLabel={props.initialUbicacionLabel}
      />

      <ComprasFormDetalle
        readOnly={vm.readOnly}
        detalles={vm.detalles}
        updateDetalle={vm.updateDetalle}
        agregarRenglon={vm.agregarRenglon}
        eliminarRenglon={vm.eliminarRenglon}
        productoQuery={vm.productoQuery}
        setProductoQuery={vm.setProductoQuery}
        productosEncontrados={vm.productosEncontrados}
        loadingProductos={vm.loadingProductos}
        onSelectProducto={vm.agregarProductoSeleccionado}
        actualizarCantidad={vm.actualizarCantidad}
        actualizarCosto={vm.actualizarCosto}
        actualizarDescuento={vm.actualizarDescuento}
        actualizarImpuestos={vm.actualizarImpuestos}
      />

      <ComprasFormSummary resumen={vm.resumen} />

      {vm.readOnly ? (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={props.onCancel}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
          >
            Cerrar
          </button>
        </div>
      ) : (
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={props.onCancel}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void vm.guardar()}
            disabled={vm.saving}
            className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f] disabled:opacity-50"
          >
            {vm.saving ? "Guardando..." : "Registrar compra"}
          </button>
        </div>
      )}
    </div>
  );
}
