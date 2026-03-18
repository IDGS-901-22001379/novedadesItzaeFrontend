// src/modules/compras/components/compras/ComprasHeader.tsx
// Encabezado de la pantalla Compras.
// Responsabilidades: título, resumen centrado y botón principal (nueva compra).

import type { ComprasTheme } from "../../theme/comprasTheme";

type Props = {
  theme: ComprasTheme;
  resumen: {
    totalCompras: number;
    subtotalTotal: number;
    montoTotal: number;
  };
  loading: boolean;
  onNuevo: () => void;
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value || 0);
}

export default function ComprasHeader({ resumen, loading, onNuevo }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      {/* Izquierda: título */}
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">Compras</h1>
      </div>

      {/* Centro: resumen */}
      <div className="sm:justify-self-center">
        <div className="text-center text-lg font-extrabold tracking-tight opacity-95">
          <span>
            Total:{" "}
            <span className="font-extrabold">{resumen.totalCompras}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Subtotal:{" "}
            <span className="font-extrabold">
              {formatMoney(resumen.subtotalTotal)}
            </span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Monto total:{" "}
            <span className="font-extrabold">
              {formatMoney(resumen.montoTotal)}
            </span>
          </span>
        </div>
      </div>

      {/* Derecha: botón principal */}
      <div className="sm:justify-self-end">
        <button
          type="button"
          onClick={onNuevo}
          disabled={loading}
          className={[
            "rounded-xl px-4 py-2 text-sm font-extrabold shadow-sm transition disabled:opacity-50",
            "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]",
          ].join(" ")}
        >
          Nueva compra
        </button>
      </div>
    </div>
  );
}
