// src/modules/ventas/pages/ventas/VentasDetail.tsx
// Vista de detalle de una venta.
// Responsabilidades:
// - Mostrar la venta en modo solo lectura.
// - Separar la visualización del formulario de creación.
// - Mantener visibles las acciones futuras como imprimir, facturar y crédito.

import { useMemo, useState } from "react";
import type { VentaObtenerResponse } from "../../types";

import VentasFormGeneral from "./form/VentasFormGeneral";
import VentasFormFacturacion from "./form/VentasFormFacturacion";
import VentasFormDetalles from "./form/VentasFormDetalles";
import VentasFormPagos from "./form/VentasFormPagos";
import VentasFormSummary from "./form/VentasFormSummary";
import VentasFormInfo from "./form/VentasFormInfo";
import VentasFormActions from "./form/VentasFormActions";
import {
  buildInitialForm,
  calcDetalleImporte,
  calcDetalleImpuesto,
  formatDate,
} from "./form/ventasForm.utils";

type Props = {
  item: VentaObtenerResponse | null;
};

export default function VentasDetail({ item }: Props) {
  const [msgInfoAccion, setMsgInfoAccion] = useState("");

  // Construye una versión local del estado para reutilizar los bloques visuales
  // del formulario, pero siempre en modo solo lectura.
  const form = useMemo(() => buildInitialForm("VER", item), [item]);

  // Calcula los totales del detalle para mostrarlos en el resumen.
  const subtotal = useMemo(() => {
    return form.detalles.reduce(
      (acc, d) => acc + Number(d.cantidad) * Number(d.precio_unitario),
      0,
    );
  }, [form.detalles]);

  const descuentoTotal = useMemo(() => {
    return form.detalles.reduce((acc, d) => acc + Number(d.descuento), 0);
  }, [form.detalles]);

  const impuestosTotal = useMemo(() => {
    return form.detalles.reduce((acc, d) => acc + calcDetalleImpuesto(d), 0);
  }, [form.detalles]);

  const total = useMemo(() => {
    return form.detalles.reduce((acc, d) => acc + calcDetalleImporte(d), 0);
  }, [form.detalles]);

  const montoPagado = useMemo(() => {
    return form.pagos.reduce((acc, p) => acc + Number(p.monto), 0);
  }, [form.pagos]);

  const cambio = useMemo(() => {
    return Math.max(0, montoPagado - total);
  }, [montoPagado, total]);

  function accionPendiente(nombre: string) {
    setMsgInfoAccion(`${nombre}: aún se está trabajando en ello.`);
  }

  if (!item?.venta) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
        No se encontró información de la venta para visualizar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">
        Visualizar venta: {item.venta.folio || `Venta #${item.venta.id_venta}`}
      </div>

      {msgInfoAccion ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          {msgInfoAccion}
        </div>
      ) : null}

      <VentasFormGeneral
        form={form}
        setForm={() => {}}
        readOnly={true}
        onToggleFacturacion={() => {}}
      />

      <VentasFormFacturacion form={form} readOnly={true} />

      <VentasFormDetalles
        detalles={form.detalles}
        readOnly={true}
        onUpdateDetalle={() => {}}
        onAgregarDetalle={() => {}}
        onEliminarDetalle={() => {}}
        calcDetalleImporte={calcDetalleImporte}
      />

      <VentasFormPagos
        pagos={form.pagos}
        readOnly={true}
        onUpdatePago={() => {}}
        onAgregarPago={() => {}}
        onEliminarPago={() => {}}
      />

      <VentasFormSummary
        subtotal={subtotal}
        descuentoTotal={descuentoTotal}
        impuestosTotal={impuestosTotal}
        total={total}
        cambio={cambio}
      />

      <VentasFormInfo venta={item} formatDate={formatDate} />

      <VentasFormActions
        onImprimir={() => accionPendiente("Imprimir venta")}
        onFacturar={() => accionPendiente("Mandar a facturar")}
        onCredito={() => accionPendiente("Mandar venta a crédito")}
      />
    </div>
  );
}
