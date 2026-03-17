// src/modules/traspasos/components/traspasos/TraspasosHeader.tsx
// Encabezado de la pantalla Traspasos.
// Responsabilidades: título, resumen centrado y botón principal (nuevo traspaso).
// Nota: se conserva la misma estructura visual del módulo Usuarios.

import type { TraspasosTheme } from "../../theme/traspasosTheme";

type Props = {
  theme: TraspasosTheme;
  resumen: {
    total: number;
    totalPagina: number;
    conNotas: number;
    sinNotas: number;
  };
  loading: boolean;
  onNuevo: () => void;
};

export default function TraspasosHeader({ resumen, loading, onNuevo }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      {/* Izquierda: título más grande */}
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">Traspasos</h1>
      </div>

      {/* Centro: resumen centrado y mismo nivel visual */}
      <div className="sm:justify-self-center">
        <div className="text-lg font-extrabold tracking-tight opacity-95 text-center">
          <span>
            Total: <span className="font-extrabold">{resumen.total}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Página:{" "}
            <span className="font-extrabold">{resumen.totalPagina}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Con notas:{" "}
            <span className="font-extrabold">{resumen.conNotas}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Sin notas:{" "}
            <span className="font-extrabold">{resumen.sinNotas}</span>
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
          Nuevo traspaso
        </button>
      </div>
    </div>
  );
}
