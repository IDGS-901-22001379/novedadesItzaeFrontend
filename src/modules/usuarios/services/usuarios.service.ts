// src/modules/usuarios/services/usuarios.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  User,
  UserCreate,
  UserUpdate,
  UserEstatusUpdate,
  UserPasswordUpdate,
  UsersQuery,
} from "../types/usuarios.types";

// Convierte filtros a querystring (listado)
function buildQuery(params?: UsersQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (params.estatus) sp.set("estatus", params.estatus);
  if (params.id_rol !== undefined) sp.set("id_rol", String(params.id_rol));
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const usuariosService = {
  // GET /usuarios
  async listar(params?: UsersQuery): Promise<User[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<User[]>(`/usuarios${qs}`);
    return data;
  },

  // GET /usuarios/{id_usuario}
  async obtener(id_usuario: number): Promise<User> {
    const { data } = await httpClient.get<User>(`/usuarios/${id_usuario}`);
    return data;
  },

  // POST /usuarios
  async crear(payload: UserCreate): Promise<User> {
    const { data } = await httpClient.post<User>(`/usuarios`, payload);
    return data;
  },

  // PUT /usuarios/{id_usuario}
  async actualizar(id_usuario: number, payload: UserUpdate): Promise<User> {
    const { data } = await httpClient.put<User>(`/usuarios/${id_usuario}`, payload);
    return data;
  },

  // PATCH /usuarios/{id_usuario}/estatus
  async cambiarEstatus(id_usuario: number, payload: UserEstatusUpdate): Promise<User> {
    const { data } = await httpClient.patch<User>(`/usuarios/${id_usuario}/estatus`, payload);
    return data;
  },

  // PATCH /usuarios/{id_usuario}/password
    // PATCH /usuarios/{id_usuario}/password
  async cambiarPassword(id_usuario: number, payload: UserPasswordUpdate): Promise<string> {
    const { data } = await httpClient.patch(`/usuarios/${id_usuario}/password`, payload);

    // Puede venir string o { ok, message }
    if (typeof data === "string") return data;

    if (data && typeof data === "object" && "message" in (data )) {
      return String((data ).message);
    }

    return "Contraseña actualizada.";
  },
};