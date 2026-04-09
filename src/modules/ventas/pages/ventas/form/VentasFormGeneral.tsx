// src/modules/ventas/pages/ventas/form/VentasFormGeneral.tsx

import { useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { VentaClienteOption } from "../../../types";
import type { VentaFormState } from "./ventasForm.types";
import type { UseVentasFormAperturasVm } from "./ventasFormAperturas/useVentasFormAperturas";

type Props = {
  form: VentaFormState;
  setForm: Dispatch<SetStateAction<VentaFormState>>;
  readOnly: boolean;

  clienteQuery: string;
  setClienteQuery: Dispatch<SetStateAction<string>>;
  clienteResults: VentaClienteOption[];
  clienteSearching: boolean;
  onSelectCliente: (cliente: VentaClienteOption) => void;
  onClearClienteResults: () => void;

  aperturaVm: UseVentasFormAperturasVm;
  onAbrirCaja: () => void;
};

export default function VentasFormGeneral({
  form,
  setForm,
  readOnly,
  clienteQuery,
  setClienteQuery,
  clienteResults,
  clienteSearching,
  onSelectCliente,
  onClearClienteResults,
  aperturaVm,
  onAbrirCaja,
}: Props) {
  const clienteInputRef = useRef<HTMLInputElement | null>(null);
  const [clienteHighlightIndex, setClienteHighlightIndex] =
    useState<number>(-1);

  function updateField<K extends keyof VentaFormState>(
    key: K,
    value: VentaFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSelectCliente(cliente: VentaClienteOption) {
    onSelectCliente(cliente);
    setClienteHighlightIndex(-1);
  }

  const aperturaVisible = form.apertura_label?.trim() || "Ninguno";

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 text-sm font-extrabold text-black/70">
        Datos generales
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {/* Cliente */}
        <div className="relative flex flex-col gap-1">
          <label className="text-xs font-extrabold">Cliente</label>
          <input
            ref={clienteInputRef}
            value={readOnly ? form.cliente_label : clienteQuery}
            onChange={(e) => {
              const value = e.target.value;
              setClienteQuery(value);
              setClienteHighlightIndex(-1);

              setForm((prev) => ({
                ...prev,
                id_cliente: null,
                cliente_label: value,
                id_tipo_cliente: null,
                tipo_cliente_label: null,
                id_cliente_fiscal: null,
                cliente_fiscal_label: "",
              }));
            }}
            onFocus={(e) => {
              e.currentTarget.select();
            }}
            onBlur={() => {
              setTimeout(() => {
                onClearClienteResults();
                setClienteHighlightIndex(-1);
              }, 150);
            }}
            onKeyDown={(e) => {
              if (!clienteResults.length) return;

              if (e.key === "ArrowDown") {
                e.preventDefault();
                setClienteHighlightIndex((prev) => {
                  if (prev < 0) return 0;
                  return prev < clienteResults.length - 1 ? prev + 1 : 0;
                });
                return;
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                setClienteHighlightIndex((prev) => {
                  if (prev < 0) return clienteResults.length - 1;
                  return prev > 0 ? prev - 1 : clienteResults.length - 1;
                });
                return;
              }

              if (e.key === "Enter") {
                const indexToUse =
                  clienteHighlightIndex >= 0 ? clienteHighlightIndex : 0;

                if (indexToUse >= 0 && indexToUse < clienteResults.length) {
                  e.preventDefault();
                  handleSelectCliente(clienteResults[indexToUse]);
                }
                return;
              }

              if (e.key === "Escape") {
                e.preventDefault();
                onClearClienteResults();
                setClienteHighlightIndex(-1);
              }
            }}
            disabled={readOnly}
            placeholder="Público General"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
            autoFocus={!readOnly}
          />

          {!readOnly && clienteSearching ? (
            <div className="text-[11px] font-semibold text-black/45">
              Buscando clientes...
            </div>
          ) : null}

          {!readOnly && clienteResults.length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-64 overflow-auto rounded-2xl border border-black/10 bg-white shadow-lg">
              {clienteResults.map((cliente, index) => (
                <button
                  key={cliente.id_cliente}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setClienteHighlightIndex(index)}
                  onClick={() => handleSelectCliente(cliente)}
                  className={`flex w-full flex-col border-b border-black/5 px-3 py-2 text-left ${
                    clienteHighlightIndex === index
                      ? "bg-black/10"
                      : "hover:bg-black/5"
                  }`}
                >
                  <span className="text-sm font-bold text-black/80">
                    {cliente.cliente_label}
                  </span>
                  <span className="text-[11px] font-semibold text-black/50">
                    {cliente.numero_cliente
                      ? `Núm. cliente: ${cliente.numero_cliente}`
                      : "Sin número"}
                    {cliente.tipo_cliente_label
                      ? ` • ${cliente.tipo_cliente_label}`
                      : ""}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Tipo de cliente */}
        <div className="flex flex-col gap-1 xl:max-w-57.5">
          <label className="text-xs font-extrabold">Tipo de cliente</label>
          <input
            value={form.tipo_cliente_label ?? ""}
            disabled={true}
            placeholder="Tipo de cliente"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>

        {/* Vendedor */}
        <div className="flex flex-col gap-1 xl:max-w-57.5">
          <label className="text-xs font-extrabold">Vendedor</label>
          <input
            value={form.vendedor_label}
            disabled={true}
            placeholder="Nombre en ticket"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>

        {/* Apertura + botón estado */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Apertura</label>

          <div className="flex items-center gap-2">
            <input
              value={aperturaVisible}
              disabled={true}
              placeholder="Ninguno"
              className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />

            {aperturaVm.cajaAbierta ? (
              <div className="shrink-0 rounded-xl border border-green-300 bg-green-50 px-3 py-2 text-xs font-extrabold text-green-800">
                Caja abierta
              </div>
            ) : (
              <button
                type="button"
                onClick={onAbrirCaja}
                disabled={readOnly || aperturaVm.loadingApertura}
                className="shrink-0 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-800 hover:bg-red-100 disabled:opacity-60"
              >
                Abrir caja
              </button>
            )}
          </div>
        </div>

        {/* Fecha */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Fecha</label>
          <input
            type="datetime-local"
            value={form.fecha_hora_pos}
            onChange={(e) => updateField("fecha_hora_pos", e.target.value)}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Fuente hora */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Fuente hora</label>
          <input
            value={form.fuente_hora}
            disabled={true}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
        </div>

        {/* Zona horaria */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Zona horaria</label>
          <input
            value={form.timezone_pos_label}
            disabled={true}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
          />
          <div className="text-[11px] font-semibold text-black/45">
            Valor interno: {form.timezone_pos}
          </div>
        </div>

        {/* Venta a crédito */}
        <div className="flex items-end">
          <label
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              form.es_credito
                ? "border border-amber-300 bg-amber-50 text-amber-800"
                : "border border-black/10 bg-white text-black/80"
            }`}
          >
            <input
              type="checkbox"
              checked={Boolean(form.es_credito)}
              onChange={(e) => updateField("es_credito", e.target.checked)}
              disabled={readOnly}
            />
            Venta a crédito
          </label>
        </div>

        {/* Notas */}
        <div className="flex flex-col gap-1 xl:col-span-4">
          <label className="text-xs font-extrabold">Notas</label>
          <textarea
            value={form.notas}
            onChange={(e) => updateField("notas", e.target.value)}
            disabled={readOnly}
            rows={1}
            className="min-h-11 resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>
      </div>
    </div>
  );
}
