// src/modules/usuarios/services/empleados.service.ts
// Service de empleados para selector por nombre.
// Responsabilidades: buscar empleados (paginado) para autocompletado.

import { httpClient } from "../../../services/http/httpClient";

export type EmpleadoApiItem = {
  id_empleado: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  puesto: string;
  estatus: "ACTIVO" | "INACTIVO";
  tiene_usuario: boolean;
  id_usuario?: number | null;
  username?: string | null;
  estatus_usuario?: string | null;
};

type EmpleadosPagedResponse = {
  items: EmpleadoApiItem[];
  total: number;
  page: number;
  page_size: number;
};

export type EmpleadoOption = {
  id_empleado: number;
  label: string; // Nombre completo
  puesto?: string;
  estatus?: string;
};

function toOption(e: EmpleadoApiItem): EmpleadoOption {
  const fullName = `${e.nombre} ${e.apellido_paterno} ${e.apellido_materno}`.replace(/\s+/g, " ").trim();
  return {
    id_empleado: e.id_empleado,
    label: fullName,
    puesto: e.puesto,
    estatus: e.estatus,
  };
}

export const empleadosService = {
  // GET /empleados?q=ana&page=1&page_size=50
  async buscar(q: string): Promise<EmpleadoOption[]> {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    sp.set("page", "1");
    sp.set("page_size", "50");

    const { data } = await httpClient.get<EmpleadosPagedResponse>(`/empleados?${sp.toString()}`);

    const arr = Array.isArray(data?.items) ? data.items : [];
    return arr.map(toOption);
  },
  // Listar empleados (paginado) para resolver por id cuando no viene nombre
async listar(page = 1, page_size = 200): Promise<EmpleadoOption[]> {
  const sp = new URLSearchParams();
  sp.set("page", String(page));
  sp.set("page_size", String(page_size));

  const { data } = await httpClient.get<EmpleadosPagedResponse>(`/empleados?${sp.toString()}`);
  const arr = Array.isArray(data?.items) ? data.items : [];
  return arr.map(toOption);
},
};

