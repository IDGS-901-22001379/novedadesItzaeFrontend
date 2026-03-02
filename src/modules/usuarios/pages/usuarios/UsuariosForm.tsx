// src/modules/usuarios/pages/usuarios/UsuariosForm.tsx
// Formulario de usuarios.
// Responsabilidades:
// - CREAR: registrar usuario (empleado por nombre, rol, usuario, nombre en ticket, teléfono, contraseña).
// - EDITAR: editar usuario (mismo diseño que crear, precargado, sin contraseña visible).
// - EDITAR: cambiar contraseña con 2 campos (nueva + confirmar) y botón verde Guardar.
// - VER: solo lectura, muestra toda la información excepto contraseña.

import { useMemo, useState } from "react";
import type { User, UserCreate, UserUpdate } from "../../types/usuarios.types";
import { usuariosService } from "../../services/usuarios.service";
import { ROLES } from "../../constants/roles";
import EmpleadoAutocomplete from "../../components/usuarios/EmpleadoAutocomplete";

export type UsuariosFormModo = "CREAR" | "EDITAR" | "VER";

type Props = {
  modo: UsuariosFormModo;
  initialUser: User | null;
  onSuccess: () => void;
  onCancel: () => void;
};

type FormState = {
  id_empleado: number;
  empleado_nombre: string;

  id_rol: number;
  username: string;
  nombre_en_ticket: string;
  telefono_opcional: string;

  password: string; // solo CREAR
};

function buildInitialForm(modo: UsuariosFormModo, u: User | null): FormState {
  if ((modo === "EDITAR" || modo === "VER") && u) {
    const idEmp = u.id_empleado ?? 0;
    return {
      id_empleado: idEmp,
      empleado_nombre: idEmp > 0 ? `Empleado #${idEmp}` : "",

      id_rol: u.id_rol ?? 1,
      username: u.username ?? "",
      nombre_en_ticket: u.nombre_en_ticket ?? "",
      telefono_opcional: u.telefono_opcional ?? "",

      password: "",
    };
  }

  return {
    id_empleado: 0,
    empleado_nombre: "",

    id_rol: 1,
    username: "",
    nombre_en_ticket: "",
    telefono_opcional: "",

    password: "",
  };
}

