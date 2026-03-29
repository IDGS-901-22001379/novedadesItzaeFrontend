// src/modules/cortes_caja/pages/cortes_caja/Cortes_cajaForm.tsx
// Formulario del módulo Cortes de Caja.
// Se encarga de abrir una nueva caja o cerrar una apertura existente,
// validando los datos necesarios y consumiendo las APIs del módulo.

import { useMemo, useState } from "react";
import type { CorteCajaApertura } from "../../types";
import { cortesCajaService } from "../../services";

export type Cortes_cajaFormModo = "ABRIR" | "CERRAR";

type Props = {
  modo: Cortes_cajaFormModo;
  initialApertura: CorteCajaApertura | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  id_caja: string;
  monto_inicial: string;
  efectivo_contado: string;
};

function buildInitialForm(
  modo: Cortes_cajaFormModo,
  apertura: CorteCajaApertura | null,
): FormState {
  if (modo === "CERRAR" && apertura) {
    return {
      id_caja: String(apertura.id_caja ?? ""),
      monto_inicial: apertura.monto_inicial ?? "",
      efectivo_contado: "",
    };
  }

  return {
    id_caja: "",
    monto_inicial: "",
    efectivo_contado: "",
  };
}

// Convierte un valor numérico en formato amigable para mostrar en resumen.
function formatMoney(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "$0.00";

  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return String(value);

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(num);
}

// Convierte texto a número para enviarlo al backend.
function parseNumber(value: string): number {
  const clean = value.replaceAll(",", "").trim();
  return Number(clean);
}

export default function Cortes_cajaForm({
  modo,
  initialApertura,
  onSuccess,
  onCancel,
}: Props) {
  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialApertura),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const subtitulo = useMemo(() => {
    if (modo === "ABRIR") return "Registrar apertura de caja";
    return `Cerrar apertura de caja #${initialApertura?.id_apertura ?? ""}`;
  }, [modo, initialApertura]);

  // Valida los datos necesarios antes de enviar al backend.
  function validar(): string {
    if (modo === "ABRIR") {
      if (!form.id_caja.trim()) return "Te falta registrar la caja.";
      if (parseNumber(form.id_caja) <= 0)
        return "La caja seleccionada no es válida.";

      if (!form.monto_inicial.trim())
        return "Te falta registrar el monto inicial.";
      if (Number.isNaN(parseNumber(form.monto_inicial))) {
        return "El monto inicial no es válido.";
      }
      if (parseNumber(form.monto_inicial) < 0) {
        return "El monto inicial no puede ser menor a cero.";
      }

      return "";
    }

    if (!initialApertura) return "No se encontró la apertura a cerrar.";

    if (!form.efectivo_contado.trim())
      return "Te falta registrar el efectivo contado.";
    if (Number.isNaN(parseNumber(form.efectivo_contado))) {
      return "El efectivo contado no es válido.";
    }
    if (parseNumber(form.efectivo_contado) < 0) {
      return "El efectivo contado no puede ser menor a cero.";
    }

    return "";
  }

  // Guarda la apertura o el cierre según el modo actual.
  async function guardar() {
    const err = validar();
    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      if (modo === "ABRIR") {
        await cortesCajaService.abrirApertura({
          id_caja: parseNumber(form.id_caja),
          monto_inicial: parseNumber(form.monto_inicial),
        });

        onSuccess();
        return;
      }

      if (!initialApertura) {
        setMsgError("No se encontró la apertura a cerrar.");
        return;
      }

      await cortesCajaService.cerrarApertura(initialApertura.id_apertura, {
        efectivo_contado: parseNumber(form.efectivo_contado),
      });

      onSuccess();
    } catch (e: unknown) {
      const msg =
        e instanceof Error
          ? e.message
          : "Ocurrió un error al guardar la información.";
      setMsgError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

      {msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {msgError}
        </div>
      ) : null}

      {modo === "ABRIR" ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold">Caja</label>
            <input
              type="number"
              min="1"
              value={form.id_caja}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, id_caja: e.target.value }))
              }
              placeholder="Ejemplo: 1"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold">Monto inicial</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.monto_inicial}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, monto_inicial: e.target.value }))
              }
              placeholder="Ejemplo: 1000.00"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
            />
          </div>
        </div>
      ) : null}

      {modo === "CERRAR" && initialApertura ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="mb-3 text-sm font-extrabold text-black/70">
              Resumen de la apertura
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs font-extrabold text-black/50">Caja</div>
                <div className="text-sm font-semibold text-black/80">
                  Caja #{initialApertura.id_caja}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Usuario
                </div>
                <div className="text-sm font-semibold text-black/80">
                  Usuario #{initialApertura.id_usuario}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Fecha de apertura
                </div>
                <div className="text-sm font-semibold text-black/80">
                  {initialApertura.fecha_hora_apertura ?? "-"}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Monto inicial
                </div>
                <div className="text-sm font-semibold text-black/80">
                  {formatMoney(initialApertura.monto_inicial)}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Total ventas
                </div>
                <div className="text-sm font-semibold text-black/80">
                  {formatMoney(initialApertura.total_ventas)}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Ventas efectivo
                </div>
                <div className="text-sm font-semibold text-black/80">
                  {formatMoney(initialApertura.total_ventas_efectivo)}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Ventas tarjeta
                </div>
                <div className="text-sm font-semibold text-black/80">
                  {formatMoney(initialApertura.total_ventas_tarjeta)}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Ventas otros
                </div>
                <div className="text-sm font-semibold text-black/80">
                  {formatMoney(initialApertura.total_ventas_otros)}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Devoluciones
                </div>
                <div className="text-sm font-semibold text-black/80">
                  {formatMoney(initialApertura.total_devoluciones)}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Gastos
                </div>
                <div className="text-sm font-semibold text-black/80">
                  {formatMoney(initialApertura.total_gastos)}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Entradas extra
                </div>
                <div className="text-sm font-semibold text-black/80">
                  {formatMoney(initialApertura.total_entradas_extra)}
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-black/50">
                  Abonos a crédito
                </div>
                <div className="text-sm font-semibold text-black/80">
                  {formatMoney(initialApertura.total_abonos_credito)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-extrabold">Efectivo contado</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.efectivo_contado}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  efectivo_contado: e.target.value,
                }))
              }
              placeholder="Ejemplo: 2500.00"
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
            />
          </div>
        </div>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={() => void guardar()}
          disabled={saving}
          className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f] disabled:opacity-50"
        >
          {saving
            ? "Guardando..."
            : modo === "ABRIR"
              ? "Abrir caja"
              : "Cerrar caja"}
        </button>
      </div>
    </div>
  );
}
