// src/modules/clientes_tipos/components/clientes_tipos/ClientesTiposHeader.tsx
// Encabezado de la pantalla Clientes Tipos.
// Responsabilidades: título, resumen centrado y botón principal (nuevo tipo de cliente).
// Nota: mantiene el estilo de Usuarios, pero con tamaño más pequeño y centrado.

import type { ClientesTiposTheme } from "../../theme/clientesTiposTheme";

type Props = {
  theme: ClientesTiposTheme;
  resumen: { total: number; activos: number; inactivos: number };
  loading: boolean;
  onNuevo: () => void;
};

export default function ClientesTiposHeader({
  resumen,
  loading,
  onNuevo,
}: Props) {
  return (
    <div className="mx-auto max-w-4xl grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      {/* Izquierda: título */}
      <div className="text-center sm:text-left sm:justify-self-start">
        <h1 className="text-xl font-extrabold tracking-tight">
          Tipos de cliente
        </h1>
      </div>

      {/* Centro: resumen */}
      <div className="sm:justify-self-center">
        <div className="text-sm sm:text-base font-extrabold tracking-tight opacity-95 text-center">
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

      {/* Derecha: botón */}
      <div className="text-center sm:text-right sm:justify-self-end">
        <button
          type="button"
          onClick={onNuevo}
          disabled={loading}
          className={[
            "rounded-xl px-4 py-2 text-sm font-extrabold shadow-sm transition disabled:opacity-50",
            "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]",
          ].join(" ")}
        >
          Nuevo tipo
        </button>
      </div>
    </div>
  );
}
