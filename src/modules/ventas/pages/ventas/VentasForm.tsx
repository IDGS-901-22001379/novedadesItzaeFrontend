// src/modules/ventas/pages/ventas/VentasForm.tsx
// Formulario principal de ventas.
// Responsabilidades:
// - Conectar el hook del formulario.
// - Renderizar bloques separados de captura.
// - Mostrar información adicional en modo visualización.
// - Abrir el modal de cobro antes de registrar la venta.
// - Después de confirmar el cobro, mostrar la vista previa del ticket.
// - Integrar el flujo de caja/apertura dentro del formulario.

import { useState } from "react";

import type { VentasFormProps } from "./form/ventasForm.types";

import { useVentasForm } from "./form/useVentasForm";
import VentasFormGeneral from "./form/VentasFormGeneral";
import VentasFormDetalles from "./form/VentasFormDetalles";
import VentasFormSummary from "./form/VentasFormSummary";
import VentasFormInfo from "./form/VentasFormInfo";
import VentasFormActions from "./form/VentasFormActions";
import VentasFormToolbar from "./form/VentasFormToolbar";
import VentasCobroModal from "./form/VentasCobroModal";
import { VentasFormAbrirAperturaModal } from "./form/ventasFormAperturas";

import {
  buildTiketFromVentaResponse,
  TiketPreviewModal,
  type TiketData,
} from "./form/tiket";

export type { VentasFormModo } from "./form/ventasForm.types";

export default function VentasForm(props: VentasFormProps) {
  const vm = useVentasForm(props);

  const [ticketPreviewOpen, setTicketPreviewOpen] = useState(false);
  const [ticketData, setTicketData] = useState<TiketData | null>(null);

  function handleOpenTicketPreviewFromVentaActual() {
    if (!props.initialVenta) {
      vm.accionPendiente("No hay información de la venta para imprimir");
      return;
    }

    const tiket = buildTiketFromVentaResponse(props.initialVenta);
    setTicketData(tiket);
    setTicketPreviewOpen(true);
  }

  function handleCloseTicketPreview() {
    setTicketPreviewOpen(false);
    setTicketData(null);

    // Solo después de crear/cobrar una venta nueva
    if (props.modo === "CREAR") {
      props.onSuccess();
    }
  }

  async function handleConfirmarCobro() {
    const response = await vm.guardar();

    if (!response) return;

    const tiket = buildTiketFromVentaResponse({
      venta: response.venta,
      detalles: response.detalles,
      pagos: response.pagos,
    });

    setTicketData(tiket);
    setTicketPreviewOpen(true);
  }

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
        clienteQuery={vm.clienteQuery}
        setClienteQuery={vm.setClienteQuery}
        clienteResults={vm.clienteResults}
        clienteSearching={vm.clienteSearching}
        onSelectCliente={vm.selectCliente}
        onClearClienteResults={vm.clearClienteSearchResults}
        aperturaVm={vm.aperturaVm}
        onAbrirCaja={() => void vm.abrirCajaDesdeVentas()}
      />

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
            onImprimir={handleOpenTicketPreviewFromVentaActual}
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
        onConfirmar={() => void handleConfirmarCobro()}
        onImprimir={() =>
          vm.accionPendiente("Primero confirma el cobro para ver el ticket")
        }
        onUpdatePago={vm.updatePago}
        onAgregarPago={vm.agregarPago}
        onEliminarPago={vm.eliminarPago}
      />

      <TiketPreviewModal
        open={ticketPreviewOpen}
        data={ticketData}
        title="Vista previa del ticket"
        onClose={handleCloseTicketPreview}
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
