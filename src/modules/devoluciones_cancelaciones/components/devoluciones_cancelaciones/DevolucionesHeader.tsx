// src/modules/devoluciones_cancelaciones/components/devoluciones_cancelaciones/DevolucionesHeader.tsx
// Encabezado de la pantalla Devoluciones/Cancelaciones.
// Responsabilidades: título, resumen centrado y botón principal (nueva devolución).
// Nota: el resumen queda centrado en medio, y el botón usa verde #34f334.

import type { DevolucionesCancelacionesTheme } from "../../theme/devolucionesCancelacionesTheme";

type Props = {
  theme: DevolucionesCancelacionesTheme;
  resumen: {
    total: number;
    totalDevoluciones: number;
    parciales: number;
    cancelaciones: number;
  };
  loading: boolean;
  onNuevo: () => void;
};

export default function DevolucionesHeader({
  resumen,
  loading,
  onNuevo,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      {/* Izquierda: título más grande */}
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Devoluciones y cancelaciones
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
            Totales:{" "}
            <span className="font-extrabold">{resumen.totalDevoluciones}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Parciales:{" "}
            <span className="font-extrabold">{resumen.parciales}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Cancelaciones:{" "}
            <span className="font-extrabold">{resumen.cancelaciones}</span>
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
          Nueva devolución
        </button>
      </div>
    </div>
  );
}
