import { formatMoney } from "./comprasForm.utils";

type Props = {
  resumen: {
    subtotal: number;
    descuentoTotal: number;
    impuestosTotal: number;
    total: number;
  };
};

export default function ComprasFormSummary({ resumen }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <div className="rounded-2xl border border-black/10 bg-black/5 p-3">
        <div className="text-xs font-extrabold text-black/50">Subtotal</div>
        <div className="mt-1 text-lg font-extrabold text-black/80">
          {formatMoney(resumen.subtotal)}
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-black/5 p-3">
        <div className="text-xs font-extrabold text-black/50">Descuento</div>
        <div className="mt-1 text-lg font-extrabold text-black/80">
          {formatMoney(resumen.descuentoTotal)}
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-black/5 p-3">
        <div className="text-xs font-extrabold text-black/50">Impuestos</div>
        <div className="mt-1 text-lg font-extrabold text-black/80">
          {formatMoney(resumen.impuestosTotal)}
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-green-50 p-3">
        <div className="text-xs font-extrabold text-green-700">Total</div>
        <div className="mt-1 text-lg font-extrabold text-green-800">
          {formatMoney(resumen.total)}
        </div>
      </div>
    </div>
  );
}
