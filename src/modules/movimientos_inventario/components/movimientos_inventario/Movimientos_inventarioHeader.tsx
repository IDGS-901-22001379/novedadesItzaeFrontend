// src/modules/movimientos_inventario/components/movimientos_inventario/Movimientos_inventarioHeader.tsx
// Encabezado de la pantalla Movimientos de Inventario.
// Responsabilidades: título, resumen centrado y botón principal (recargar).
// Nota: mantiene el mismo estilo visual que UsuariosHeader.

import type { MovimientosInventarioTheme } from "../../theme/movimientosInventarioTheme";

type Props = {
  theme: MovimientosInventarioTheme;
  resumen: {
    total: number;
    compras: number;
    ventas: number;
    ajustes: number;
  };
  loading: boolean;
  onReload: () => void;
};

export default function Movimientos_inventarioHeader({
  resumen,
  loading,
  onReload,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      {/* Izquierda: título */}
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Movimientos de inventario
        </h1>
      </div>

      {/* Centro: resumen */}
      <div className="sm:justify-self-center">
        <div className="text-center text-lg font-extrabold tracking-tight opacity-95">
          <span>
            Total: <span className="font-extrabold">{resumen.total}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Compras: <span className="font-extrabold">{resumen.compras}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Ventas: <span className="font-extrabold">{resumen.ventas}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Ajustes: <span className="font-extrabold">{resumen.ajustes}</span>
          </span>
        </div>
      </div>

      {/* Derecha: botón principal */}
      <div className="sm:justify-self-end">
        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          className={[
            "rounded-xl px-4 py-2 text-sm font-extrabold shadow-sm transition disabled:opacity-50",
            "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]",
          ].join(" ")}
        >
          {loading ? "Cargando..." : "Recargar"}
        </button>
      </div>
    </div>
  );
}
