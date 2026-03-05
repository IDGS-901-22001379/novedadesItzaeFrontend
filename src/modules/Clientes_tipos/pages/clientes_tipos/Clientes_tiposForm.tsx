// src/modules/clientes_tipos/pages/clientes_tipos/Clientes_tiposForm.tsx
// Formulario de tipos de cliente.
// Responsabilidades:
// - CREAR: registrar tipo de cliente.
// - EDITAR: editar tipo de cliente.
// - VER: solo lectura, muestra la información completa.

import { useMemo, useState } from "react";
import type {
  ClienteTipo,
  ClienteTipoCreate,
  ClienteTipoUpdate,
} from "../../types/clientes.types";
import { clientesTiposService } from "../../services/clientes_tipos.service";
import { getApiErrorMessage } from "../../../../services/http/getApiErrorMessage";

export type ClientesTiposFormModo = "CREAR" | "EDITAR" | "VER";

type Props = {
  modo: ClientesTiposFormModo;
  initialTipoCliente: ClienteTipo | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  nombre: string;
  descripcion: string;
  activo: boolean;
};

function buildInitialForm(
  modo: ClientesTiposFormModo,
  item: ClienteTipo | null,
): FormState {
  if ((modo === "EDITAR" || modo === "VER") && item) {
    return {
      nombre: item.nombre ?? "",
      descripcion: item.descripcion ?? "",
      activo: item.activo ?? true,
    };
  }

  return {
    nombre: "",
    descripcion: "",
    activo: true,
  };
}

export default function Clientes_tiposForm({
  modo,
  initialTipoCliente,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialTipoCliente),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar tipo de cliente";
    if (modo === "EDITAR") {
      return `Editar tipo de cliente: ${initialTipoCliente?.nombre ?? ""}`;
    }
    return `Visualizar tipo de cliente: ${initialTipoCliente?.nombre ?? ""}`;
  }, [modo, initialTipoCliente]);

  function validar(): string {
    if (!form.nombre.trim()) {
      return "Te falta registrar el nombre del tipo de cliente.";
    }

    if (form.nombre.trim().length < 3) {
      return "El nombre del tipo de cliente debe tener al menos 3 caracteres.";
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
        const payload: ClienteTipoCreate = {
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          activo: form.activo,
        };

        await clientesTiposService.crear(payload);
        onSuccess();
        return;
      }

      if (!initialTipoCliente) {
        setMsgError("No se encontró el tipo de cliente a editar.");
        return;
      }

      const payload: ClienteTipoUpdate = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        activo: form.activo,
      };

      await clientesTiposService.actualizar(
        initialTipoCliente.id_tipo_cliente,
        payload,
      );

      onSuccess();
    } catch (e: unknown) {
      setMsgError(getApiErrorMessage(e, "Ocurrió un error al guardar."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="text-xs font-extrabold text-black/70 sm:text-sm">
        {subtitulo}
      </div>

      {msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700 sm:px-4 sm:py-3 sm:text-sm">
          {msgError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3">
        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-extrabold sm:text-xs">
            Nombre
          </label>
          <input
            value={form.nombre}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nombre: e.target.value }))
            }
            disabled={readOnly}
            placeholder="Ejemplo: VIP"
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold disabled:opacity-90 sm:text-sm"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-extrabold sm:text-xs">
            Descripción
          </label>
          <textarea
            value={form.descripcion}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, descripcion: e.target.value }))
            }
            disabled={readOnly}
            rows={3}
            placeholder="Descripción del tipo de cliente..."
            className="resize-none rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold disabled:opacity-90 sm:text-sm"
          />
        </div>

        {/* Estatus */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-extrabold sm:text-xs">
            Estatus
          </label>
          <select
            value={form.activo ? "true" : "false"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                activo: e.target.value === "true",
              }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold disabled:opacity-90 sm:text-sm"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      {modo !== "VER" ? (
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-extrabold text-black/70 hover:bg-black/5 sm:px-4 sm:py-2 sm:text-sm"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void guardar()}
            disabled={saving}
            className="rounded-xl bg-[#34f334] px-3 py-1.5 text-xs font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f] disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
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
      {modo === "VER" && initialTipoCliente ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="text-[11px] font-extrabold text-black/50 sm:text-xs">
              ID Tipo de cliente
            </div>
            <div className="text-xs font-semibold text-black/80 sm:text-sm">
              {initialTipoCliente.id_tipo_cliente}
            </div>

            <div className="text-[11px] font-extrabold text-black/50 sm:text-xs">
              Nombre
            </div>
            <div className="text-xs font-semibold text-black/80 sm:text-sm">
              {initialTipoCliente.nombre}
            </div>

            <div className="text-[11px] font-extrabold text-black/50 sm:text-xs">
              Descripción
            </div>
            <div className="text-xs font-semibold text-black/80 sm:text-sm">
              {initialTipoCliente.descripcion || "-"}
            </div>

            <div className="text-[11px] font-extrabold text-black/50 sm:text-xs">
              Estatus
            </div>
            <div className="text-xs font-semibold text-black/80 sm:text-sm">
              {initialTipoCliente.activo ? "ACTIVO" : "INACTIVO"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
