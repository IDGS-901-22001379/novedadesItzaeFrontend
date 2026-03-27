// src/modules/ventas/pages/ventas/form/cobro/CobroResumen.tsx

import { formatMoney } from "./cobro.utils";

type Props = {
  subtotal: number;
  descuentoTotal: number;
  impuestosTotal: number;
  total: number;
  montoPagado: number;
  cambio: number;
};

export default function CobroResumen({
  subtotal,
  descuentoTotal,
  impuestosTotal,
  total,
  montoPagado,
  cambio,
}: Props) {
  const restante = Math.max(0, total - montoPagado);

  return (
    <div className="space-y-2 rounded-2xl border border-black/10 bg-[#fafafa] p-4">
      <div className="flex items-center justify-between text-sm font-semibold text-black/70">
        <span>Subtotal</span>
        <span>{formatMoney(subtotal)}</span>
      </div>

      <div className="flex items-center justify-between text-sm font-semibold text-black/70">
        <span>Descuento</span>
        <span>{formatMoney(descuentoTotal)}</span>
      </div>

      <div className="flex items-center justify-between text-sm font-semibold text-black/70">
        <span>Impuestos</span>
        <span>{formatMoney(impuestosTotal)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-base font-extrabold text-green-800">
        <span>Total</span>
        <span>{formatMoney(total)}</span>
      </div>

      <div className="flex items-center justify-between text-sm font-semibold text-blue-700">
        <span>Total pagado</span>
        <span>{formatMoney(montoPagado)}</span>
      </div>

      <div className="flex items-center justify-between text-sm font-semibold text-amber-700">
        <span>Restante</span>
        <span>{formatMoney(restante)}</span>
      </div>

      <div className="flex items-center justify-between text-sm font-semibold text-sky-700">
        <span>Cambio</span>
        <span>{formatMoney(cambio)}</span>
      </div>
    </div>
  );
}
