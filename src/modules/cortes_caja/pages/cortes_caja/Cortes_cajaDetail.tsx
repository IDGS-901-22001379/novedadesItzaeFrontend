// src/modules/cortes_caja/pages/cortes_caja/Cortes_cajaDetail.tsx
// Vista de detalle del módulo Cortes de Caja.
// Se encarga de mostrar la información completa de una apertura en modo solo lectura dentro de un modal.

import type { CorteCajaApertura } from "../../types";

type Props = {
  apertura: CorteCajaApertura | null;
  onClose: () => void;
};

// Da formato de moneda a los importes del corte.
function formatMoney(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "$0.00";

  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return String(value);

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(num);
}

// Da formato legible a fechas y horas.
function formatDateTime(value?: string | null): string {
  if (!value) return "No disponible";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function Cortes_cajaDetail({ apertura, onClose }: Props) {
  if (!apertura) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-800">
          No se encontró información del corte de caja.
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">
        Detalle de la apertura de caja
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-black/80">
                Información general
              </h2>
              <p className="mt-1 text-sm font-semibold text-black/60">
                Datos principales de la apertura
              </p>
            </div>

            <span
              className={[
                "inline-flex rounded-full px-3 py-1 text-xs font-extrabold",
                apertura.estatus === "ABIERTA"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-800",
              ].join(" ")}
            >
              {apertura.estatus}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Apertura
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                #{apertura.id_apertura}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">Caja</div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                Caja #{apertura.id_caja}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Usuario
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                Usuario #{apertura.id_usuario}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Monto inicial
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.monto_inicial)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Fecha de apertura
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatDateTime(apertura.fecha_hora_apertura)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Fecha de cierre
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatDateTime(apertura.fecha_hora_cierre)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Efectivo contado
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.efectivo_contado)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Diferencia
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.diferencia)}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-extrabold text-black/80">
            Totales del corte
          </h2>
          <p className="mt-1 text-sm font-semibold text-black/60">
            Resumen de movimientos y ventas
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Total ventas
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.total_ventas)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Ventas efectivo
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.total_ventas_efectivo)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Ventas tarjeta
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.total_ventas_tarjeta)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Ventas otros
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.total_ventas_otros)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Devoluciones
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.total_devoluciones)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">Gastos</div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.total_gastos)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Entradas extra
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.total_entradas_extra)}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-black/[0.03] p-3">
              <div className="text-xs font-extrabold text-black/50">
                Abonos a crédito
              </div>
              <div className="mt-1 text-sm font-semibold text-black/80">
                {formatMoney(apertura.total_abonos_credito)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
