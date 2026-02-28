// src/modules/auth/services/auth.service.ts

import { httpClient } from "../../../services/http/httpClient";
import { saveSession, clearSession } from "../../../services/auth/tokenStorage";
import type { LoginRequest, LoginResponse } from "../types/auth.types";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await httpClient.post<LoginResponse>("/auth/login", data);

  // Guardar token + datos del usuario (frontend no “crea” el usuario, solo guarda sesión)
  saveSession(res.data.access_token, {
    id_usuario: res.data.id_usuario,
    username: res.data.username,
    rol: res.data.rol,
    estatus: res.data.estatus,
    nombre_en_ticket: res.data.nombre_en_ticket,
  });

  return res.data;
}

export async function logout(): Promise<{ ok: boolean; message: string }> {
  const res = await httpClient.post<{ ok: boolean; message: string }>("/auth/logout");

  // Limpia sesión aunque el backend responda ok
  clearSession();

  return res.data;
}