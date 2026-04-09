// src/modules/ventas/pages/ventas/form/tiket/TiketPrintable.tsx
// Vista imprimible del ticket.
// Responsabilidades:
// - Mostrar el ticket listo para impresión.
// - Mantener un ancho compacto similar a ticket térmico.

import type { TiketData } from "./tiket.types";
import { formatDateTime, formatMoney } from "./tiket.utils";

type Props = {
  data: TiketData;
};

export default function TiketPrintable({ data }: Props) {
  return (
    <div
      id="ventas-ticket-printable"
      className="mx-auto w-full max-w-[380px] rounded-2xl bg-white p-4 text-black"
    >
      <div className="border-b border-dashed border-black/20 pb-3 text-center">
        <div className="text-lg font-extrabold">Novedades Itzae</div>
        <div className="text-xs font-medium text-black/70">Ticket de venta</div>
      </div>

      <div className="mt-3 space-y-1 text-sm">
        <div className="flex items-start justify-between gap-3">
          <span className="font-bold text-black/60">Folio</span>
          <span className="text-right font-extrabold">{data.folio}</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <span className="font-bold text-black/60">Fecha</span>
          <span className="text-right font-semibold">
            {formatDateTime(data.fecha_hora)}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <span className="font-bold text-black/60">Cliente</span>
          <span className="text-right font-semibold">{data.cliente_label}</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <span className="font-bold text-black/60">Vendedor</span>
          <span className="text-right font-semibold">
            {data.vendedor_label}
          </span>
        </div>

        {data.apertura_label ? (
          <div className="flex items-start justify-between gap-3">
            <span className="font-bold text-black/60">Apertura</span>
            <span className="text-right font-semibold">
              {data.apertura_label}
            </span>
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-3">
          <span className="font-bold text-black/60">Tipo</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
              data.es_credito
                ? "bg-amber-100 text-amber-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {data.es_credito ? "CRÉDITO" : "CONTADO"}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-dashed border-black/20 pt-3">
        <div className="mb-2 text-sm font-extrabold">Productos</div>

        <div className="space-y-3">
          {data.detalles.map((item, index) => (
            <div
              key={`${item.id_producto ?? "item"}-${index}`}
              className="text-sm"
            >
              <div className="font-bold">{item.producto_label}</div>

              <div className="mt-1 flex justify-between gap-3 text-xs text-black/70">
                <span>{item.presentacion}</span>
                <span>Cant. {item.cantidad}</span>
              </div>

              <div className="mt-1 flex justify-between gap-3 text-xs">
                <span>{formatMoney(item.precio_unitario)} c/u</span>
                <span className="font-bold">{formatMoney(item.importe)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-dashed border-black/20 pt-3 text-sm">
        <div className="flex justify-between py-0.5">
          <span className="font-semibold text-black/70">Subtotal</span>
          <span className="font-bold">{formatMoney(data.subtotal)}</span>
        </div>

        <div className="flex justify-between py-0.5">
          <span className="font-semibold text-black/70">Descuento</span>
          <span className="font-bold">{formatMoney(data.descuento_total)}</span>
        </div>

        <div className="flex justify-between py-0.5">
          <span className="font-semibold text-black/70">Impuestos</span>
          <span className="font-bold">{formatMoney(data.impuestos_total)}</span>
        </div>

        <div className="mt-2 flex justify-between border-t border-dashed border-black/20 pt-2 text-base">
          <span className="font-extrabold">Total</span>
          <span className="font-extrabold">{formatMoney(data.total)}</span>
        </div>

        <div className="mt-2 flex justify-between py-0.5">
          <span className="font-semibold text-blue-700">Pagado</span>
          <span className="font-bold text-blue-700">
            {formatMoney(data.monto_pagado)}
          </span>
        </div>

        {data.es_credito ? (
          <div className="flex justify-between py-0.5">
            <span className="font-semibold text-amber-700">
              Saldo pendiente
            </span>
            <span className="font-bold text-amber-700">
              {formatMoney(data.saldo_pendiente)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between py-0.5">
            <span className="font-semibold text-cyan-700">Cambio</span>
            <span className="font-bold text-cyan-700">
              {formatMoney(data.cambio)}
            </span>
          </div>
        )}
      </div>

      {data.pagos.length > 0 ? (
        <div className="mt-4 border-t border-dashed border-black/20 pt-3 text-sm">
          <div className="mb-2 font-extrabold">Pagos</div>

          <div className="space-y-1">
            {data.pagos.map((pago, index) => (
              <div
                key={`${pago.forma_pago_label}-${index}`}
                className="rounded-xl border border-black/10 px-3 py-2"
              >
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">{pago.forma_pago_label}</span>
                  <span className="font-bold">{formatMoney(pago.monto)}</span>
                </div>

                {pago.referencia ? (
                  <div className="mt-1 text-xs text-black/55">
                    Ref: {pago.referencia}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {data.notas ? (
        <div className="mt-4 border-t border-dashed border-black/20 pt-3 text-sm">
          <div className="mb-1 font-extrabold">Notas</div>
          <div className="whitespace-pre-wrap text-black/75">{data.notas}</div>
        </div>
      ) : null}

      <div className="mt-5 border-t border-dashed border-black/20 pt-3 text-center text-xs text-black/60">
        Gracias por su compra
      </div>
    </div>
  );
}
