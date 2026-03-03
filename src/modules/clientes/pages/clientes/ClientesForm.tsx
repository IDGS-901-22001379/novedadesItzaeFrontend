// src/modules/clientes/pages/clientes/ClientesForm.tsx
// Formulario de clientes comerciales (page).
// Responsabilidades: estado, validación simple, guardar (API), botones y modo VER.

import { useMemo, useState } from "react";
import type {
  Cliente,
  ClienteCreate,
  ClienteUpdate,
  TipoCliente,
} from "../../types/clientes.types";
import { clientesService } from "../../services/clientes.service";

import ClientesFormFields, {
  type ClientesFormModo,
  type ClientesFormState,
} from "../../components/clientes/ClientesFormFields";

type Props = {
  modo: ClientesFormModo;
  initialCliente: Cliente | null;
  tiposDisponibles: TipoCliente[];
  onSuccess: () => void;
  onCancel: () => void;
};

function toNumberOrZero(val: string): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
}

// Extrae mensajes tipo FastAPI: { detail: "..." } o { detail: [...] }
// Traduce mensajes comunes de FastAPI/Pydantic a español
function translateFastApiMsg(msg: string): string {
  const m = msg.trim();

  const minLen = m.match(/String should have at least (\d+) characters/i);
  if (minLen) return `Debe tener al menos ${minLen[1]} caracteres.`;

  const maxLen = m.match(/String should have at most (\d+) characters/i);
  if (maxLen) return `Debe tener como máximo ${maxLen[1]} caracteres.`;

  if (/field required/i.test(m)) return "Este campo es obligatorio.";
  if (/value is not a valid integer/i.test(m))
    return "Debe ser un número entero válido.";
  if (/value is not a valid boolean/i.test(m))
    return "Debe ser verdadero o falso.";
  if (/value is not a valid float/i.test(m))
    return "Debe ser un número válido.";
  if (/none is not an allowed value/i.test(m))
    return "Este campo no puede ir vacío.";

  const ge = m.match(/ensure this value is greater than or equal to (\d+)/i);
  if (ge) return `Debe ser mayor o igual a ${ge[1]}.`;

  const gt = m.match(/ensure this value is greater than (\d+)/i);
  if (gt) return `Debe ser mayor a ${gt[1]}.`;

  const le = m.match(/ensure this value is less than or equal to (\d+)/i);
  if (le) return `Debe ser menor o igual a ${le[1]}.`;

  const lt = m.match(/ensure this value is less than (\d+)/i);
  if (lt) return `Debe ser menor a ${lt[1]}.`;

  // Si no lo reconocemos, lo dejamos tal cual (ej: "Ese número de cliente ya existe")
  return msg;
}

// Traduce nombres de campos a etiquetas bonitas
function labelCampo(field: string): string {
  const map: Record<string, string> = {
    numero_cliente: "Número de cliente",
    nombre: "Nombre",
    apellido_paterno: "Apellido paterno",
    apellido_materno: "Apellido materno",
    correo: "Correo",
    telefono: "Teléfono",
    direccion: "Dirección",
    id_tipo_cliente: "Tipo de cliente",
    credito_habilitado: "Crédito habilitado",
    credito_limite: "Límite de crédito",
    credito_dias: "Días de crédito",
    credito_observaciones: "Observaciones",
  };
  return map[field] ?? field;
}

// Extrae el campo desde loc: ["body","nombre"] o ["body", "payload", "nombre"]
function extractFieldFromLoc(loc: unknown): string {
  if (!Array.isArray(loc)) return "";
  // buscamos el último string que parezca nombre de campo
  const parts = loc.filter((x) => typeof x === "string") as string[];
  if (parts.length === 0) return "";
  return parts[parts.length - 1];
}

// Devuelve un mensaje con campo + traducción, si aplica
function getApiErrorMessage(e: unknown): string {
  if (!e || typeof e !== "object") return "Ocurrió un error al guardar.";

  const errObj = e as {
    message?: unknown;
    response?: { data?: { detail?: unknown } };
  };

  const detail = errObj.response?.data?.detail;

  // Caso: backend manda string directo (ej: 409 conflict)
  if (typeof detail === "string") return translateFastApiMsg(detail);

  // Caso: 422 FastAPI con lista de errores
  if (Array.isArray(detail)) {
    const first = detail[0] as unknown;

    if (first && typeof first === "object") {
      const firstObj = first as { loc?: unknown; msg?: unknown };

      const field = extractFieldFromLoc(firstObj.loc);
      const msg =
        typeof firstObj.msg === "string" ? firstObj.msg : "Dato inválido.";

      const msgEs = translateFastApiMsg(msg);

      if (field) return `${labelCampo(field)}: ${msgEs}`;
      return msgEs;
    }

    return "No se pudo procesar la solicitud.";
  }

  if (typeof errObj.message === "string" && errObj.message.trim()) {
    return errObj.message;
  }

  return "Ocurrió un error al guardar.";
}

