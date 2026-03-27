// src/modules/ventas/pages/ventas/form/VentasFormSummary.tsx
// Bloque resumen de la venta.
// Responsabilidades:
// - Mostrar subtotal, descuento, impuestos y total.
// - Mantener separado el cálculo visual del resto del formulario.

import { formatMoney } from "./ventasForm.utils";

type Props = {
  subtotal: number;
  descuentoTotal: number;
  impuestosTotal: number;
  total: number;
};

export default function VentasFormSummary({
  subtotal,
  descuentoTotal,
  impuestosTotal,
  total,
}: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 text-sm font-extrabold text-black/70">
        Resumen de la venta
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-black/10 bg-black/3 px-4 py-3">
          <div className="text-xs font-extrabold text-black/50">Subtotal</div>
          <div className="text-base font-extrabold text-black/80">
            {formatMoney(subtotal)}
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-black/3 px-4 py-3">
          <div className="text-xs font-extrabold text-black/50">Descuento</div>
          <div className="text-base font-extrabold text-black/80">
            {formatMoney(descuentoTotal)}
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-black/3 px-4 py-3">
          <div className="text-xs font-extrabold text-black/50">Impuestos</div>
          <div className="text-base font-extrabold text-black/80">
            {formatMoney(impuestosTotal)}
          </div>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <div className="text-xs font-extrabold text-green-700">Total</div>
          <div className="text-base font-extrabold text-green-800">
            {formatMoney(total)}
          </div>
        </div>
      </div>
    </div>
  );
}
