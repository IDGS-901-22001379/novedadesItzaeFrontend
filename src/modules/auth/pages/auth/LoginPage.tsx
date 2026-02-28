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
    (err as { response?: { data?: { detail?: unknown } } }).response?.data?.detail;

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
    <div className="min-h-screen py-6 px-3 flex flex-col justify-center sm:py-12 bg-gradient-to-br from-purple-950 via-purple-800 to-fuchsia-700">
      <div className="relative py-3 w-full max-w-xl mx-auto">
        {/* Fondo “skew” morado */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-800 shadow-2xl transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl" />

        {/* Card */}
        <div className="relative px-4 py-10 bg-white shadow-2xl sm:rounded-3xl sm:p-16">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
              <p className="text-slate-500 pt-2 text-sm">Ingresa a tu cuenta.</p>
            </div>

            {errorMsg && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="divide-y divide-gray-200">
              <form
                onSubmit={onSubmit}
                className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
              >
                {/* Usuario */}
                <div className="relative">
                  <input
                    autoComplete="username"
                    id="username"
                    name="username"
                    type="text"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-fuchsia-600"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm
                               peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                               transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Usuario
                  </label>
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    autoComplete="current-password"
                    id="password"
                    name="password"
                    type="password"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-fuchsia-600"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm
                               peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2
                               transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Contraseña
                  </label>
                </div>

                {/* Botón */}
                <div className="relative pt-2">
                  <button
                    disabled={loading}
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-md px-4 py-2 text-sm font-semibold shadow-md disabled:opacity-60"
                    type="submit"
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </button>
                </div>
              </form>
            </div>

            {/* Google (solo UI placeholder) */}
            <div className="w-full flex justify-center">
              <button
                type="button"
                className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                onClick={() => setErrorMsg("Login con Google (pendiente).")}
              >
                <svg
                  className="h-6 w-6 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-0.5 0 48 48"
                >
                  <title>Google-color</title>
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-401.000000, -860.000000)">
                      <g transform="translate(401.000000, 860.000000)">
                        <path
                          d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                          fill="#FBBC05"
                        />
                        <path
                          d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                          fill="#EB4335"
                        />
                        <path
                          d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                          fill="#34A853"
                        />
                        <path
                          d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                          fill="#4285F4"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}