// src/modules/usuarios/types/usuarios.types.ts

export type UsuarioEstatus = "ACTIVO" | "INACTIVO";

export interface User {
  id_usuario: number;
  username: string;
  id_rol: number;
  estatus: UsuarioEstatus;
  nombre_en_ticket: string;

  id_empleado?: number | null;
  telefono_opcional?: string | null;
  fecha_alta?: string;
  creado_por?: number | null;
  ultimo_acceso?: string | null;
}

export interface UserCreate {
  id_empleado: number;
  id_rol: number;
  username: string;
  password: string;
  nombre_en_ticket: string;
  telefono_opcional?: string | null;
}

export interface UserUpdate {
  id_rol: number;
  username: string;
  nombre_en_ticket: string;
  telefono_opcional?: string | null;
}

export interface UserEstatusUpdate {
  estatus: UsuarioEstatus;
}

export interface UserPasswordUpdate {
  new_password: string;
}

export interface UsersQuery {
  q?: string;
  estatus?: UsuarioEstatus;
  id_rol?: number;
  limit?: number;
  offset?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}