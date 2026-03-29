// src/modules/cortes_caja/components/cortes_caja/Cortes_cajaRowActions.tsx
// Acciones por fila en la tabla de Cortes de Caja.
// Se encarga de renderizar los botones de ver y cerrar según el estatus de la apertura.

import type { CorteCajaAperturaResumen } from "../../types";

type Props = {
  apertura: CorteCajaAperturaResumen;
  onVer: (apertura: CorteCajaAperturaResumen) => void;
  onCerrar: (apertura: CorteCajaAperturaResumen) => void;
};

export default function Cortes_cajaRowActions({
  apertura,
  onVer,
  onCerrar,
}: Props) {
  const isAbierta = apertura.estatus === "ABIERTA";

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => onVer(apertura)}
        className="w-20 rounded-lg bg-[#2B6CB0] px-3 py-1.5 text-center text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>

      {isAbierta ? (
        <button
          type="button"
          onClick={() => onCerrar(apertura)}
          className="w-24 rounded-lg bg-red-500 px-3 py-1.5 text-center text-xs font-extrabold text-white shadow-sm hover:bg-red-600"
          title="Cerrar"
        >
          Cerrar
        </button>
      ) : (
        <button
          type="button"
          disabled
          className="w-24 rounded-lg bg-slate-200 px-3 py-1.5 text-center text-xs font-extrabold text-slate-500 shadow-sm cursor-not-allowed"
          title="Cerrada"
        >
          Cerrada
        </button>
      )}
    </div>
  );
}
