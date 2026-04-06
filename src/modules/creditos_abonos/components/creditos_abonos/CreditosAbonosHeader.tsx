// src/modules/creditos_abonos/components/creditos_abonos/CreditosAbonosHeader.tsx
// Encabezado de la pantalla Créditos Abonos.
// Responsabilidades: título, resumen centrado y botón principal (nuevo abono).
// Nota: el resumen queda centrado en medio, y el botón usa verde #34f334.

import type { CreditosAbonosTheme } from "../../theme/creditosAbonosTheme";

type Props = {
  theme: CreditosAbonosTheme;
  resumen: { total: number; registrados: number; cancelados: number };
  loading: boolean;
  onNuevo: () => void;
};

export default function CreditosAbonosHeader({
  resumen,
  loading,
  onNuevo,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      {/* Izquierda: título más grande */}
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Créditos y abonos
        </h1>
      </div>

      {/* Centro: resumen centrado y mismo nivel visual */}
      <div className="sm:justify-self-center">
        <div className="text-lg font-extrabold tracking-tight opacity-95 text-center">
          <span>
            Total: <span className="font-extrabold">{resumen.total}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Registrados:{" "}
            <span className="font-extrabold">{resumen.registrados}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Cancelados:{" "}
            <span className="font-extrabold">{resumen.cancelados}</span>
          </span>
        </div>
      </div>

      {/* Derecha: botón verde del ejemplo */}
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
          Nuevo abono
        </button>
      </div>
    </div>
  );
}
