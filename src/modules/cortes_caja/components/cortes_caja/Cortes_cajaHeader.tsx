// src/modules/cortes_caja/components/cortes_caja/Cortes_cajaHeader.tsx
// Encabezado de la pantalla Cortes de Caja.
// Se encarga de mostrar el título, el resumen de aperturas y el botón principal para abrir una nueva caja.

import type { CortesCajaTheme } from "../../theme/cortesCajaTheme";

type Props = {
  theme: CortesCajaTheme;
  resumen: { total: number; abiertas: number; cerradas: number };
  loading: boolean;
  onNuevo: () => void;
};

export default function Cortes_cajaHeader({
  resumen,
  loading,
  onNuevo,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Cortes de caja
        </h1>
      </div>

      <div className="sm:justify-self-center">
        <div className="text-center text-lg font-extrabold tracking-tight opacity-95">
          <span>
            Total: <span className="font-extrabold">{resumen.total}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Abiertas: <span className="font-extrabold">{resumen.abiertas}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Cerradas: <span className="font-extrabold">{resumen.cerradas}</span>
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
          Nueva apertura
        </button>
      </div>
    </div>
  );
}
