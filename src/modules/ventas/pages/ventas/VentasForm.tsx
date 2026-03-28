// src/modules/ventas/pages/ventas/VentasForm.tsx
// Formulario principal de ventas.
// Responsabilidades:
// - Conectar el hook del formulario.
// - Renderizar bloques separados de captura.
// - Mostrar información adicional en modo visualización.
// - Abrir el modal de cobro antes de registrar la venta.
// - Integrar el flujo de caja/apertura dentro del formulario.

import type { VentasFormProps } from "./form/ventasForm.types";

import { useVentasForm } from "./form/useVentasForm";
import VentasFormGeneral from "./form/VentasFormGeneral";
import VentasFormFacturacion from "./form/VentasFormFacturacion";
import VentasFormDetalles from "./form/VentasFormDetalles";
import VentasFormSummary from "./form/VentasFormSummary";
import VentasFormInfo from "./form/VentasFormInfo";
import VentasFormActions from "./form/VentasFormActions";
import VentasFormToolbar from "./form/VentasFormToolbar";
import VentasCobroModal from "./form/VentasCobroModal";
import { VentasFormAbrirAperturaModal } from "./form/ventasFormAperturas";

export type { VentasFormModo } from "./form/ventasForm.types";

export default function VentasForm(props: VentasFormProps) {
  const vm = useVentasForm(props);

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">{vm.subtitulo}</div>

      {vm.msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {vm.msgError}
        </div>
      ) : null}

      {vm.msgInfoAccion ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          {vm.msgInfoAccion}
        </div>
      ) : null}

      <VentasFormGeneral
        form={vm.form}
        setForm={vm.setForm}
        readOnly={vm.readOnly}
        onToggleFacturacion={vm.toggleFacturacion}
        clienteQuery={vm.clienteQuery}
        setClienteQuery={vm.setClienteQuery}
        clienteResults={vm.clienteResults}
        clienteSearching={vm.clienteSearching}
        onSelectCliente={vm.selectCliente}
        onClearClienteResults={vm.clearClienteSearchResults}
        aperturaVm={vm.aperturaVm}
        onAbrirCaja={() => void vm.abrirCajaDesdeVentas()}
      />

      <VentasFormFacturacion form={vm.form} readOnly={vm.readOnly} />

      <VentasFormDetalles
        detalles={vm.form.detalles}
        readOnly={vm.readOnly}
        productoQuery={vm.productoQuery}
        setProductoQuery={vm.setProductoQuery}
        productosEncontrados={vm.productosEncontrados}
        loadingProductos={vm.loadingProductos}
        onSelectProducto={vm.selectProducto}
        onUpdateDetalle={vm.updateDetalle}
        onEliminarDetalle={vm.eliminarDetalle}
        calcDetalleImporte={vm.calcDetalleImporte}
        productosInfoMap={vm.productosInfoMap}
      />

      <VentasFormSummary
        subtotal={vm.subtotal}
        descuentoTotal={vm.descuentoTotal}
        impuestosTotal={vm.impuestosTotal}
        total={vm.total}
      />

      {props.modo === "VER" ? (
        <>
          <VentasFormInfo
            venta={props.initialVenta}
            formatDate={vm.formatDate}
          />

          <VentasFormActions
            onImprimir={() => vm.accionPendiente("Imprimir venta")}
            onFacturar={() => vm.accionPendiente("Mandar a facturar")}
            onCredito={() => vm.accionPendiente("Mandar venta a crédito")}
          />
        </>
      ) : null}

      <VentasFormToolbar
        modo={props.modo}
        saving={vm.saving}
        onCancel={props.onCancel}
        onGuardar={() => void vm.abrirCobro()}
      />

      <VentasCobroModal
        open={vm.cobroOpen}
        saving={vm.saving}
        detalles={vm.form.detalles}
        pagos={vm.form.pagos}
        subtotal={vm.subtotal}
        descuentoTotal={vm.descuentoTotal}
        impuestosTotal={vm.impuestosTotal}
        total={vm.total}
        montoPagado={vm.montoPagado}
        cambio={vm.cambio}
        formasPago={vm.formasPagoOptions}
        onClose={vm.cerrarCobro}
        onConfirmar={() => void vm.guardar()}
        onImprimir={() => vm.accionPendiente("Imprimir ticket")}
        onUpdatePago={vm.updatePago}
        onAgregarPago={vm.agregarPago}
        onEliminarPago={vm.eliminarPago}
      />

      <VentasFormAbrirAperturaModal
        open={vm.aperturaVm.modalAbrirAperturaOpen}
        loading={vm.aperturaVm.loadingApertura}
        msgError={vm.aperturaVm.msgAperturaError}
        form={vm.aperturaVm.abrirAperturaForm}
        setForm={vm.aperturaVm.setAbrirAperturaForm}
        onClose={vm.aperturaVm.cerrarModalNuevaApertura}
        onConfirm={() => void vm.confirmarAbrirCajaDesdeVentas()}
      />
    </div>
  );
}
