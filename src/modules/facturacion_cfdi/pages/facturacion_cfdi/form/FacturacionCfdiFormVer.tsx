// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/FacturacionCfdiFormVer.tsx
// Bloque visual del modo VER.
// Responsabilidades:
// - mostrar la información completa de la factura y sus conceptos
// - abrir una vista previa de impresión
// - permitir imprimir desde el modal de vista previa

import { useMemo, useState } from "react";
import type { Factura } from "../../../types/facturacion_cfdi.types";
import { formatDateTime } from "./facturacionCfdiForm.utils";
import FacturacionCfdiPrintFactura from "./print/FacturacionCfdiPrintFactura";

type Props = {
  initialFactura: Factura | null;
};

function formatMoney(value?: number | null): string {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatText(value?: string | number | null, fallback = "-"): string {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function getFacturaFolio(factura: Factura | null): string {
  if (!factura) return "-";

  if (factura.factura_folio && String(factura.factura_folio).trim()) {
    return String(factura.factura_folio).trim();
  }

  const serie = factura.serie ? String(factura.serie).trim() : "";
  const folio =
    factura.folio !== null && factura.folio !== undefined
      ? String(factura.folio).trim()
      : "";

  const combinado = `${serie}${folio}`.trim();
  return combinado || "-";
}

function getVentaLabel(factura: Factura | null): string {
  if (!factura) return "-";

  if (factura.venta_folio && String(factura.venta_folio).trim()) {
    return String(factura.venta_folio).trim();
  }

  return String(factura.id_venta ?? "-");
}

function getClienteFiscalLabel(factura: Factura | null): string {
  if (!factura) return "-";

  return (
    factura.cliente_fiscal_nombre ||
    factura.razon_social ||
    String(factura.id_cliente_fiscal ?? "-")
  );
}

export default function FacturacionCfdiFormVer({ initialFactura }: Props) {
  const [openPrintPreview, setOpenPrintPreview] = useState(false);

  const resumen = useMemo(() => {
    const conceptos = initialFactura?.conceptos ?? [];

    const subtotal = conceptos.reduce(
      (acc, c) => acc + Number(c.importe_neto ?? c.importe ?? 0),
      0,
    );

    const impuestos = conceptos.reduce(
      (acc, c) => acc + Number(c.impuestos ?? 0),
      0,
    );

    const total = conceptos.reduce(
      (acc, c) => acc + Number(c.total_concepto ?? 0),
      0,
    );

    return { subtotal, impuestos, total };
  }, [initialFactura]);

  function handleOpenPrintPreview(): void {
    setOpenPrintPreview(true);
  }

  function handleClosePrintPreview(): void {
    setOpenPrintPreview(false);
  }

  function handlePrint(): void {
    window.print();
  }

  if (!initialFactura) return null;

  return (
    <>
      <div className="space-y-4 print:hidden">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleOpenPrintPreview}
            className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-slate-900 shadow-sm transition hover:brightness-95"
          >
            Vista previa / Imprimir
          </button>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">
              Serie / Folio
            </div>
            <div className="text-sm font-semibold text-black/80">
              {getFacturaFolio(initialFactura)}
            </div>

            <div className="text-xs font-extrabold text-black/50">UUID</div>
            <div className="break-all text-sm font-semibold text-black/80">
              {initialFactura.uuid ?? "Sin UUID"}
            </div>

            <div className="text-xs font-extrabold text-black/50">Estado</div>
            <div className="text-sm font-semibold text-black/80">
              {initialFactura.estado}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Fecha emisión
            </div>
            <div className="text-sm font-semibold text-black/80">
              {formatDateTime(initialFactura.fecha_emision)}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Fecha timbrado
            </div>
            <div className="text-sm font-semibold text-black/80">
              {formatDateTime(initialFactura.fecha_timbrado)}
            </div>

            <div className="text-xs font-extrabold text-black/50">Venta</div>
            <div className="text-sm font-semibold text-black/80">
              {getVentaLabel(initialFactura)}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Cliente fiscal
            </div>
            <div className="text-sm font-semibold text-black/80">
              {getClienteFiscalLabel(initialFactura)}
            </div>

            <div className="text-xs font-extrabold text-black/50">Serie</div>
            <div className="text-sm font-semibold text-black/80">
              {formatText(initialFactura.serie ?? initialFactura.id_serie)}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Intentos timbrado
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialFactura.intentos_timbrado ?? 0}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Último error
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialFactura.ultimo_error ?? "-"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-extrabold text-black/70">
              Conceptos
            </div>

            <div className="text-xs font-bold text-black/50">
              Total: {formatMoney(resumen.total)}
            </div>
          </div>

          {initialFactura.conceptos && initialFactura.conceptos.length > 0 ? (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-black/5 text-xs font-extrabold text-black/70">
                  <tr>
                    <th className="px-3 py-2">Descripción</th>
                    <th className="px-3 py-2">Cantidad</th>
                    <th className="px-3 py-2">Precio unitario</th>
                    <th className="px-3 py-2">Impuestos</th>
                    <th className="px-3 py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {initialFactura.conceptos.map((c) => (
                    <tr key={c.id_concepto}>
                      <td className="px-3 py-2 font-semibold text-black/80">
                        {c.descripcion}
                      </td>
                      <td className="px-3 py-2 text-black/80">{c.cantidad}</td>
                      <td className="px-3 py-2 text-black/80">
                        {formatMoney(c.precio_unitario)}
                      </td>
                      <td className="px-3 py-2 text-black/80">
                        {formatMoney(c.impuestos)}
                      </td>
                      <td className="px-3 py-2 font-semibold text-black/80">
                        {formatMoney(c.total_concepto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-3 text-sm font-semibold text-black/60">
              Esta factura no tiene conceptos para mostrar.
            </div>
          )}
        </div>
      </div>

      {openPrintPreview && (
        <div className="fixed inset-0 z-120 bg-black/45 print:static print:bg-white">
          <div className="flex min-h-screen items-start justify-center px-4 py-6 print:block print:min-h-0 print:p-0">
            <div className="w-full max-w-6xl rounded-3xl bg-white shadow-2xl print:max-w-none print:rounded-none print:shadow-none">
              <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-4 print:hidden">
                <div>
                  <div className="text-base font-extrabold text-slate-900">
                    Vista previa de impresión
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    Revisa la factura antes de mandarla a imprimir.
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleClosePrintPreview}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cerrar
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-slate-900 transition hover:brightness-95"
                  >
                    Imprimir
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-110px)] overflow-y-auto p-4 print:max-h-none print:overflow-visible print:p-0">
                <FacturacionCfdiPrintFactura
                  factura={initialFactura}
                  nombreEmpresa="Novedades Itzae"
                  rfcEmpresa="XAXX010101000"
                  domicilioEmpresa="León, Guanajuato, México"
                  regimenEmpresa="Régimen General"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
