// src/services/auth/tokenStorage.ts

export type SessionUser = {
  id_usuario: number;
  username: string;
  rol: string; // viene del backend (Ej: "Administrador")
  estatus: "ACTIVO" | "INACTIVO" | string;
  nombre_en_ticket?: string;
};

const KEY_TOKEN = "access_token";
const KEY_USER = "session_user";

export function saveSession(token: string, user: SessionUser) {
  localStorage.setItem(KEY_TOKEN, token);
  localStorage.setItem(KEY_USER, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_USER);
}

export function getToken(): string | null {
  return localStorage.getItem(KEY_TOKEN);
}

export function getUser(): SessionUser | null {
  const raw = localStorage.getItem(KEY_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}