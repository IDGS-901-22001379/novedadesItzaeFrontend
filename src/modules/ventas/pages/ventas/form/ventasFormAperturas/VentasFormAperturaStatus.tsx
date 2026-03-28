// src/modules/ventas/pages/ventas/form/ventasFormAperturas/VentasFormAperturaStatus.tsx
// Estado visual de la caja/apertura en ventas.
// Responsabilidades:
// - Mostrar si la caja está abierta o cerrada.
// - Mostrar la caja principal y la apertura actual.
// - Permitir abrir la caja desde el mismo botón.
// - Mantener señal visual verde/roja.

import { VENTAS_APERTURA_UI_TEXTS } from "./ventasFormAperturas.constants";
import type {
  VentaAperturaActual,
  VentaCajaDefault,
} from "./ventasFormAperturas.types";

type Props = {
  loading?: boolean;
  cajaAbierta: boolean;
  cajaDefault: VentaCajaDefault | null;
  aperturaActual: VentaAperturaActual | null;
  onClick: () => void;
};

export default function VentasFormAperturaStatus({
  loading = false,
  cajaAbierta,
  cajaDefault,
  aperturaActual,
  onClick,
}: Props) {
  const nombreCaja = cajaDefault?.nombre?.trim() || "CAJA PRINCIPAL";
  const codigoCaja = cajaDefault?.codigo?.trim() || "CAJA01";

  const estatusLabel = cajaAbierta
    ? VENTAS_APERTURA_UI_TEXTS.cajaAbierta
    : VENTAS_APERTURA_UI_TEXTS.cajaCerrada;

  const aperturaLabel =
    aperturaActual?.apertura_label?.trim() || `${nombreCaja} • ${codigoCaja}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`flex w-full flex-col rounded-2xl border px-4 py-3 text-left transition disabled:opacity-60 ${
        cajaAbierta
          ? "border-green-300 bg-green-50 hover:bg-green-100"
          : "border-red-300 bg-red-50 hover:bg-red-100"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={`text-sm font-extrabold ${
            cajaAbierta ? "text-green-800" : "text-red-800"
          }`}
        >
          {estatusLabel}
        </div>

        <div
          className={`rounded-xl px-3 py-1 text-xs font-extrabold ${
            cajaAbierta
              ? "bg-green-200 text-green-900"
              : "bg-red-200 text-red-900"
          }`}
        >
          {loading ? "Cargando..." : cajaAbierta ? "Caja activa" : "Abrir caja"}
        </div>
      </div>

      <div
        className={`mt-2 text-sm font-semibold ${
          cajaAbierta ? "text-green-700" : "text-red-700"
        }`}
      >
        {aperturaLabel}
      </div>

      <div
        className={`mt-1 text-xs font-semibold ${
          cajaAbierta ? "text-green-700/80" : "text-red-700/80"
        }`}
      >
        {nombreCaja} • {codigoCaja}
      </div>
    </button>
  );
}
