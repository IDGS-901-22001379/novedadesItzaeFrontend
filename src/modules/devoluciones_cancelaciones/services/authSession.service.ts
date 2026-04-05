// src/modules/devoluciones_cancelaciones/services/authSession.service.ts
// Service auxiliar de sesión para el módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Obtener el usuario actualmente logeado desde storage.
// - Exponer helpers simples para usar id_usuario en devoluciones.

import { getUser, getToken } from "../../../services/auth/tokenStorage";

export type AuthSessionUser = {
  id_usuario: number;
  username: string;
  rol: string;
  estatus: string;
  nombre_en_ticket: string;
};

export function getCurrentSessionUser(): AuthSessionUser | null {
  const user = getUser();

  if (!user) return null;

  return {
    id_usuario: Number(user.id_usuario),
    username: String(user.username ?? ""),
    rol: String(user.rol ?? ""),
    estatus: String(user.estatus ?? ""),
    nombre_en_ticket: String(user.nombre_en_ticket ?? ""),
  };
}

export function getCurrentUserId(): number | null {
  const user = getCurrentSessionUser();
  if (!user || !user.id_usuario) return null;
  return user.id_usuario;
}

export function isUserLoggedIn(): boolean {
  return Boolean(getToken() && getUser());
}