// src/modules/movimientos_inventario/components/movimientos_inventario/MovimientoTipoBadge.tsx
// Badge visual para tipo de movimiento.
// Responsabilidades: pintar cada tipo con un color fácil de distinguir.

import type { MovimientoInventarioTipo } from "../../types/movimientos_inventario.types";
import type { MovimientosInventarioTheme } from "../../theme/movimientosInventarioTheme";

type Props = {
  theme: MovimientosInventarioTheme;
  tipo: MovimientoInventarioTipo;
};

function getTipoLabel(tipo: MovimientoInventarioTipo): string {
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
      return String(tipo);
  }
}

function getTipoClasses(tipo: MovimientoInventarioTipo): string {
  switch (tipo) {
    case "COMPRA":
      return "bg-blue-100 text-blue-800";
    case "VENTA":
      return "bg-emerald-100 text-emerald-800";
    case "AJUSTE":
      return "bg-amber-100 text-amber-800";
    case "MERMA":
      return "bg-orange-100 text-orange-800";
    case "TRASPASO":
      return "bg-violet-100 text-violet-800";
    case "DEVOLUCION":
      return "bg-cyan-100 text-cyan-800";
    case "OTRO":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function MovimientoTipoBadge({ theme, tipo }: Props) {
  void theme;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold",
        getTipoClasses(tipo),
      ].join(" ")}
    >
      {getTipoLabel(tipo)}
    </span>
  );
}
