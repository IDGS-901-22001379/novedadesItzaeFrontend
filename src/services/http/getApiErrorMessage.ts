import axios from "axios";

function traducirMensaje(message: string): string {
  const msg = message.toLowerCase().trim();

  if (msg.includes("conflict")) return "Ya existe un registro con esos datos.";
  if (msg.includes("not found")) return "No se encontró el registro solicitado.";
  if (msg.includes("unprocessable entity")) return "Los datos enviados no son válidos.";
  if (msg.includes("internal server error")) return "Ocurrió un error interno en el servidor.";
  if (msg.includes("unauthorized")) return "Tu sesión no es válida. Inicia sesión nuevamente.";
  if (msg.includes("forbidden")) return "No tienes permisos para realizar esta acción.";
  if (msg.includes("bad request")) return "La solicitud contiene datos incorrectos.";

  return message;
}

export function getApiErrorMessage(error: unknown, fallback = "Ocurrió un error."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // Caso 1: backend manda { detail: "mensaje" }
    if (typeof data?.detail === "string" && data.detail.trim()) {
      return traducirMensaje(data.detail);
    }

    // Caso 2: FastAPI manda detail como arreglo de validaciones
    if (Array.isArray(data?.detail) && data.detail.length > 0) {
      const first = data.detail[0];

      if (typeof first?.msg === "string" && first.msg.trim()) {
        return traducirMensaje(first.msg);
      }
    }

    // Caso 3: backend manda { message: "mensaje" }
    if (typeof data?.message === "string" && data.message.trim()) {
      return traducirMensaje(data.message);
    }

    // Caso 4: status sin mensaje claro
    if (error.response?.status === 409) {
      return "Ya existe un registro con esos datos.";
    }
    if (error.response?.status === 404) {
      return "No se encontró el registro solicitado.";
    }
    if (error.response?.status === 422) {
      return "Hay campos inválidos o incompletos.";
    }
    if (error.response?.status === 401) {
      return "Tu sesión expiró. Inicia sesión nuevamente.";
    }
    if (error.response?.status === 403) {
      return "No tienes permisos para realizar esta acción.";
    }
    if (error.response?.status === 500) {
      return "Ocurrió un error interno en el servidor.";
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return traducirMensaje(error.message);
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return traducirMensaje(error.message);
  }

  return fallback;
}