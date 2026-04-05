// src/modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/form/DevolucionesFormReadonly.tsx
// Bloque de visualización del formulario de Devoluciones/Cancelaciones.
// Responsabilidades:
// - Mostrar datos en solo lectura para modo VER.

import type { DevolucionDetail } from "../../../types/devoluciones_cancelaciones.types";
import type { DevolucionFormaPagoOption } from "../../../types/devoluciones_catalogos.types";
import type { DevolucionVentaOption } from "../../../types/devoluciones_ventas.types";
import type { UbicacionOption } from "./devolucionesForm.types";
import { formatFechaHora, formatMoney } from "./devolucionesForm.helpers";

type Props = {
  initialDevolucion: DevolucionDetail;
  ventaSeleccionada: DevolucionVentaOption | null;
  formaPagoSeleccionada: DevolucionFormaPagoOption | null;
  ubicacionSeleccionada: UbicacionOption | null;
};

export default function DevolucionesFormReadonly({
  initialDevolucion,
  ventaSeleccionada,
  formaPagoSeleccionada,
  ubicacionSeleccionada,
}: Props) {
  return (
    <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="text-xs font-extrabold text-black/50">Venta</div>
        <div className="text-sm font-semibold text-black/80">
          {ventaSeleccionada?.label ?? `Venta #${initialDevolucion.id_venta}`}
        </div>

        <div className="text-xs font-extrabold text-black/50">Fecha y hora</div>
        <div className="text-sm font-semibold text-black/80">
          {formatFechaHora(initialDevolucion.fecha_hora)}
        </div>

        <div className="text-xs font-extrabold text-black/50">Tipo</div>
        <div className="text-sm font-semibold text-black/80">
          {initialDevolucion.tipo}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Forma de pago
        </div>
        <div className="text-sm font-semibold text-black/80">
          {formaPagoSeleccionada?.label ??
            `Forma de pago #${initialDevolucion.id_forma_pago_reembolso}`}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Importe devuelto
        </div>
        <div className="text-sm font-semibold text-black/80">
          {formatMoney(initialDevolucion.importe_devuelto)}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Genera nota crédito
        </div>
        <div className="text-sm font-semibold text-black/80">
          {initialDevolucion.genera_nota_credito_interna ? "Sí" : "No"}
        </div>

        <div className="text-xs font-extrabold text-black/50">Disposición</div>
        <div className="text-sm font-semibold text-black/80">
          {initialDevolucion.disposicion}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Ubicación destino
        </div>
        <div className="text-sm font-semibold text-black/80">
          {ubicacionSeleccionada?.label ??
            `Ubicación #${initialDevolucion.id_ubicacion_destino}`}
        </div>

        <div className="text-xs font-extrabold text-black/50">Motivo</div>
        <div className="text-sm font-semibold text-black/80">
          {initialDevolucion.motivo}
        </div>

        <div className="text-xs font-extrabold text-black/50">Creado en</div>
        <div className="text-sm font-semibold text-black/80">
          {formatFechaHora(initialDevolucion.creado_en)}
        </div>
      </div>
    </div>
  );
}
