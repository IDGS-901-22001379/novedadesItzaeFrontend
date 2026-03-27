// src/modules/ventas/components/ventas/VentasHeader.tsx
// Encabezado de la pantalla Ventas.
// Responsabilidades: título, resumen centrado y botón principal (nueva venta).
// Nota: mantiene la misma estructura visual que Usuarios.

import type { VentasTheme } from "../../theme/ventasTheme";

type Props = {
  theme: VentasTheme;
  resumen: {
    total: number;
    completadas: number;
    canceladas: number;
    totalImporte: number;
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

export default function VentasHeader({ resumen, loading, onNuevo }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      {/* Izquierda: título */}
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">Ventas</h1>
      </div>

      {/* Centro: resumen */}
      <div className="sm:justify-self-center">
        <div className="text-center text-lg font-extrabold tracking-tight opacity-95">
          <span>
            Total: <span className="font-extrabold">{resumen.total}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Completadas:{" "}
            <span className="font-extrabold">{resumen.completadas}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Canceladas:{" "}
            <span className="font-extrabold">{resumen.canceladas}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Importe:{" "}
            <span className="font-extrabold">
              {formatMoney(resumen.totalImporte)}
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
          Nueva venta
        </button>
      </div>
    </div>
  );
}
