// src/modules/devoluciones_cancelaciones/components/devoluciones_cancelaciones/DevolucionesRowActions.tsx

import type { Devolucion } from "../../types/devoluciones_cancelaciones.types";

type Props = {
  item: Devolucion;
  onVer: (item: Devolucion) => void;
  onEditar: (item: Devolucion) => void;
  onCambiarEstatus: (item: Devolucion) => void;
};

export default function DevolucionesRowActions({
  item,
  onVer,
  onEditar,
  onCambiarEstatus,
}: Props) {
  const estaAnulada = item.estatus === "ANULADA";

  return (
    <div className="flex justify-end gap-2">
      {/* VER */}
      <button
        type="button"
        onClick={() => onVer(item)}
        className="w-20 rounded-lg bg-[#2B6CB0] px-3 py-1.5 text-center text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>

      {/* EDITAR */}
      <button
        type="button"
        onClick={() => onEditar(item)}
        className="w-20 rounded-lg bg-[#ECC94B] px-3 py-1.5 text-center text-xs font-extrabold text-[#1A202C] hover:opacity-90"
      >
        Editar
      </button>

      {/* ANULAR / ANULADA */}
      <button
        type="button"
        onClick={() => {
          if (!estaAnulada) onCambiarEstatus(item);
        }}
        disabled={estaAnulada}
        className={[
          "w-24 rounded-lg px-3 py-1.5 text-center text-xs font-extrabold shadow-sm",
          estaAnulada
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600",
        ].join(" ")}
        title={
          estaAnulada ? "Esta devolución ya fue anulada" : "Anular devolución"
        }
      >
        {estaAnulada ? "Anulada" : "Anular"}
      </button>
    </div>
  );
}
