// src/modules/empleados/types/empleados.types.ts

export type EmpleadoEstatus = "ACTIVO" | "INACTIVO";
export type UsuarioEstatus = "ACTIVO" | "INACTIVO";

export interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;

  telefono?: string | null;
  direccion?: string | null;

  puesto: string;
  estatus: EmpleadoEstatus;

  // Relación opcional con usuario (si tiene acceso al sistema)
  tiene_usuario: boolean;
  id_usuario?: number | null;
  username?: string | null;
  estatus_usuario?: UsuarioEstatus | null;
}

export interface EmpleadoCreate {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono?: string | null;
  direccion?: string | null;
  puesto: string;
  estatus?: EmpleadoEstatus; // en API viene default ACTIVO normalmente
}

export interface EmpleadoUpdate {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono?: string | null;
  direccion?: string | null;
  puesto: string;
  estatus: EmpleadoEstatus;
}

export interface EmpleadoEstatusUpdate {
  estatus: EmpleadoEstatus;
}

export interface EmpleadosQuery {
  q?: string;
  puesto?: string;
  estatus?: EmpleadoEstatus;
  page?: number; // default 1
  page_size?: number; // default 50 (max 200)
}

export interface PagedEmpleados {
  items: Empleado[];
  total: number;
  page: number;
  page_size: number;
}