export default function UsuariosForm({
  modo,
  initialUser,
  onSuccess,
  onCancel,
}: Props) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialUser),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  // Password (solo editar)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [msgPass, setMsgPass] = useState<string>("");

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar usuario";
    if (modo === "EDITAR")
      return `Editar usuario: ${initialUser?.username ?? ""}`;
    return `Visualizar usuario: ${initialUser?.username ?? ""}`;
  }, [modo, initialUser]);

  function validarCrearEditar(): string {
    if (!form.username.trim()) return "Te falta registrar el usuario.";
    if (!form.nombre_en_ticket.trim())
      return "Te falta registrar el nombre en ticket.";
    if (!form.id_rol || form.id_rol <= 0) return "Te falta seleccionar el rol.";

    if (modo === "CREAR") {
      if (!form.id_empleado || form.id_empleado <= 0)
        return "Te falta seleccionar el empleado.";
      if (!form.password.trim()) return "Te falta registrar la contraseña.";
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
        const payload: UserCreate = {
          id_empleado: form.id_empleado,
          id_rol: form.id_rol,
          username: form.username.trim(),
          password: form.password,
          nombre_en_ticket: form.nombre_en_ticket.trim(),
          telefono_opcional: form.telefono_opcional?.trim() || null,
        };

        await usuariosService.crear(payload);
        onSuccess();
        return;
      }

      // EDITAR
      if (!initialUser) {
        setMsgError("No se encontró el usuario a editar.");
        return;
      }

      const payload: UserUpdate = {
        id_rol: form.id_rol,
        username: form.username.trim(),
        nombre_en_ticket: form.nombre_en_ticket.trim(),
        telefono_opcional: form.telefono_opcional?.trim() || null,
      };

      await usuariosService.actualizar(initialUser.id_usuario, payload);
      onSuccess();
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Ocurrió un error al guardar.";
      setMsgError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function guardarPassword() {
    if (!initialUser) return;

    if (!newPassword.trim()) {
      setMsgPass("Te falta registrar la nueva contraseña.");
      return;
    }
    if (!confirmPassword.trim()) {
      setMsgPass("Te falta confirmar la contraseña.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsgPass("Las contraseñas no coinciden.");
      return;
    }

    try {
      setChangingPass(true);
      setMsgPass("");

      const resp = await usuariosService.cambiarPassword(
        initialUser.id_usuario,
        {
          new_password: newPassword,
        },
      );

      setMsgPass(resp || "Contraseña actualizada.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "No se pudo cambiar la contraseña.";
      setMsgPass(msg);
    } finally {
      setChangingPass(false);
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
        {/* Empleado (en CREAR y EDITAR se muestra; en VER solo lectura) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Empleado</label>

          {readOnly ? (
            <input
              value={
                form.empleado_nombre ||
                (form.id_empleado > 0 ? `Empleado #${form.id_empleado}` : "")
              }
              disabled
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />
          ) : (
            <EmpleadoAutocomplete
              valueId={form.id_empleado}
              valueLabel={form.empleado_nombre}
              onPick={(emp) =>
                setForm((p) => ({
                  ...p,
                  id_empleado: emp.id_empleado,
                  empleado_nombre: emp.nombre,
                }))
              }
            />
          )}
        </div>

        {/* Rol */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Rol</label>
          <select
            value={String(form.id_rol)}
            onChange={(e) =>
              setForm((p) => ({ ...p, id_rol: Number(e.target.value) }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={String(r.id)}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Usuario */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Usuario</label>
          <input
            value={form.username}
            onChange={(e) =>
              setForm((p) => ({ ...p, username: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Nombre en ticket */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Nombre en ticket</label>
          <input
            value={form.nombre_en_ticket}
            onChange={(e) =>
              setForm((p) => ({ ...p, nombre_en_ticket: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="text-xs font-extrabold">Teléfono (opcional)</label>
          <input
            value={form.telefono_opcional}
            onChange={(e) =>
              setForm((p) => ({ ...p, telefono_opcional: e.target.value }))
            }
            disabled={readOnly}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
          />
        </div>

        {/* Contraseña solo en CREAR */}
        {modo === "CREAR" ? (
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-xs font-extrabold">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
            />
          </div>
        ) : null}
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
              modo === "CREAR"
                ? "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]"
                : "bg-[#34f334] text-[#0b2b0b] hover:bg-[#2fe72f]",
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

      {/* Cambiar contraseña SOLO en EDITAR */}
      {modo === "EDITAR" && initialUser ? (
        <div className="mt-6 rounded-2xl border border-black/10 bg-black/5 p-4">
          <div className="text-sm font-extrabold text-black/70">
            Cambiar contraseña
          </div>

          {msgPass ? (
            <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
              {msgPass}
            </div>
          ) : null}

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 md:items-end">
            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-xs font-extrabold">Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-xs font-extrabold">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
              />
            </div>

            <div className="md:col-span-1">
              <button
                type="button"
                onClick={() => void guardarPassword()}
                disabled={changingPass}
                className="w-full rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] hover:bg-[#2fe72f] disabled:opacity-50"
              >
                {changingPass ? "Guardando..." : "Guardar password"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Visualización extra (info completa) */}
      {modo === "VER" && initialUser ? (
        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="text-xs font-extrabold text-black/50">
              ID Usuario
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialUser.id_usuario}
            </div>

            <div className="text-xs font-extrabold text-black/50">Estatus</div>
            <div className="text-sm font-semibold text-black/80">
              {initialUser.estatus}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Fecha alta
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialUser.fecha_alta ?? "-"}
            </div>

            <div className="text-xs font-extrabold text-black/50">
              Último acceso
            </div>
            <div className="text-sm font-semibold text-black/80">
              {initialUser.ultimo_acceso ?? "-"}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
