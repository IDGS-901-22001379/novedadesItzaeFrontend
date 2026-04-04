// src/modules/facturacion_cfdi/components/facturacion_cfdi/FacturacionCfdiHeader.tsx
// Encabezado de la pantalla Facturación CFDI.
// Responsabilidades: título, resumen centrado y botón principal (emitir factura).
// Nota: el resumen queda centrado en medio, y el botón usa verde #34f334.

import type { FacturacionCfdiTheme } from "../../theme/facturacionCfdiTheme";

type Props = {
  theme: FacturacionCfdiTheme;
  resumen: {
    total: number;
    emitidas: number;
    canceladas: number;
    error: number;
  };
  loading: boolean;
  onNuevo: () => void;
};

export default function FacturacionCfdiHeader({
  resumen,
  loading,
  onNuevo,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
      <div className="sm:justify-self-start">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Facturación CFDI
        </h1>
      </div>

      <div className="sm:justify-self-center">
        <div className="text-lg font-extrabold tracking-tight opacity-95 text-center">
          <span>
            Total: <span className="font-extrabold">{resumen.total}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Emitidas: <span className="font-extrabold">{resumen.emitidas}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Canceladas:{" "}
            <span className="font-extrabold">{resumen.canceladas}</span>
          </span>
          <span className="mx-2">·</span>
          <span>
            Error: <span className="font-extrabold">{resumen.error}</span>
          </span>
        </div>
      </div>

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
          Emitir factura
        </button>
      </div>
    </div>
  );
}
