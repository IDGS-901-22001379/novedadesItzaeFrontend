// src/modules/traspasos/pages/traspasos/form/TraspasosFormReadonlyInfo.tsx

import type { TraspasoDetalle } from "../../../types/traspasos.types";

type Props = {
  modo: "CREAR" | "VER";
  initialTraspaso: TraspasoDetalle | null;
  ubicacionLabelById: Map<number, string>;
};

export default function TraspasosFormReadonlyInfo({
  modo,
  initialTraspaso,
  ubicacionLabelById,
}: Props) {
  if (modo !== "VER" || !initialTraspaso) return null;

  return (
    <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="text-xs font-extrabold text-black/50">
          ID Movimiento
        </div>
        <div className="text-sm font-semibold text-black/80">
          {initialTraspaso.id_movimiento}
        </div>

        <div className="text-xs font-extrabold text-black/50">Tipo</div>
        <div className="text-sm font-semibold text-black/80">
          {initialTraspaso.tipo}
        </div>

        <div className="text-xs font-extrabold text-black/50">Fecha y hora</div>
        <div className="text-sm font-semibold text-black/80">
          {initialTraspaso.fecha_hora}
        </div>

        <div className="text-xs font-extrabold text-black/50">ID Usuario</div>
        <div className="text-sm font-semibold text-black/80">
          {initialTraspaso.id_usuario}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Ubicación origen
        </div>
        <div className="text-sm font-semibold text-black/80">
          {ubicacionLabelById.get(initialTraspaso.id_ubicacion_origen) ||
            initialTraspaso.id_ubicacion_origen}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Ubicación destino
        </div>
        <div className="text-sm font-semibold text-black/80">
          {ubicacionLabelById.get(initialTraspaso.id_ubicacion_destino) ||
            initialTraspaso.id_ubicacion_destino}
        </div>
      </div>
    </div>
  );
}
