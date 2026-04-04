// src/modules/facturacion_cfdi/components/facturacion_cfdi/FacturacionCfdiRowActions.tsx
// Acciones por fila en la tabla de Facturación CFDI.
// Responsabilidades: renderizar botones Ver, Timbrar, Enviar y Cancelar según el estado de la factura.
// Nota UI: el botón de timbrar usa color melón y cambia a gris cuando ya está timbrada.

import type { Factura } from "../../types/facturacion_cfdi.types";

type Props = {
  factura: Factura;
  onVer: (f: Factura) => void;
  onTimbrar: (f: Factura) => void;
  onEnviar: (f: Factura) => void;
  onCancelar: (f: Factura) => void;
};

export default function FacturacionCfdiRowActions({
  factura,
  onVer,
  onTimbrar,
  onEnviar,
  onCancelar,
}: Props) {
  const isCancelada = factura.estado === "CANCELADA";
  const yaTimbrada = !!factura.uuid || !!factura.fecha_timbrado;

  const btnTimbrarClass = yaTimbrada
    ? "bg-slate-300 text-slate-600 cursor-not-allowed"
    : "bg-[#ff7c39] text-white hover:opacity-90";

  const btnCancelarClass = isCancelada
    ? "bg-slate-300 text-slate-600 cursor-not-allowed"
    : "bg-red-500 text-white hover:bg-red-600";

  return (
    <div className="flex justify-end gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => onVer(factura)}
        className="w-20 rounded-lg bg-[#2B6CB0] px-3 py-1.5 text-center text-xs font-extrabold text-white hover:opacity-90"
      >
        Ver
      </button>

      <button
        type="button"
        onClick={() => {
          if (yaTimbrada || isCancelada) return;
          onTimbrar(factura);
        }}
        disabled={yaTimbrada || isCancelada}
        className={`w-24 rounded-lg px-3 py-1.5 text-center text-xs font-extrabold shadow-sm ${btnTimbrarClass}`}
        title={
          yaTimbrada
            ? "Factura ya timbrada"
            : isCancelada
              ? "No se puede timbrar una factura cancelada"
              : "Timbrar factura"
        }
      >
        {yaTimbrada ? "Timbrada" : "Timbrar"}
      </button>

      <button
        type="button"
        onClick={() => onEnviar(factura)}
        className="w-20 rounded-lg bg-[#ECC94B] px-3 py-1.5 text-center text-xs font-extrabold text-[#1A202C] hover:opacity-90"
      >
        Enviar
      </button>

      <button
        type="button"
        onClick={() => {
          if (isCancelada) return;
          onCancelar(factura);
        }}
        disabled={isCancelada}
        className={`w-24 rounded-lg px-3 py-1.5 text-center text-xs font-extrabold shadow-sm ${btnCancelarClass}`}
        title={isCancelada ? "Factura ya cancelada" : "Cancelar factura"}
      >
        {isCancelada ? "Cancelada" : "Cancelar"}
      </button>
    </div>
  );
}
