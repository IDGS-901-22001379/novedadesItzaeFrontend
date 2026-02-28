// src/config/roles.ts

// Roles tal cual vienen del backend (tabla roles)
export type BackendRol =
  | "Administrador"
  | "Vendedor"
  | "Almacenista"
  | "Cajero"
  | "Supervisor"
  | "Gerente"
  | "Facturacion"
  | "Compras"
  | "Auditoria"
  | "Soporte";

// Roles internos del frontend (3 sidebars principales)
export type AppRol = "ADMIN" | "VENTAS" | "ALMACEN";

// Mapeo backend -> frontend (para guards y navegación)
export const BACKEND_ROL_TO_APP_ROL: Record<BackendRol, AppRol> = {
  Administrador: "ADMIN",
  Gerente: "ADMIN",
  Soporte: "ADMIN",
  Auditoria: "ADMIN",
  Facturacion: "ADMIN",
  Compras: "ADMIN",

  Vendedor: "VENTAS",
  Cajero: "VENTAS",

  Almacenista: "ALMACEN",
  Supervisor: "ALMACEN",
};

// Helper: si llega un rol desconocido, por seguridad regresamos null
export function toAppRol(backendRol: string): AppRol | null {
  return (BACKEND_ROL_TO_APP_ROL as Record<string, AppRol>)[backendRol] ?? null;
}