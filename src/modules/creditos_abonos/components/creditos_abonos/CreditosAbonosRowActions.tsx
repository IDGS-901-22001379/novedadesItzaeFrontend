// src/modules/creditos_abonos/components/creditos_abonos/CreditosAbonosRowActions.tsx
// Acciones por fila en la tabla de Créditos Abonos.
// Responsabilidades: renderizar botones Ver/Editar y Cancelar según estatus.
// Nota UI: el botón de cancelar usa ancho fijo para que no se mueva el layout.

import type { CreditoAbonoResumen } from "../../types/creditos_abonos.types";

type Props = {
  abono: CreditoAbonoResumen;
  onVer: (abono: CreditoAbonoResumen) => void;
  onEditar: (abono: CreditoAbonoResumen) => void;
  onCancelar: (abono: CreditoAbonoResumen) => void;
};

export default function CreditosAbonosRowActions({
  abono,
  onVer,
  onEditar,
  onCancelar,
}: Props) {
  const isCancelado = abono.estatus === "CANCELADO";

  const btnCancelarClass = isCancelado
    ? "bg-slate-300 text-slate-600 cursor-not-allowed"
    : "bg-red-500 text-white hover:bg-red-600";

  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => onVer(abono)}
        className="w-20 rounded-lg bg-[#2B6CB0] px-3 py-1.5 text-center text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>

      <button
        type="button"
        onClick={() => onEditar(abono)}
        disabled={isCancelado}
        className={[
          "w-20 rounded-lg px-3 py-1.5 text-center text-xs font-extrabold",
          isCancelado
            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
            : "bg-[#ECC94B] text-[#1A202C] hover:opacity-90",
        ].join(" ")}
      >
        Editar
      </button>

      <button
        type="button"
        onClick={() => {
          if (isCancelado) return;
          onCancelar(abono);
        }}
        disabled={isCancelado}
        className={`w-24 rounded-lg px-3 py-1.5 text-center text-xs font-extrabold shadow-sm ${btnCancelarClass}`}
        title={isCancelado ? "Ya cancelado" : "Cancelar"}
      >
        {isCancelado ? "Cancelado" : "Cancelar"}
      </button>
    </div>
  );
}
