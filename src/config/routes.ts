// src/config/routes.ts
import type { AppRol } from "./roles";

export const HOME_BY_ROLE: Record<AppRol, string> = {
  ADMIN: "/admin/dashboard",
  VENTAS: "/ventas",
  ALMACEN: "/almacen",
};