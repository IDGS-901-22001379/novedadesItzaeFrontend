// src/modules/empleados/components/empleados/EmpleadosHeader.tsx
// Encabezado de la pantalla Empleados.
// Responsabilidades: título, resumen centrado, botón principal (nuevo empleado) y recargar.
// Nota: el resumen queda centrado en medio, y el botón usa verde #34f334.

import type { EmpleadosTheme } from "../../theme/empleadosTheme";

type Props = {
  theme: EmpleadosTheme;
  resumen: { total: number; activos: number; inactivos: number };
  loading: boolean;
  onNuevo: () => void;
  onReload: () => void;
};

export default function EmpleadosHeader({
  resumen,
  loading,
  onNuevo,
  onReload,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      {/* Izquierda: título más grande */}
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">Empleados</h1>
      </div>

      {/* Centro: resumen centrado y mismo nivel visual */}
      <div className="sm:justify-self-center">
        <div className="text-lg font-extrabold tracking-tight opacity-95 text-center">
          <span>
            Total: <span className="font-extrabold">{resumen.total}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Activos: <span className="font-extrabold">{resumen.activos}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Inactivos:{" "}
            <span className="font-extrabold">{resumen.inactivos}</span>
          </span>
        </div>
      </div>

      {/* Derecha: acciones */}
      <div className="flex gap-2 sm:justify-self-end">
        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-extrabold text-white hover:bg-white/15 disabled:opacity-50"
          title="Recargar"
        >
          Recargar
        </button>

        <button
          type="button"
          onClick={onNuevo}
          disabled={loading}
          className={[
            "rounded-xl px-4 py-2 text-sm font-extrabold shadow-sm transition disabled:opacity-50",
            "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]",
          ].join(" ")}
        >
          Nuevo empleado
        </button>
      </div>
    </div>
  );
}
