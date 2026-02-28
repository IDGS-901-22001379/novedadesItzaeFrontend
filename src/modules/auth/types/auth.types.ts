// src/modules/auth/types/auth.types.ts

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: "bearer" | string;
  id_usuario: number;
  username: string;
  rol: string; // Ej: "Administrador"
  estatus: "ACTIVO" | "INACTIVO" | string;
  nombre_en_ticket?: string;
};