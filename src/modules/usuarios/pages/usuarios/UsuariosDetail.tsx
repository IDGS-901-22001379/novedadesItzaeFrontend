// src/modules/usuarios/pages/usuarios/UsuariosDetail.tsx
// Pantalla de detalle de usuario.
// Responsabilidades: leer id_usuario desde la URL, consultar GET /usuarios/{id_usuario},
// mostrar estados (loading/error) y renderizar tarjetas de información con estilo morado.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usuariosService } from "../../services/usuarios.service";
import type { User } from "../../types/usuarios.types";

type LoadState = "idle" | "loading" | "success" | "error";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "No se pudo cargar el detalle del usuario.";
}

export default function UsuariosDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const id_usuario = Number(params.id_usuario);

  const [state, setState] = useState<LoadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  const cargar = useCallback(async () => {
    if (!Number.isFinite(id_usuario) || id_usuario <= 0) {
      setState("error");
      setErrorMsg("ID de usuario inválido.");
      return;
    }

    try {
      setState("loading");
      setErrorMsg("");

      const data = await usuariosService.obtener(id_usuario);
      setUser(data);

      setState("success");
    } catch (error: unknown) {
      setState("error");
      setErrorMsg(getErrorMessage(error));
    }
  }, [id_usuario]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!Number.isFinite(id_usuario) || id_usuario <= 0) {
        if (!mounted) return;
        setState("error");
        setErrorMsg("ID de usuario inválido.");
        return;
      }

      try {
        if (!mounted) return;
        setState("loading");
        setErrorMsg("");

        const data = await usuariosService.obtener(id_usuario);
        if (!mounted) return;

        setUser(data);
        setState("success");
      } catch (error: unknown) {
        if (!mounted) return;
        setState("error");
        setErrorMsg(getErrorMessage(error));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id_usuario]);

  const badgeEstatus = useMemo(() => {
    if (!user) return null;

    const base =
      "inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold";
    if (user.estatus === "ACTIVO") {
      return (
        <span className={`${base} border-[#7B2CBF]/30 bg-[#C77DFF]/20 text-[#5A189A]`}>
          ACTIVO
        </span>
      );
    }
    return (
      <span className={`${base} border-[#5A189A]/30 bg-[#E0AAFF]/35 text-[#5A189A]`}>
        INACTIVO
      </span>
    );
  }, [user]);

  return (
    <div className="p-4">
      <div className="rounded-3xl border border-[#7B2CBF]/30 bg-gradient-to-br from-[#5A189A]/10 via-[#9D4EDD]/10 to-[#E6BBFF]/20 p-4 shadow-sm shadow-[#5A189A]/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#5A189A]">
              Detalle de usuario
            </h1>
            <div className="mt-1 text-sm font-semibold text-[#7B2CBF]">
              ID: <span className="font-extrabold text-[#5A189A]">{Number.isFinite(id_usuario) ? id_usuario : "-"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-[#7B2CBF]/40 bg-white px-4 py-2 text-sm font-semibold text-[#5A189A] shadow-sm shadow-[#5A189A]/10 hover:bg-[#E0AAFF]/20"
            >
              Volver
            </button>

            <button
              type="button"
              onClick={() => void cargar()}
              disabled={state === "loading"}
              className="rounded-xl bg-[#7B2CBF] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#5A189A]/20 hover:bg-[#5A189A] disabled:opacity-50"
            >
              Recargar
            </button>
          </div>
        </div>

        <div className="mt-4">
          {state === "loading" && (
            <div className="rounded-2xl border border-[#7B2CBF]/35 bg-[#E0AAFF]/20 p-4 text-sm font-semibold text-[#5A189A] shadow-sm shadow-[#5A189A]/10">
              Cargando detalle...
            </div>
          )}

          {state === "error" && (
            <div className="rounded-2xl border border-[#7B2CBF]/35 bg-white/80 p-4 shadow-sm shadow-[#5A189A]/10">
              <div className="text-sm font-semibold text-[#5A189A]">
                Error: <span className="font-normal text-[#7B2CBF]">{errorMsg}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void cargar()}
                  className="rounded-xl bg-[#9D4EDD] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#5A189A]/20 hover:bg-[#7B2CBF]"
                >
                  Reintentar
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/usuarios")}
                  className="rounded-xl border border-[#7B2CBF]/40 bg-white px-4 py-2 text-sm font-semibold text-[#5A189A] hover:bg-[#E0AAFF]/20"
                >
                  Ir a lista
                </button>
              </div>
            </div>
          )}

          {state === "success" && user && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#7B2CBF]/35 bg-white/85 p-4 shadow-sm shadow-[#5A189A]/10 lg:col-span-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#5A189A]">
                      Información general
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-[#7B2CBF]">
                      Datos principales del usuario
                    </p>
                  </div>
                  {badgeEstatus}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#7B2CBF]/25 bg-[#E6BBFF]/20 p-3">
                    <div className="text-xs font-extrabold text-[#5A189A]">Usuario</div>
                    <div className="mt-1 text-sm font-semibold text-[#5A189A]">{user.username}</div>
                  </div>

                  <div className="rounded-xl border border-[#7B2CBF]/25 bg-[#E6BBFF]/20 p-3">
                    <div className="text-xs font-extrabold text-[#5A189A]">Rol (id)</div>
                    <div className="mt-1 text-sm font-semibold text-[#5A189A]">{user.id_rol}</div>
                  </div>

                  <div className="rounded-xl border border-[#7B2CBF]/25 bg-[#E6BBFF]/20 p-3">
                    <div className="text-xs font-extrabold text-[#5A189A]">Nombre en ticket</div>
                    <div className="mt-1 text-sm font-semibold text-[#5A189A]">{user.nombre_en_ticket}</div>
                  </div>

                  <div className="rounded-xl border border-[#7B2CBF]/25 bg-[#E6BBFF]/20 p-3">
                    <div className="text-xs font-extrabold text-[#5A189A]">Teléfono</div>
                    <div className="mt-1 text-sm font-semibold text-[#5A189A]">
                      {user.telefono_opcional ? user.telefono_opcional : "No registrado"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#7B2CBF]/25 bg-[#E6BBFF]/20 p-3">
                    <div className="text-xs font-extrabold text-[#5A189A]">Empleado (id)</div>
                    <div className="mt-1 text-sm font-semibold text-[#5A189A]">
                      {user.id_empleado ?? "No asignado"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#7B2CBF]/25 bg-[#E6BBFF]/20 p-3">
                    <div className="text-xs font-extrabold text-[#5A189A]">Estatus</div>
                    <div className="mt-1 text-sm font-semibold text-[#5A189A]">{user.estatus}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#7B2CBF]/35 bg-white/85 p-4 shadow-sm shadow-[#5A189A]/10">
                <h2 className="text-lg font-extrabold text-[#5A189A]">Actividad</h2>
                <p className="mt-1 text-sm font-semibold text-[#7B2CBF]">
                  Fechas relevantes del usuario
                </p>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-[#7B2CBF]/25 bg-[#E6BBFF]/20 p-3">
                    <div className="text-xs font-extrabold text-[#5A189A]">Fecha alta</div>
                    <div className="mt-1 text-sm font-semibold text-[#5A189A]">
                      {user.fecha_alta ? user.fecha_alta : "No disponible"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#7B2CBF]/25 bg-[#E6BBFF]/20 p-3">
                    <div className="text-xs font-extrabold text-[#5A189A]">Último acceso</div>
                    <div className="mt-1 text-sm font-semibold text-[#5A189A]">
                      {user.ultimo_acceso ? user.ultimo_acceso : "No disponible"}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#7B2CBF]/25 bg-[#E6BBFF]/20 p-3">
                    <div className="text-xs font-extrabold text-[#5A189A]">Creado por (id)</div>
                    <div className="mt-1 text-sm font-semibold text-[#5A189A]">
                      {user.creado_por ?? "No disponible"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#7B2CBF]/25 bg-[#C77DFF]/10 p-3">
                  <div className="text-xs font-extrabold text-[#5A189A]">Acciones</div>
                  <div className="mt-2 text-sm font-semibold text-[#7B2CBF]">
                    En el siguiente paso puedes enlazar aquí:
                    editar, cambiar estatus y cambiar password.
                  </div>
                </div>
              </div>
            </div>
          )}

          {state === "success" && !user && (
            <div className="rounded-2xl border border-[#7B2CBF]/35 bg-[#E0AAFF]/20 p-4 text-sm font-semibold text-[#5A189A] shadow-sm shadow-[#5A189A]/10">
              No se encontró información del usuario.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}