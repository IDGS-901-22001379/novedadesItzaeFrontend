// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/print/FacturacionCfdiPrintFacturaPage.tsx
// Pantalla contenedora para impresión de factura CFDI.
// Responsabilidades:
// - obtener id_factura desde props o ruta
// - cargar factura desde service
// - mostrar estados de carga/error
// - renderizar vista imprimible
// - lanzar impresión del navegador

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { facturacionCfdiService } from "../../../../services/facturacion_cfdi.service";
import type { Factura } from "../../../../types/facturacion_cfdi.types";
import FacturacionCfdiPrintFactura from "./FacturacionCfdiPrintFactura";

type LoadState = "idle" | "loading" | "success" | "error";

type Props = {
  idFacturaProp?: number;
  nombreEmpresa?: string;
  rfcEmpresa?: string;
  domicilioEmpresa?: string;
  regimenEmpresa?: string;
  logoUrl?: string;
};

export default function FacturacionCfdiPrintFacturaPage({
  idFacturaProp,
  nombreEmpresa = "Novedades Itzae",
  rfcEmpresa = "XAXX010101000",
  domicilioEmpresa = "León, Guanajuato, México",
  regimenEmpresa = "Régimen General",
  logoUrl,
}: Props) {
  const navigate = useNavigate();
  const params = useParams();

  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [factura, setFactura] = useState<Factura | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const idFactura = useMemo(() => {
    if (typeof idFacturaProp === "number" && Number.isFinite(idFacturaProp)) {
      return idFacturaProp;
    }

    const fromRoute = Number(params.id_factura ?? params.idFactura ?? 0);
    return Number.isFinite(fromRoute) ? fromRoute : 0;
  }, [idFacturaProp, params.id_factura, params.idFactura]);

  useEffect(() => {
    let active = true;

    async function loadFactura() {
      if (!idFactura || idFactura <= 0) {
        setLoadState("error");
        setErrorMessage("No se recibió un id de factura válido.");
        return;
      }

      try {
        setLoadState("loading");
        setErrorMessage("");

        const response = await facturacionCfdiService.obtener(idFactura);

        if (!active) return;

        setFactura(response);
        setLoadState("success");
      } catch (error) {
        if (!active) return;

        const message =
          error instanceof Error
            ? error.message
            : "No se pudo cargar la factura para impresión.";

        setFactura(null);
        setLoadState("error");
        setErrorMessage(message);
      }
    }

    loadFactura();

    return () => {
      active = false;
    };
  }, [idFactura]);

  function handlePrint(): void {
    window.print();
  }

  function handleClose(): void {
    navigate(-1);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 print:bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 print:max-w-none print:px-0 print:py-0">
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm print:hidden sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Impresión de factura
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Revisa la información antes de imprimir.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={loadState !== "success" || !factura}
              className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-slate-900 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Imprimir
            </button>
          </div>
        </div>

        {loadState === "loading" && (
          <div className="rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
            <div className="text-base font-extrabold text-slate-800">
              Cargando factura...
            </div>
            <div className="mt-2 text-sm font-medium text-slate-600">
              Espera un momento mientras se prepara la vista de impresión.
            </div>
          </div>
        )}

        {loadState === "error" && (
          <div className="rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <div className="text-base font-extrabold text-red-700">
              No se pudo cargar la factura
            </div>
            <div className="mt-2 text-sm font-medium text-slate-700">
              {errorMessage || "Ocurrió un problema al preparar la impresión."}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
              >
                Regresar
              </button>
            </div>
          </div>
        )}

        {loadState === "success" && factura && (
          <FacturacionCfdiPrintFactura
            factura={factura}
            nombreEmpresa={nombreEmpresa}
            rfcEmpresa={rfcEmpresa}
            domicilioEmpresa={domicilioEmpresa}
            regimenEmpresa={regimenEmpresa}
            logoUrl={logoUrl}
          />
        )}
      </div>
    </div>
  );
}
