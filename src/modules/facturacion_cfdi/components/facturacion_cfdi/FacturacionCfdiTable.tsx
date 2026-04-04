// src/modules/facturacion_cfdi/components/facturacion_cfdi/FacturacionCfdiTable.tsx
// Tabla del listado de Facturación CFDI.
// Responsabilidades: renderizar encabezado, filas, hover suave, estado visual y acciones.

import type { Factura } from "../../types/facturacion_cfdi.types";
import type { FacturacionCfdiTheme } from "../../theme/facturacionCfdiTheme";
import FacturaEstadoBadge from "./FacturaEstadoBadge";
import FacturacionCfdiRowActions from "./FacturacionCfdiRowActions";

type Props = {
  theme: FacturacionCfdiTheme;
  items: Factura[];
  onVer: (f: Factura) => void;
  onTimbrar: (f: Factura) => void;
  onEnviar: (f: Factura) => void;
  onCancelar: (f: Factura) => void;
};

function getFacturaFolio(f: Factura): string {
  if (f.factura_folio && String(f.factura_folio).trim()) {
    return String(f.factura_folio).trim();
  }

  const serie = f.serie ? String(f.serie).trim() : "";
  const folio =
    f.folio !== null && f.folio !== undefined ? String(f.folio).trim() : "";

  const combinado = `${serie}${folio}`.trim();
  return combinado || "Sin folio";
}

function getVentaLabel(f: Factura): string {
  if (f.venta_folio && String(f.venta_folio).trim()) {
    return String(f.venta_folio).trim();
  }

  return `Venta #${f.id_venta}`;
}

function formatDateTime(value?: string | null, emptyText = "-"): string {
  if (!value) return emptyText;
  return value.replace("T", " ");
}

export default function FacturacionCfdiTable({
  theme,
  items,
  onVer,
  onTimbrar,
  onEnviar,
  onCancelar,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className={`${theme.headerBg} ${theme.headerText}`}>
            <tr className="text-xs font-extrabold">
              <th className="px-4 py-3">Serie / Folio</th>
              <th className="px-4 py-3">Venta</th>
              <th className="px-4 py-3">UUID</th>
              <th className="px-4 py-3">Fecha emisión</th>
              <th className="px-4 py-3">Fecha timbrado</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/5 text-slate-900">
            {items.map((f) => (
              <tr key={f.id_factura} className={`bg-white ${theme.rowHover}`}>
                <td className="px-4 py-3 font-semibold">
                  {getFacturaFolio(f)}
                </td>

                <td className="px-4 py-3 font-semibold">{getVentaLabel(f)}</td>

                <td className="px-4 py-3">
                  <span className="block max-w-60 truncate font-medium">
                    {f.uuid || "Sin UUID"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {formatDateTime(f.fecha_emision, "-")}
                </td>

                <td className="px-4 py-3">
                  {formatDateTime(f.fecha_timbrado, "No timbrada")}
                </td>

                <td className="px-4 py-3">
                  <FacturaEstadoBadge theme={theme} estado={f.estado} />
                </td>

                <td className="px-4 py-3">
                  <FacturacionCfdiRowActions
                    factura={f}
                    onVer={onVer}
                    onTimbrar={onTimbrar}
                    onEnviar={onEnviar}
                    onCancelar={onCancelar}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-6 text-center text-sm font-semibold text-slate-600">
            No hay facturas para mostrar con los filtros actuales.
          </div>
        )}
      </div>
    </div>
  );
}
