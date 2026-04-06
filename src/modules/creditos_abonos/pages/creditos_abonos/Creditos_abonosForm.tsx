// src/modules/creditos_abonos/pages/creditos_abonos/Creditos_abonosForm.tsx
// Formulario de créditos abonos.
// Responsabilidades:
// - CREAR: registrar abono (cliente, fecha/hora POS, apertura, forma de pago, monto, referencia, imprimir ticket).
// - EDITAR: editar abono (mismo diseño que crear, precargado).
// - VER: solo lectura, muestra toda la información del abono.

import { useMemo, useState } from "react";
import type {
  CreditoAbono,
  CreditoAbonoCreate,
  CreditoAbonoUpdate,
  FuenteHoraAbono,
} from "../../types/creditos_abonos.types";
import { creditosAbonosService } from "../../services/creditos_abonos.service";

export type Creditos_abonosFormModo = "CREAR" | "EDITAR" | "VER";

type Props = {
  modo: Creditos_abonosFormModo;
  initialAbono: CreditoAbono | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  id_cliente: number;
  fecha_hora_pos: string;
  fuente_hora: FuenteHoraAbono | string;
  timezone_pos: string;
  offset_minutos_pos: number;
  id_usuario_cobra: number;
  id_apertura: number;
  id_forma_pago: number;
  monto_total: string;
  referencia_pago: string;
  imprimir_ticket: boolean;
  folio: string;
};

