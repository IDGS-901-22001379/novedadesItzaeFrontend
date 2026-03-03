// src/modules/empleados/pages/empleados/EmpleadosForm.tsx
// Formulario de empleados.
// Responsabilidades:
// - CREAR: registrar empleado (nombre, apellidos, teléfono, dirección, puesto, estatus).
// - EDITAR: editar empleado (mismo diseño que crear, precargado).
// - VER: solo lectura, muestra toda la información + acceso (si tiene usuario asignado).

import { useMemo, useState } from "react";
import type {
  Empleado,
  EmpleadoCreate,
  EmpleadoUpdate,
  EmpleadoEstatus,
} from "../../types/empleados.types";
import { empleadosService } from "../../services/empleados.service";

export type EmpleadosFormModo = "CREAR" | "EDITAR" | "VER";

type Props = {
  modo: EmpleadosFormModo;
  initialEmpleado: Empleado | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;

  telefono: string;
  direccion: string;

  puesto: string;
  estatus: EmpleadoEstatus;
};

function buildInitialForm(
  modo: EmpleadosFormModo,
  e: Empleado | null,
): FormState {
  if ((modo === "EDITAR" || modo === "VER") && e) {
    return {
      nombre: e.nombre ?? "",
      apellido_paterno: e.apellido_paterno ?? "",
      apellido_materno: e.apellido_materno ?? "",

      telefono: e.telefono ?? "",
      direccion: e.direccion ?? "",

      puesto: e.puesto ?? "",
      estatus: (e.estatus ?? "ACTIVO") as EmpleadoEstatus,
    };
  }

  return {
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",

    telefono: "",
    direccion: "",

    puesto: "",
    estatus: "ACTIVO",
  };
}

function fullName(
  form: Pick<FormState, "nombre" | "apellido_paterno" | "apellido_materno">,
) {
  return `${form.nombre} ${form.apellido_paterno} ${form.apellido_materno}`
    .replace(/\s+/g, " ")
    .trim();
}

export default function EmpleadosForm({
  modo,
  initialEmpleado,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialEmpleado),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar empleado";
    if (modo === "EDITAR") return `Editar empleado: ${fullName(form)}`;
    return `Visualizar empleado: ${fullName(form)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    modo,
    initialEmpleado,
    form.nombre,
    form.apellido_paterno,
    form.apellido_materno,
  ]);

  function validarCrearEditar(): string {
    if (!form.nombre.trim()) return "Te falta registrar el nombre.";
    if (!form.apellido_paterno.trim())
      return "Te falta registrar el apellido paterno.";
    if (!form.apellido_materno.trim())
      return "Te falta registrar el apellido materno.";
    if (!form.puesto.trim()) return "Te falta registrar el puesto.";
    if (!form.estatus) return "Te falta seleccionar el estatus.";
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
        const payload: EmpleadoCreate = {
          nombre: form.nombre.trim(),
          apellido_paterno: form.apellido_paterno.trim(),
          apellido_materno: form.apellido_materno.trim(),
          telefono: form.telefono?.trim() || null,
          direccion: form.direccion?.trim() || null,
          puesto: form.puesto.trim(),
          estatus: form.estatus,
        };

        await empleadosService.crear(payload);
        onSuccess();
        return;
      }

      // EDITAR
      if (!initialEmpleado) {
        setMsgError("No se encontró el empleado a editar.");
        return;
      }

      const payload: EmpleadoUpdate = {
        nombre: form.nombre.trim(),
        apellido_paterno: form.apellido_paterno.trim(),
        apellido_materno: form.apellido_materno.trim(),
        telefono: form.telefono?.trim() || null,
        direccion: form.direccion?.trim() || null,
        puesto: form.puesto.trim(),
        estatus: form.estatus,
      };

      await empleadosService.actualizar(initialEmpleado.id_empleado, payload);
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
        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Nombre</label>
          <input
            value={form.nombre}
            onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Puesto */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Puesto</label>
          <input
            value={form.puesto}
            onChange={(e) => setForm((p) => ({ ...p, puesto: e.target.value }))}
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Apellido paterno */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Apellido paterno</label>
          <input
            value={form.apellido_paterno}
            onChange={(e) =>
              setForm((p) => ({ ...p, apellido_paterno: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Apellido materno */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Apellido materno</label>
          <input
            value={form.apellido_materno}
            onChange={(e) =>
              setForm((p) => ({ ...p, apellido_materno: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Teléfono</label>
          <input
            value={form.telefono}
            onChange={(e) =>
              setForm((p) => ({ ...p, telefono: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Estatus */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Estatus</label>
          <select
            value={form.estatus}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                estatus: e.target.value as EmpleadoEstatus,
              }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          >
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>

        {/* Dirección */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Dirección</label>
          <input
            value={form.direccion}
            onChange={(e) =>
              setForm((p) => ({ ...p, direccion: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
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
            className={[
              "rounded-xl px-4 py-2 text-sm font-extrabold text-white shadow-sm transition disabled:opacity-50",
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

      {/* Visualización extra (info completa) */}
      {modo === "VER" && initialEmpleado ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">
              ID Empleado
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialEmpleado.id_empleado}
            </div>

            <div className="text-xs font-extrabold text-black/50">Estatus</div>
            <div className="text-sm font-semibold text-black/80">
              {initialEmpleado.estatus}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Usuario asignado
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialEmpleado.tiene_usuario
                ? (initialEmpleado.username ?? "-")
                : "Sin acceso"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Estatus usuario
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialEmpleado.tiene_usuario
                ? (initialEmpleado.estatus_usuario ?? "-")
                : "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Dirección
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialEmpleado.direccion ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">Teléfono</div>
            <div className="text-sm font-semibold text-black/80">
              {initialEmpleado.telefono ?? "-"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
