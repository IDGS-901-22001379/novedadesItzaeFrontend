// src/modules/auth/pages/auth/LoginPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../shared/hooks/useAuth";
import { HOME_BY_ROLE } from "../../../../config/routes";
import { toAppRol } from "../../../../config/roles";

function getErrorMessage(err: unknown): string {
  const detail =
    err &&
    typeof err === "object" &&
    "response" in err &&
    (err as { response?: { data?: { detail?: unknown } } }).response?.data
      ?.detail;

  if (typeof detail === "string" && detail.trim().length > 0) return detail;

  const message =
    err && typeof err === "object" && "message" in err
      ? (err as { message?: unknown }).message
      : null;

  if (typeof message === "string" && message.trim().length > 0) return message;

  return "No se pudo iniciar sesión. Verifica usuario y contraseña.";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await login({ username, password });
      const appRol = toAppRol(res.rol);
      const target = appRol ? HOME_BY_ROLE[appRol] : "/admin/dashboard";
      navigate(target, { replace: true });
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0">
        <img
          src="/planeta.jpg"
          alt="Fondo"
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/55 via-purple-900/35 to-black/75" />
      </div>

      <div className="relative mt-14 flex w-full max-w-[360px] flex-col items-center sm:mt-24 sm:max-w-[400px]">
        <div className="mb-4 select-none text-center">
          <div
            className="text-2xl font-extrabold leading-none tracking-[0.22em] uppercase sm:text-4xl sm:tracking-[0.28em]"
            style={{ fontFamily: "Orbitron, ui-sans-serif, system-ui" }}
          >
            <span className="text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.22)]">
              NOVEDADES
            </span>
            <span className="ml-2 text-sky-300 drop-shadow-[0_0_18px_rgba(56,189,248,0.55)] sm:ml-3">
              ITZAE
            </span>
          </div>
        </div>

        <div
          className="relative w-full rounded-3xl border border-sky-300/35 bg-gradient-to-b from-blue-500/75 via-blue-700/55 to-black/85 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
          style={{
            boxShadow:
              "0 0 0 1px rgba(125,211,252,0.22), 0 0 34px rgba(56,189,248,0.28), 0 0 80px rgba(168,85,247,0.14)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(56,189,248,0.42), inset 0 0 26px rgba(56,189,248,0.18)",
            }}
          />

          <div className="text-center">
            <h1 className="text-xl font-bold text-white sm:text-2xl">Login</h1>

            <div className="mt-3 text-sm leading-6 font-semibold text-white/90 sm:text-base">
              <div>Bienvenido Inicia sesión para empezar</div>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-5 rounded-xl border border-red-200/30 bg-red-500/10 px-3 py-2 text-center text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-7 space-y-6">
            <div className="text-center">
              <label className="block text-sm font-semibold text-white/90 sm:text-base">
                Usuario
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-emerald-200/40 bg-emerald-200/22 px-3 py-3 text-center text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-sky-300/65 sm:text-base"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Yael"
                autoComplete="username"
                required
              />
            </div>

            <div className="text-center">
              <label className="block text-sm font-semibold text-white/90 sm:text-base">
                Contraseña
              </label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-emerald-200/40 bg-emerald-200/22 px-3 py-3 text-center text-sm text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-sky-300/65 sm:text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="text-sm text-white/80 hover:text-white hover:underline sm:text-base"
                onClick={() =>
                  setErrorMsg("Función pendiente: recuperación de contraseña.")
                }
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 py-3.5 text-sm font-semibold text-white shadow-lg hover:opacity-95 disabled:opacity-60 sm:text-base"
              type="submit"
            >
              {loading ? "Iniciando..." : "Iniciar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