function toLocalDatetimeInput(value?: string | null): string {
  if (!value) return "";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");

  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getNowLocalDatetimeInput(): string {
  return toLocalDatetimeInput(new Date().toISOString());
}

function buildInitialForm(
  modo: Creditos_abonosFormModo,
  abono: CreditoAbono | null,
): FormState {
  if ((modo === "EDITAR" || modo === "VER") && abono) {
    return {
      id_cliente: abono.id_cliente ?? 0,
      fecha_hora_pos: toLocalDatetimeInput(abono.fecha_hora_pos),
      fuente_hora: abono.fuente_hora ?? "SERVIDOR",
      timezone_pos: abono.timezone_pos ?? "America/Mexico_City",
      offset_minutos_pos: abono.offset_minutos_pos ?? 0,
      id_usuario_cobra: abono.id_usuario_cobra ?? 1,
      id_apertura: abono.id_apertura ?? 0,
      id_forma_pago: abono.id_forma_pago ?? 1,
      monto_total: String(abono.monto_total ?? ""),
      referencia_pago: abono.referencia_pago ?? "",
      imprimir_ticket: Boolean(abono.imprimir_ticket),
      folio: abono.folio ?? "",
    };
  }

  return {
    id_cliente: 0,
    fecha_hora_pos: getNowLocalDatetimeInput(),
    fuente_hora: "SERVIDOR",
    timezone_pos: "America/Mexico_City",
    offset_minutos_pos: 0,
    id_usuario_cobra: 1,
    id_apertura: 1,
    id_forma_pago: 1,
    monto_total: "",
    referencia_pago: "",
    imprimir_ticket: true,
    folio: "",
  };
}

function formatFecha(value?: string | null): string {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

function formaPagoLabel(id_forma_pago?: number | null): string {
  switch (id_forma_pago) {
    case 1:
      return "Efectivo";
    case 2:
      return "Transferencia";
    case 3:
      return "Tarjeta";
    default:
      return id_forma_pago ? `Forma ${id_forma_pago}` : "-";
  }
}

export default function Creditos_abonosForm({
  modo,
  initialAbono,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialAbono),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar abono";
    if (modo === "EDITAR") return `Editar abono: ${initialAbono?.folio ?? ""}`;
    return `Visualizar abono: ${initialAbono?.folio ?? ""}`;
  }, [modo, initialAbono]);

  function validarCrearEditar(): string {
    if (!form.id_cliente || form.id_cliente <= 0)
      return "Te falta registrar el cliente.";
    if (!form.fecha_hora_pos.trim())
      return "Te falta registrar la fecha y hora.";
    if (!form.id_apertura || form.id_apertura <= 0)
      return "Te falta registrar la apertura.";
    if (!form.id_forma_pago || form.id_forma_pago <= 0)
      return "Te falta seleccionar la forma de pago.";
    if (!form.monto_total.trim()) return "Te falta registrar el monto total.";

    const monto = Number(form.monto_total);
    if (Number.isNaN(monto) || monto <= 0)
      return "El monto total debe ser mayor a cero.";

    return "";
  }

  async function guardar() {
    const err = validarCrearEditar();
    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      if (modo === "CREAR") {
        const payload: CreditoAbonoCreate = {
          id_cliente: form.id_cliente,
          fecha_hora_pos: new Date(form.fecha_hora_pos).toISOString(),
          fuente_hora: form.fuente_hora,
          timezone_pos: form.timezone_pos.trim() || "America/Mexico_City",
          offset_minutos_pos: Number(form.offset_minutos_pos) || 0,
          id_usuario_cobra: form.id_usuario_cobra,
          id_apertura: form.id_apertura,
          id_forma_pago: form.id_forma_pago,
          monto_total: Number(form.monto_total),
          referencia_pago: form.referencia_pago.trim() || null,
          imprimir_ticket: form.imprimir_ticket,
          folio: form.folio.trim() || undefined,
        };

        await creditosAbonosService.crear(payload);
        onSuccess();
        return;
      }

      if (!initialAbono) {
        setMsgError("No se encontró el abono a editar.");
        return;
      }

      const payload: CreditoAbonoUpdate = {
        fecha_hora_pos: new Date(form.fecha_hora_pos).toISOString(),
        fuente_hora: form.fuente_hora,
        timezone_pos: form.timezone_pos.trim() || "America/Mexico_City",
        offset_minutos_pos: Number(form.offset_minutos_pos) || 0,
        id_apertura: form.id_apertura,
        id_forma_pago: form.id_forma_pago,
        monto_total: Number(form.monto_total),
        referencia_pago: form.referencia_pago.trim() || null,
        imprimir_ticket: form.imprimir_ticket,
      };

      await creditosAbonosService.actualizar(initialAbono.id_abono, payload);
      onSuccess();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Ocurrió un error al guardar.";
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Cliente */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Cliente</label>
          <input
            type="number"
            min="1"
            value={form.id_cliente || ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                id_cliente: Number(e.target.value) || 0,
              }))
            }
            disabled={readOnly || modo === "EDITAR"}
            placeholder="Id del cliente"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Folio */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Folio</label>
          <input
            value={form.folio}
            onChange={(e) => setForm((p) => ({ ...p, folio: e.target.value }))}
            disabled={readOnly || modo === "EDITAR"}
            placeholder="Opcional"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Fecha hora POS */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Fecha y hora</label>
          <input
            type="datetime-local"
            value={form.fecha_hora_pos}
            onChange={(e) =>
              setForm((p) => ({ ...p, fecha_hora_pos: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Fuente hora */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Fuente hora</label>
          <select
            value={form.fuente_hora}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                fuente_hora: e.target.value as FuenteHoraAbono,
              }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          >
            <option value="SERVIDOR">SERVIDOR</option>
            <option value="CLIENTE">CLIENTE</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Zona horaria</label>
          <input
            value={form.timezone_pos}
            onChange={(e) =>
              setForm((p) => ({ ...p, timezone_pos: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Offset */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Offset minutos</label>
          <input
            type="number"
            value={form.offset_minutos_pos}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                offset_minutos_pos: Number(e.target.value) || 0,
              }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Usuario cobra */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Usuario cobra</label>
          <input
            type="number"
            min="1"
            value={form.id_usuario_cobra || ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                id_usuario_cobra: Number(e.target.value) || 0,
              }))
            }
            disabled={readOnly || modo === "EDITAR"}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Apertura */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Apertura</label>
          <input
            type="number"
            min="1"
            value={form.id_apertura || ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                id_apertura: Number(e.target.value) || 0,
              }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Forma de pago */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Forma de pago</label>
          <select
            value={String(form.id_forma_pago)}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                id_forma_pago: Number(e.target.value),
              }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          >
            <option value="1">Efectivo</option>
            <option value="2">Transferencia</option>
            <option value="3">Tarjeta</option>
          </select>
        </div>

        {/* Monto */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Monto total</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.monto_total}
            onChange={(e) =>
              setForm((p) => ({ ...p, monto_total: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Referencia */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">
            Referencia de pago (opcional)
          </label>
          <input
            value={form.referencia_pago}
            onChange={(e) =>
              setForm((p) => ({ ...p, referencia_pago: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Imprimir ticket */}
        <div className="flex items-center gap-2 md:col-span-2">
          <input
            id="imprimir_ticket_abono"
            type="checkbox"
            checked={form.imprimir_ticket}
            onChange={(e) =>
              setForm((p) => ({ ...p, imprimir_ticket: e.target.checked }))
            }
            disabled={readOnly}
            className="h-4 w-4 rounded border-black/20"
          />
          <label
            htmlFor="imprimir_ticket_abono"
            className="text-sm font-extrabold"
          >
            Imprimir ticket
          </label>
        </div>
      </div>

      {/* Footer: en VER no hay botones */}
      {modo !== "VER" ? (
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
              : modo === "CREAR"
                ? "Crear"
                : "Actualizar"}
          </button>
        </div>
      ) : null}

      {/* Visualización extra */}
      {modo === "VER" && initialAbono ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">Folio</div>
            <div className="text-sm font-semibold text-black/80">
              {initialAbono.folio}
            </div>

            <div className="text-xs font-extrabold text-black/50">Estatus</div>
            <div className="text-sm font-semibold text-black/80">
              {initialAbono.estatus}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Fecha registro
            </div>
            <div className="text-sm font-semibold text-black/80">
              {formatFecha(initialAbono.fecha_hora)}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Forma de pago
            </div>
            <div className="text-sm font-semibold text-black/80">
              {formaPagoLabel(initialAbono.id_forma_pago)}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Cancelado en
            </div>
            <div className="text-sm font-semibold text-black/80">
              {formatFecha(initialAbono.cancelado_en)}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Usuario cancela
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialAbono.id_usuario_cancela ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Motivo cancelación
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialAbono.motivo_cancelacion ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Creado en
            </div>
            <div className="text-sm font-semibold text-black/80">
              {formatFecha(initialAbono.creado_en)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
