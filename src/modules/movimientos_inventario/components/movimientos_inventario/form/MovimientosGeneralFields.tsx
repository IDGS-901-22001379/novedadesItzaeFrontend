// src/modules/movimientos_inventario/components/movimientos_inventario/form/MovimientosGeneralFields.tsx
// Campos generales del formulario de Movimientos de Inventario.
// Responsabilidades:
// - mostrar la información principal del movimiento en solo lectura
// - traducir ids a nombres amigables cuando existan en los mapas

import type { MovimientoInventario } from "../../../types/movimientos_inventario.types";

type Props = {
  movimiento: MovimientoInventario;
  usuariosMap: Record<number, string>;
  ubicacionesMap: Record<number, string>;
};

function formatFecha(fecha?: string | null): string {
  if (!fecha) return "-";

  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;

  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatReferencia(
  referencia_tipo?: string | null,
  referencia_id?: number | null,
): string {
  if (!referencia_tipo && !referencia_id) return "-";
  if (referencia_tipo && referencia_id) {
    return `${referencia_tipo} #${referencia_id}`;
  }
  if (referencia_tipo) return referencia_tipo;
  return `#${referencia_id}`;
}

function getTipoLabel(tipo?: string | null): string {
  switch (tipo) {
    case "COMPRA":
      return "COMPRA";
    case "VENTA":
      return "VENTA";
    case "AJUSTE":
      return "AJUSTE";
    case "MERMA":
      return "MERMA";
    case "TRASPASO":
      return "TRASPASO";
    case "DEVOLUCION":
      return "DEVOLUCIÓN";
    case "OTRO":
      return "OTRO";
    default:
      return tipo ?? "-";
  }
}

export default function MovimientosGeneralFields({
  movimiento,
  usuariosMap,
  ubicacionesMap,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div>
        <div className="text-xs font-extrabold text-black/50">Tipo</div>
        <div className="text-sm font-semibold text-black/80">
          {getTipoLabel(movimiento.tipo)}
        </div>
      </div>

      <div>
        <div className="text-xs font-extrabold text-black/50">Fecha</div>
        <div className="text-sm font-semibold text-black/80">
          {formatFecha(movimiento.fecha_hora)}
        </div>
      </div>

      <div>
        <div className="text-xs font-extrabold text-black/50">Usuario</div>
        <div className="text-sm font-semibold text-black/80">
          {movimiento.id_usuario != null
            ? (usuariosMap[movimiento.id_usuario] ??
              `Usuario #${movimiento.id_usuario}`)
            : "-"}
        </div>
      </div>

      <div>
        <div className="text-xs font-extrabold text-black/50">Referencia</div>
        <div className="text-sm font-semibold text-black/80">
          {formatReferencia(
            movimiento.referencia_tipo,
            movimiento.referencia_id,
          )}
        </div>
      </div>

      <div>
        <div className="text-xs font-extrabold text-black/50">
          Ubicación origen
        </div>
        <div className="text-sm font-semibold text-black/80">
          {movimiento.id_ubicacion_origen != null
            ? (ubicacionesMap[movimiento.id_ubicacion_origen] ??
              `Ubicación #${movimiento.id_ubicacion_origen}`)
            : "-"}
        </div>
      </div>

      <div>
        <div className="text-xs font-extrabold text-black/50">
          Ubicación destino
        </div>
        <div className="text-sm font-semibold text-black/80">
          {movimiento.id_ubicacion_destino != null
            ? (ubicacionesMap[movimiento.id_ubicacion_destino] ??
              `Ubicación #${movimiento.id_ubicacion_destino}`)
            : "-"}
        </div>
      </div>

      <div>
        <div className="text-xs font-extrabold text-black/50">Creado en</div>
        <div className="text-sm font-semibold text-black/80">
          {formatFecha(movimiento.creado_en)}
        </div>
      </div>

      <div>
        <div className="text-xs font-extrabold text-black/50">
          ID movimiento
        </div>
        <div className="text-sm font-semibold text-black/80">
          {movimiento.id_movimiento}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="text-xs font-extrabold text-black/50">Notas</div>
        <div className="min-h-11 rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm font-semibold text-black/80">
          {movimiento.notas?.trim() || "-"}
        </div>
      </div>
    </div>
  );
}
