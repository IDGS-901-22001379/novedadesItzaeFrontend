// src/modules/creditos/pages/creditos/CreditosForm.tsx
// Formulario de créditos.
// Responsabilidades:
// - CREAR: registrar crédito manual.
// - EDITAR: editar crédito existente.
// - VER: solo lectura, muestra la información completa del crédito.

import { useMemo, useState } from "react";
import type {
  Credito,
  CreditoCreate,
  CreditoUpdate,
} from "../../types/creditos.types";
import { creditosService } from "../../services/creditos.service";

export type CreditosFormModo = "CREAR" | "EDITAR" | "VER";

type Props = {
  modo: CreditosFormModo;
  initialCredito: Credito | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  id_venta: string;
  id_cliente: string;
  id_apertura: string;
  id_usuario: string;
  estado: string;
  total_venta: string;
  total_abonado: string;
  saldo_pendiente: string;
  fecha_vencimiento: string;
  notas: string;
};

function formatDateInput(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 10);
}

function buildInitialForm(
  modo: CreditosFormModo,
  credito: Credito | null,
): FormState {
  if ((modo === "EDITAR" || modo === "VER") && credito) {
    return {
      id_venta: String(credito.id_venta ?? ""),
      id_cliente: String(credito.id_cliente ?? ""),
      id_apertura: String(credito.id_apertura ?? ""),
      id_usuario: String(credito.id_usuario ?? ""),
      estado: credito.estado ?? "PENDIENTE",
      total_venta: String(credito.total_venta ?? 0),
      total_abonado: String(credito.total_abonado ?? 0),
      saldo_pendiente: String(credito.saldo_pendiente ?? 0),
      fecha_vencimiento: formatDateInput(credito.fecha_vencimiento),
      notas: credito.notas ?? "",
    };
  }

  return {
    id_venta: "",
    id_cliente: "",
    id_apertura: "",
    id_usuario: "",
    estado: "PENDIENTE",
    total_venta: "0",
    total_abonado: "0",
    saldo_pendiente: "0",
    fecha_vencimiento: "",
    notas: "",
  };
}

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function CreditosForm({
  modo,
  initialCredito,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialCredito),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar crédito";
    if (modo === "EDITAR") {
      return `Editar crédito: ${initialCredito?.id_venta_credito ?? ""}`;
    }
    return `Visualizar crédito: ${initialCredito?.id_venta_credito ?? ""}`;
  }, [modo, initialCredito]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };

      // Recalcular saldo automáticamente cuando cambia total o abonado
      if (key === "total_venta" || key === "total_abonado") {
        const totalVenta = toNumber(
          key === "total_venta" ? String(value) : next.total_venta,
        );
        const totalAbonado = toNumber(
          key === "total_abonado" ? String(value) : next.total_abonado,
        );
        const saldo = Math.max(0, totalVenta - totalAbonado);
        next.saldo_pendiente = String(saldo);
      }

      return next;
    });
  }

  function validar(): string {
    if (!form.id_venta.trim()) return "Te falta registrar la venta.";
    if (!form.id_cliente.trim()) return "Te falta registrar el cliente.";
    if (!form.id_apertura.trim()) return "Te falta registrar la apertura.";
    if (!form.id_usuario.trim()) return "Te falta registrar el usuario.";
    if (!form.estado.trim()) return "Te falta seleccionar el estado.";
    if (!form.fecha_vencimiento.trim())
      return "Te falta registrar la fecha de vencimiento.";

    const totalVenta = toNumber(form.total_venta);
    const totalAbonado = toNumber(form.total_abonado);
    const saldoPendiente = toNumber(form.saldo_pendiente);

    if (totalVenta < 0) return "El total de venta no puede ser menor a 0.";
    if (totalAbonado < 0) return "El total abonado no puede ser menor a 0.";
    if (saldoPendiente < 0) return "El saldo pendiente no puede ser menor a 0.";
    if (totalAbonado > totalVenta)
      return "El total abonado no puede ser mayor al total de venta.";

    const saldoEsperado = Math.max(0, totalVenta - totalAbonado);
    if (Math.abs(saldoPendiente - saldoEsperado) > 0.0001) {
      return "El saldo pendiente no coincide con el total de venta menos lo abonado.";
    }

    if (form.notas.length > 250) {
      return "Las notas no deben exceder los 250 caracteres.";
    }

    return "";
  }

  async function guardar() {
    const err = validar();
    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      if (modo === "CREAR") {
        const payload: CreditoCreate = {
          id_venta: Number(form.id_venta),
          id_cliente: Number(form.id_cliente),
          id_apertura: Number(form.id_apertura),
          id_usuario: Number(form.id_usuario),
          estado: form.estado,
          total_venta: toNumber(form.total_venta),
          total_abonado: toNumber(form.total_abonado),
          saldo_pendiente: toNumber(form.saldo_pendiente),
          fecha_vencimiento: form.fecha_vencimiento,
          notas: form.notas.trim() || null,
        };

        await creditosService.crear(payload);
        onSuccess();
        return;
      }

      if (!initialCredito) {
        setMsgError("No se encontró el crédito a editar.");
        return;
      }

      const payload: CreditoUpdate = {
        id_apertura: Number(form.id_apertura),
        id_usuario: Number(form.id_usuario),
        estado: form.estado,
        total_venta: toNumber(form.total_venta),
        total_abonado: toNumber(form.total_abonado),
        saldo_pendiente: toNumber(form.saldo_pendiente),
        fecha_vencimiento: form.fecha_vencimiento,
        notas: form.notas.trim() || null,
      };

      await creditosService.actualizar(
        initialCredito.id_venta_credito,
        payload,
      );
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
    <div className="space-y-4 text-slate-900">
      <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

      {msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {msgError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Venta */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">ID venta</label>
          <input
            type="number"
            min="1"
            value={form.id_venta}
            onChange={(e) => setField("id_venta", e.target.value)}
            disabled={readOnly || modo === "EDITAR"}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
        </div>

        {/* Cliente */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">ID cliente</label>
          <input
            type="number"
            min="1"
            value={form.id_cliente}
            onChange={(e) => setField("id_cliente", e.target.value)}
            disabled={readOnly || modo === "EDITAR"}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
        </div>

        {/* Apertura */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">ID apertura</label>
          <input
            type="number"
            min="1"
            value={form.id_apertura}
            onChange={(e) => setField("id_apertura", e.target.value)}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
        </div>

        {/* Usuario */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">ID usuario</label>
          <input
            type="number"
            min="1"
            value={form.id_usuario}
            onChange={(e) => setField("id_usuario", e.target.value)}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Estado</label>
          <select
            value={form.estado}
            onChange={(e) => setField("estado", e.target.value)}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          >
            <option value="PENDIENTE">Pendiente</option>
            <option value="PARCIAL">Parcial</option>
            <option value="PAGADO">Pagado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        {/* Fecha vencimiento */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Fecha de vencimiento</label>
          <input
            type="date"
            value={form.fecha_vencimiento}
            onChange={(e) => setField("fecha_vencimiento", e.target.value)}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
        </div>

        {/* Total venta */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Total venta</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.total_venta}
            onChange={(e) => setField("total_venta", e.target.value)}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
        </div>

        {/* Total abonado */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Total abonado</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.total_abonado}
            onChange={(e) => setField("total_abonado", e.target.value)}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-90"
          />
        </div>

        {/* Saldo pendiente */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Saldo pendiente</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.saldo_pendiente}
            disabled
            className="rounded-xl border border-black/10 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 opacity-90"
          />
        </div>

        {/* Notas */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Notas</label>
          <textarea
            value={form.notas}
            onChange={(e) => setField("notas", e.target.value)}
            disabled={readOnly}
            rows={4}
            placeholder="Observaciones del crédito..."
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 placeholder:text-slate-400 disabled:opacity-90"
          />
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
      {modo === "VER" && initialCredito ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">
              ID crédito
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialCredito.id_venta_credito}
            </div>

            <div className="text-xs font-extrabold text-black/50">Estado</div>
            <div className="text-sm font-semibold text-black/80">
              {initialCredito.estado}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Creado en
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialCredito.creado_en ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Actualizado en
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialCredito.actualizado_en ?? "-"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