function buildInitialForm(
  modo: ClientesFormModo,
  c: Cliente | null,
  tiposDisponibles: TipoCliente[],
): ClientesFormState {
  const defaultTipo = tiposDisponibles[0]?.id_tipo_cliente ?? 1;

  if ((modo === "EDITAR" || modo === "VER") && c) {
    return {
      numero_cliente: c.numero_cliente ?? "",

      nombre: c.nombre ?? "",
      apellido_paterno: c.apellido_paterno ?? "",
      apellido_materno: c.apellido_materno ?? "",

      correo: c.correo ?? "",
      telefono: c.telefono ?? "",
      direccion: c.direccion ?? "",

      id_tipo_cliente: c.id_tipo_cliente ?? defaultTipo,

      credito_habilitado: Boolean(c.credito_habilitado),
      credito_limite: String(c.credito_limite ?? 0),
      credito_dias: String(c.credito_dias ?? 0),
      credito_observaciones: c.credito_observaciones ?? "",
    };
  }

  return {
    numero_cliente: "",

    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",

    correo: "",
    telefono: "",
    direccion: "",

    id_tipo_cliente: defaultTipo,

    credito_habilitado: false,
    credito_limite: "0",
    credito_dias: "1",
    credito_observaciones: "",
  };
}

export default function ClientesForm({
  modo,
  initialCliente,
  tiposDisponibles,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<ClientesFormState>(() =>
    buildInitialForm(modo, initialCliente, tiposDisponibles),
  );

  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const subtitulo = useMemo(() => {
    const nombre = initialCliente
      ? `${initialCliente.nombre} ${initialCliente.apellido_paterno}`
      : "";
    if (modo === "CREAR") return "Registrar cliente";
    if (modo === "EDITAR") return `Editar cliente: ${nombre}`;
    return `Visualizar cliente: ${nombre}`;
  }, [modo, initialCliente]);

  function validarCrearEditar(): string {
    if (!form.nombre.trim()) return "Te falta registrar el nombre.";
    if (!form.apellido_paterno.trim())
      return "Te falta registrar el apellido paterno.";
    if (!form.id_tipo_cliente || form.id_tipo_cliente <= 0)
      return "Te falta seleccionar el tipo de cliente.";

    if (form.credito_habilitado) {
      const limite = toNumberOrZero(form.credito_limite);
      const dias = toNumberOrZero(form.credito_dias);
      if (limite < 0) return "El límite de crédito no puede ser negativo.";
      if (dias <= 0) return "Los días de crédito deben ser mayor a 0.";
    }

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
        const payload: ClienteCreate = {
          nombre: form.nombre.trim(),
          apellido_paterno: form.apellido_paterno.trim(),
          apellido_materno: form.apellido_materno.trim() || null,
          correo: form.correo.trim() || null,
          telefono: form.telefono.trim() || null,
          direccion: form.direccion.trim() || null,
          id_tipo_cliente: form.id_tipo_cliente,

          credito_habilitado: form.credito_habilitado,
          credito_limite: toNumberOrZero(form.credito_limite),
          credito_dias: toNumberOrZero(form.credito_dias),
          credito_observaciones: form.credito_observaciones.trim() || null,
        };

        // Como antes: solo se manda numero_cliente si viene con texto
        if (form.numero_cliente.trim()) {
          payload.numero_cliente = form.numero_cliente.trim();
        }

        await clientesService.crear(payload);
        onSuccess();
        return;
      }

      if (!initialCliente) {
        setMsgError("No se encontró el cliente a editar.");
        return;
      }

      const payload: ClienteUpdate = {
        nombre: form.nombre.trim(),
        apellido_paterno: form.apellido_paterno.trim(),
        apellido_materno: form.apellido_materno.trim() || null,
        correo: form.correo.trim() || null,
        telefono: form.telefono.trim() || null,
        direccion: form.direccion.trim() || null,
        id_tipo_cliente: form.id_tipo_cliente,

        credito_habilitado: form.credito_habilitado,
        credito_limite: toNumberOrZero(form.credito_limite),
        credito_dias: toNumberOrZero(form.credito_dias),
        credito_observaciones: form.credito_observaciones.trim() || null,
      };

      await clientesService.actualizar(initialCliente.id_cliente, payload);
      onSuccess();
    } catch (e: unknown) {
      // Aquí es donde mostramos el mensaje exacto del backend (detail)
      setMsgError(getApiErrorMessage(e));
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

      <ClientesFormFields
        modo={modo}
        readOnly={readOnly}
        tiposDisponibles={tiposDisponibles}
        form={form}
        setForm={setForm}
      />

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
            className={[
              "rounded-xl px-4 py-2 text-sm font-extrabold shadow-sm transition disabled:opacity-50",
              "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]",
            ].join(" ")}
          >
            {saving
              ? "Guardando..."
              : modo === "CREAR"
                ? "Crear"
                : "Actualizar"}
          </button>
        </div>
      ) : null}

      {modo === "VER" && initialCliente ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">
              ID Cliente
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialCliente.id_cliente}
            </div>

            <div className="text-xs font-extrabold text-black/50">Estatus</div>
            <div className="text-sm font-semibold text-black/80">
              {initialCliente.estatus}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Fecha registro
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialCliente.fecha_registro ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Última compra
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialCliente.fecha_ultima_compra ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Crédito habilitado
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialCliente.credito_habilitado ? "Sí" : "No"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Límite / Días
            </div>
            <div className="text-sm font-semibold text-black/80">
              {String(initialCliente.credito_limite ?? 0)} /{" "}
              {String(initialCliente.credito_dias ?? 0)}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
