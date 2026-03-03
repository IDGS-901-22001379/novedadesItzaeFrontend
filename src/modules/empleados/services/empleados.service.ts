// src/modules/empleados/services/empleados.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  Empleado,
  EmpleadoCreate,
  EmpleadoUpdate,
  EmpleadoEstatusUpdate,
  EmpleadosQuery,
} from "../types/empleados.types";

// Convierte filtros a querystring (listado paginado)
function buildQuery(params?: EmpleadosQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (params.puesto) sp.set("puesto", params.puesto);
  if (params.estatus) sp.set("estatus", params.estatus);

  if (params.page !== undefined) sp.set("page", String(params.page));
  if (params.page_size !== undefined) sp.set("page_size", String(params.page_size));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Type-guards (sin any) para respuestas variables
function hasMessage(x: unknown): x is { message: unknown } {
  return typeof x === "object" && x !== null && "message" in x;
}

export const empleadosService = {
  // GET /empleados
  async listar(params?: EmpleadosQuery): Promise<{
    items: Empleado[];
    total: number;
    page: number;
    page_size: number;
  }> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<{
      items: Empleado[];
      total: number;
      page: number;
      page_size: number;
    }>(`/empleados${qs}`);
    return data;
  },

  // GET /empleados/{id_empleado}
  async obtener(id_empleado: number): Promise<Empleado> {
    const { data } = await httpClient.get<Empleado>(`/empleados/${id_empleado}`);
    return data;
  },

  // POST /empleados
  async crear(payload: EmpleadoCreate): Promise<Empleado> {
    const { data } = await httpClient.post<Empleado>(`/empleados`, payload);
    return data;
  },

  // PUT /empleados/{id_empleado}
  async actualizar(id_empleado: number, payload: EmpleadoUpdate): Promise<Empleado> {
    const { data } = await httpClient.put<Empleado>(`/empleados/${id_empleado}`, payload);
    return data;
  },

  // PATCH /empleados/{id_empleado}/estatus
  async cambiarEstatus(id_empleado: number, payload: EmpleadoEstatusUpdate): Promise<Empleado> {
    const { data } = await httpClient.patch<Empleado>(`/empleados/${id_empleado}/estatus`, payload);
    return data;
  },

  // PATCH /empleados/{id_empleado}/quitar-acceso
  // Nota: este endpoint puede regresar string, { message }, { ok, message } o {}.
  async quitarAcceso(id_empleado: number): Promise<string> {
    const res = await httpClient.patch<unknown>(`/empleados/${id_empleado}/quitar-acceso`);
    const data = res.data;

    // Puede venir string
    if (typeof data === "string") return data;

    // Puede venir { message: ... }
    if (hasMessage(data)) return String(data.message);

    // Si viene {}, o algo distinto
    return "Acceso quitado correctamente.";
  },
};