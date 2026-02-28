// src/modules/usuarios/pages/usuarios/UsuariosForm.tsx
// Formulario reutilizable para Crear / Editar usuarios.
// Modo "create": POST /usuarios (incluye password)
// Modo "edit":   PUT /usuarios/{id_usuario} (sin password)

import { useEffect, useMemo, useState } from "react";
import { usuariosService } from "../../services/usuarios.service";
import type { User, UserCreate, UserUpdate } from "../../types/usuarios.types";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  user?: User | null;

  onCancel: () => void;
  onSuccess: () => void;

  roleOptions?: number[];
};

type FieldErrors = Partial<Record<keyof (UserCreate & UserUpdate), string>> & {
  general?: string;
};

function isNonEmpty(v: string) {
  return v.trim().length > 0;
}

export default function UsuariosForm({
  mode,
  user,
  onCancel,
  onSuccess,
  roleOptions,
}: Props) {
  const isEdit = mode === "edit";

  const [id_empleado, setIdEmpleado] = useState<string>("");
  const [id_rol, setIdRol] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nombre_en_ticket, setNombreEnTicket] = useState<string>("");
  const [telefono_opcional, setTelefonoOpcional] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const title = useMemo(() => {
    if (isEdit) return "Editar usuario";
    return "Nuevo usuario";
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit) return;

    setIdEmpleado(user?.id_empleado ? String(user.id_empleado) : "");
    setIdRol(user?.id_rol ? String(user.id_rol) : "");
    setUsername(user?.username ?? "");
    setNombreEnTicket(user?.nombre_en_ticket ?? "");
    setTelefonoOpcional(user?.telefono_opcional ?? "");
    setPassword("");
    setErrors({});
  }, [isEdit, user]);

  useEffect(() => {
    if (isEdit) return;

    setIdEmpleado("");
    setIdRol("");
    setUsername("");
    setPassword("");
    setNombreEnTicket("");
    setTelefonoOpcional("");
    setErrors({});
  }, [isEdit]);

  function validate(): boolean {
    const next: FieldErrors = {};

    if (!isEdit) {
      if (!isNonEmpty(id_empleado)) next.id_empleado = "El empleado es requerido.";
      else if (Number.isNaN(Number(id_empleado)) || Number(id_empleado) <= 0)
        next.id_empleado = "Debe ser un número válido.";
    }

    if (!isNonEmpty(id_rol)) next.id_rol = "El rol es requerido.";
    else if (Number.isNaN(Number(id_rol)) || Number(id_rol) <= 0)
      next.id_rol = "Debe ser un número válido.";

    if (!isNonEmpty(username)) next.username = "El usuario es requerido.";
    else if (username.trim().length < 3) next.username = "Mínimo 3 caracteres.";
    else if (username.trim().length > 50) next.username = "Máximo 50 caracteres.";

    if (!isEdit) {
      if (!isNonEmpty(password)) next.password = "La contraseña es requerida.";
      else if (password.length < 6) next.password = "Mínimo 6 caracteres.";
      else if (password.length > 120) next.password = "Máximo 120 caracteres.";
    }

    if (!isNonEmpty(nombre_en_ticket)) next.nombre_en_ticket = "El nombre en ticket es requerido.";
    else if (nombre_en_ticket.trim().length < 3) next.nombre_en_ticket = "Mínimo 3 caracteres.";
    else if (nombre_en_ticket.trim().length > 80) next.nombre_en_ticket = "Máximo 80 caracteres.";

    if (telefono_opcional.trim().length > 0 && telefono_opcional.trim().length > 30) {
      next.telefono_opcional = "Máximo 30 caracteres.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;

    const ok = validate();
    if (!ok) return;

    try {
      setSaving(true);
      setErrors({});

      if (!isEdit) {
        const payload: UserCreate = {
          id_empleado: Number(id_empleado),
          id_rol: Number(id_rol),
          username: username.trim(),
          password,
          nombre_en_ticket: nombre_en_ticket.trim(),
          telefono_opcional: telefono_opcional.trim() ? telefono_opcional.trim() : null,
        };

        await usuariosService.crear(payload);
        onSuccess();
        return;
      }

      if (!user?.id_usuario) {
        setErrors({ general: "No se pudo identificar el usuario a editar." });
        return;
      }

      const payload: UserUpdate = {
        id_rol: Number(id_rol),
        username: username.trim(),
        nombre_en_ticket: nombre_en_ticket.trim(),
        telefono_opcional: telefono_opcional.trim() ? telefono_opcional.trim() : null,
      };

      await usuariosService.actualizar(user.id_usuario, payload);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ocurrió un error al guardar.";
      setErrors({ general: msg });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="px-4 py-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-violet-900">{title}</h3>
        <p className="mt-1 text-sm text-violet-700">
          {isEdit
            ? "Modifica los datos del usuario y guarda los cambios."
            : "Registra un usuario nuevo asignando empleado, rol y credenciales."}
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {!isEdit && (
          <div>
            <label className="text-xs font-medium text-violet-700">ID Empleado</label>
            <input
              value={id_empleado}
              onChange={(e) => setIdEmpleado(e.target.value)}
              className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-violet-900 placeholder:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
              placeholder="Ej: 1"
            />
            {errors.id_empleado && <p className="mt-1 text-xs text-rose-700">{errors.id_empleado}</p>}
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-violet-700">Rol (id)</label>

          {roleOptions && roleOptions.length > 0 ? (
            <select
              value={id_rol}
              onChange={(e) => setIdRol(e.target.value)}
              className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <option value="">Selecciona un rol</option>
              {roleOptions.map((id) => (
                <option key={id} value={String(id)}>
                  {id}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={id_rol}
              onChange={(e) => setIdRol(e.target.value)}
              className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-violet-900 placeholder:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
              placeholder="Ej: 1"
            />
          )}

          {errors.id_rol && <p className="mt-1 text-xs text-rose-700">{errors.id_rol}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-violet-700">Usuario</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-violet-900 placeholder:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Ej: yael_admin"
          />
          {errors.username && <p className="mt-1 text-xs text-rose-700">{errors.username}</p>}
        </div>

        {!isEdit && (
          <div>
            <label className="text-xs font-medium text-violet-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-violet-900 placeholder:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
              placeholder="Mínimo 6 caracteres"
            />
            {errors.password && <p className="mt-1 text-xs text-rose-700">{errors.password}</p>}
          </div>
        )}

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-violet-700">Nombre en ticket</label>
          <input
            value={nombre_en_ticket}
            onChange={(e) => setNombreEnTicket(e.target.value)}
            className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-violet-900 placeholder:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Ej: Yael (Administrador)"
          />
          {errors.nombre_en_ticket && (
            <p className="mt-1 text-xs text-rose-700">{errors.nombre_en_ticket}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-violet-700">Teléfono (opcional)</label>
          <input
            value={telefono_opcional}
            onChange={(e) => setTelefonoOpcional(e.target.value)}
            className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-violet-900 placeholder:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Ej: 4771234567"
          />
          {errors.telefono_opcional && (
            <p className="mt-1 text-xs text-rose-700">{errors.telefono_opcional}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}