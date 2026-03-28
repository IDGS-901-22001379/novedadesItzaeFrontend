// src/modules/caja/components/caja/CajaHeader.tsx
// Encabezado de la pantalla Caja.
// Responsabilidades: título, resumen centrado y botón principal para registrar una nueva caja.
// Nota: el resumen queda centrado en medio, y el botón principal conserva el verde usado en otros módulos.

import type { CajaTheme } from "../../theme/cajaTheme";

type Props = {
  theme: CajaTheme;
  resumen: { total: number; activas: number; inactivas: number };
  loading: boolean;
  onNuevo: () => void;
};

export default function CajaHeader({ resumen, loading, onNuevo }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">Cajas</h1>
      </div>

      <div className="sm:justify-self-center">
        <div className="text-center text-lg font-extrabold tracking-tight opacity-95">
          <span>
            Total: <span className="font-extrabold">{resumen.total}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Activas: <span className="font-extrabold">{resumen.activas}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Inactivas:{" "}
            <span className="font-extrabold">{resumen.inactivas}</span>
          </span>
        </div>
      </div>

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
          Nueva caja
        </button>
      </div>
    </div>
  );
}
