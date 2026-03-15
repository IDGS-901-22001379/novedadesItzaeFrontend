// src/modules/inventario_existencias/components/inventario_existencias/InventarioExistenciasHeader.tsx
// Encabezado de la pantalla Inventario Existencias.
// Responsabilidades: título y resumen centrado.

import type { InventarioExistenciasTheme } from "../../theme/inventarioExistenciasTheme";

type Props = {
  theme: InventarioExistenciasTheme;
  resumen: {
    totalRegistros: number;
    conExistencia: number;
    sinExistencia: number;
  };
  loading: boolean;
  onNuevo: () => void;
};

export default function InventarioExistenciasHeader({ resumen }: Props) {
  return (
    <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3">
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">Existencias</h1>
      </div>

      <div className="sm:justify-self-center">
        <div className="text-center text-lg font-extrabold tracking-tight opacity-95">
          <span>
            Registros:{" "}
            <span className="font-extrabold">{resumen.totalRegistros}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Con existencia:{" "}
            <span className="font-extrabold">{resumen.conExistencia}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Sin existencia:{" "}
            <span className="font-extrabold">{resumen.sinExistencia}</span>
          </span>
        </div>
      </div>

      <div className="hidden sm:block" />
    </div>
  );
}
