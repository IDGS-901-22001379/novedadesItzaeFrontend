// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/print/FacturacionCfdiPrintFactura.tsx
// Vista imprimible de factura CFDI.
// Responsabilidades:
// - mostrar encabezado de factura
// - mostrar datos fiscales y comerciales
// - mostrar conceptos
// - mostrar resumen de importes
// - mostrar QR de referencia
// - servir como base para impresión con window.print o react-to-print

import type {
  Factura,
  FacturaConcepto,
} from "../../../../types/facturacion_cfdi.types";

type Props = {
  factura: Factura | null;
  nombreEmpresa?: string;
  rfcEmpresa?: string;
  domicilioEmpresa?: string;
  regimenEmpresa?: string;
  logoUrl?: string;
};

function formatText(value?: string | number | null, fallback = "-"): string {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function formatDateTime(value?: string | null, fallback = "-"): string {
  if (!value) return fallback;
  return value.replace("T", " ");
}

function formatMoney(value?: number | null): string {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
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

  const combined = `${serie}${folio}`.trim();
  return combined || "-";
}

function calcSubtotal(conceptos: FacturaConcepto[]): number {
  return conceptos.reduce(
    (acc, item) => acc + Number(item.importe_neto ?? item.importe ?? 0),
    0,
  );
}

function calcIva(conceptos: FacturaConcepto[]): number {
  return conceptos.reduce((acc, item) => acc + Number(item.impuestos ?? 0), 0);
}

function calcTotal(conceptos: FacturaConcepto[]): number {
  return conceptos.reduce(
    (acc, item) => acc + Number(item.total_concepto ?? 0),
    0,
  );
}

function getQrValue(factura: Factura | null): string {
  if (!factura) return "FACTURA";
  return (
    factura.uuid ||
    factura.factura_folio ||
    `${factura.serie ?? ""}${factura.folio ?? ""}`.trim() ||
    `FACTURA-${factura.id_factura}`
  );
}

function getQrUrl(value: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    value,
  )}`;
}

export default function FacturacionCfdiPrintFactura({
  factura,
  nombreEmpresa = "Novedades Itzae",
  rfcEmpresa = "-",
  domicilioEmpresa = "-",
  regimenEmpresa = "-",
  logoUrl = "/logo.png",
}: Props) {
  const conceptos = factura?.conceptos ?? [];

  const subtotal = calcSubtotal(conceptos);
  const iva = calcIva(conceptos);
  const total = calcTotal(conceptos);
  const facturaFolio = getFacturaFolio(factura);
  const qrValue = getQrValue(factura);
  const qrUrl = getQrUrl(qrValue);

  return (
    <div className="mx-auto w-full max-w-225 bg-white px-8 py-8 text-[13px] text-slate-900 print:max-w-none print:px-4 print:py-4">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-300 p-5">
          <div className="flex items-start gap-4">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo empresa"
                className="h-16 w-16 rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-slate-300 text-xs font-bold text-slate-500">
                LOGO
              </div>
            )}

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Factura CFDI
              </h1>

              <div className="mt-2 space-y-1 text-sm text-slate-700">
                <div className="font-bold">{formatText(nombreEmpresa)}</div>
                <div>
                  <span className="font-semibold">RFC:</span>{" "}
                  {formatText(rfcEmpresa)}
                </div>
                <div>
                  <span className="font-semibold">Régimen fiscal:</span>{" "}
                  {formatText(regimenEmpresa)}
                </div>
                <div>
                  <span className="font-semibold">Domicilio:</span>{" "}
                  {formatText(domicilioEmpresa)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-300 p-5">
          <div className="mb-4 text-xl font-extrabold text-slate-900">
            Datos de factura
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="font-semibold text-slate-600">Folio</div>
            <div className="font-bold text-slate-900">{facturaFolio}</div>

            <div className="font-semibold text-slate-600">UUID</div>
            <div className="break-all">
              {formatText(factura?.uuid, "Sin UUID")}
            </div>

            <div className="font-semibold text-slate-600">Estado</div>
            <div>{formatText(factura?.estado)}</div>

            <div className="font-semibold text-slate-600">Fecha emisión</div>
            <div>{formatDateTime(factura?.fecha_emision)}</div>

            <div className="font-semibold text-slate-600">Fecha timbrado</div>
            <div>{formatDateTime(factura?.fecha_timbrado, "No timbrada")}</div>

            <div className="font-semibold text-slate-600">Venta</div>
            <div>
              {formatText(
                factura?.venta_folio ?? String(factura?.id_venta ?? "-"),
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-300 p-5">
          <div className="mb-4 text-xl font-extrabold text-slate-900">
            Emisor
          </div>

          <div className="space-y-2 text-sm text-slate-700">
            <div>
              <span className="font-semibold">Nombre:</span>{" "}
              {formatText(nombreEmpresa)}
            </div>
            <div>
              <span className="font-semibold">RFC:</span>{" "}
              {formatText(rfcEmpresa)}
            </div>
            <div>
              <span className="font-semibold">Régimen:</span>{" "}
              {formatText(regimenEmpresa)}
            </div>
            <div>
              <span className="font-semibold">Domicilio:</span>{" "}
              {formatText(domicilioEmpresa)}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-300 p-5">
          <div className="mb-4 text-xl font-extrabold text-slate-900">
            Receptor
          </div>

          <div className="space-y-2 text-sm text-slate-700">
            <div>
              <span className="font-semibold">Cliente fiscal:</span>{" "}
              {formatText(
                (
                  factura as Factura & {
                    cliente_fiscal_nombre?: string | null;
                    razon_social?: string | null;
                  }
                )?.cliente_fiscal_nombre ??
                  (
                    factura as Factura & {
                      cliente_fiscal_nombre?: string | null;
                      razon_social?: string | null;
                    }
                  )?.razon_social,
                "Sin nombre",
              )}
            </div>

            <div>
              <span className="font-semibold">Serie:</span>{" "}
              {formatText(factura?.serie)}
            </div>

            <div>
              <span className="font-semibold">Folio de factura:</span>{" "}
              {formatText(facturaFolio)}
            </div>

            <div>
              <span className="font-semibold">Estado:</span>{" "}
              {formatText(factura?.estado, "EMITIDA")}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-300 p-4">
          <div className="mb-3 text-lg font-extrabold text-slate-900">
            Conceptos
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 text-left">
                  <th className="px-3 py-2 font-extrabold">Cantidad</th>
                  <th className="px-3 py-2 font-extrabold">Presentación</th>
                  <th className="px-3 py-2 font-extrabold">Descripción</th>
                  <th className="px-3 py-2 font-extrabold">Precio unitario</th>
                  <th className="px-3 py-2 font-extrabold text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {conceptos.length > 0 ? (
                  conceptos.map((concepto, index) => (
                    <tr
                      key={`${concepto.id_concepto}-${index}`}
                      className="border-b border-slate-200"
                    >
                      <td className="px-3 py-2 align-top">
                        {formatText(concepto.cantidad)}
                      </td>

                      <td className="px-3 py-2 align-top">
                        {formatText(concepto.presentacion)}
                      </td>

                      <td className="px-3 py-2 align-top">
                        <div className="font-semibold text-slate-900">
                          {formatText(concepto.descripcion)}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">
                          Clave SAT: {formatText(concepto.clave_prod_serv_sat)}{" "}
                          | Unidad SAT: {formatText(concepto.clave_unidad_sat)}
                        </div>
                      </td>

                      <td className="px-3 py-2 align-top">
                        {formatMoney(concepto.precio_unitario)}
                      </td>

                      <td className="px-3 py-2 text-right align-top font-bold">
                        {formatMoney(concepto.total_concepto)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-6 text-center font-semibold text-slate-500"
                    >
                      No hay conceptos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex justify-end">
          <div className="w-full max-w-sm rounded-2xl border border-slate-300 p-4">
            <div className="mb-3 text-lg font-extrabold text-slate-900">
              Resumen
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-600">Subtotal</span>
                <span className="font-bold">{formatMoney(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-600">IVA</span>
                <span className="font-bold">{formatMoney(iva)}</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-300 pt-3 text-base">
                <span className="font-extrabold text-slate-900">Total</span>
                <span className="font-extrabold text-slate-900">
                  {formatMoney(total)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center rounded-2xl border border-slate-300 p-5">
          <div className="mb-3 text-base font-extrabold text-slate-900">
            Código QR de referencia
          </div>

          <img
            src={qrUrl}
            alt="QR factura"
            className="h-40 w-40 rounded-lg border border-slate-200 object-contain"
          />

          <div className="mt-3 max-w-md break-all text-center text-xs font-medium text-slate-600">
            {qrValue}
          </div>
        </section>
      </div>
    </div>
  );
}
