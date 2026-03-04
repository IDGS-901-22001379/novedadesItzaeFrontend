// src/modules/clientes_fiscales/components/clientes_fiscales/ClientesFiscalesHeader.tsx
// Encabezado de la pantalla Clientes Fiscales.
// Responsabilidades: título, resumen centrado y botón principal (nuevo).
// MISMO diseño que UsuariosHeader.

import type { ClientesFiscalesTheme } from "../../theme/clientesFiscalesTheme";

type Props = {
  theme: ClientesFiscalesTheme;
  resumen: {
    total: number;
    activos: number;
    inactivos: number;
    predeterminados: number;
  };
  loading: boolean;
  onNuevo: () => void;
};

export default function ClientesFiscalesHeader({
  resumen,
  loading,
  onNuevo,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      {/* Izquierda: título más grande */}
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Clientes fiscales
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
            Activos: <span className="font-extrabold">{resumen.activos}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Inactivos:{" "}
            <span className="font-extrabold">{resumen.inactivos}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Predet.:{" "}
            <span className="font-extrabold">{resumen.predeterminados}</span>
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
          Nuevo cliente fiscal
        </button>
      </div>
    </div>
  );
}
