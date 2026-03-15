import { httpClient } from "../../../services/http/httpClient";

export interface InventarioExistenciasUbicacion {
  id_ubicacion: number;
  id_sucursal: number;
  tipo: string;
  nombre: string;
  codigo: string;
  vendible: boolean;
  activo: boolean;
  creado_en?: string;
  actualizado_en?: string;
}

export interface InventarioExistenciasUbicacionCreate {
  id_sucursal: number;
  tipo: string;
  nombre: string;
  codigo: string;
  vendible: boolean;
}

export interface InventarioExistenciasUbicacionUpdate {
  id_sucursal: number;
  tipo: string;
  nombre: string;
  codigo: string;
  vendible: boolean;
}

export interface InventarioExistenciasUbicacionStatusPayload {
  activo: boolean;
}

export interface InventarioExistenciasUbicacionesQuery {
  id_sucursal?: number;
  solo_activos?: boolean;
}

function buildListadoQuery(params?: InventarioExistenciasUbicacionesQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.id_sucursal != null) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.solo_activos != null) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const inventarioExistenciasUbicacionesService = {
  // GET /inventario/ubicaciones
  async listar(
    params?: InventarioExistenciasUbicacionesQuery,
  ): Promise<InventarioExistenciasUbicacion[]> {
    const qs = buildListadoQuery(params);
    const { data } = await httpClient.get<InventarioExistenciasUbicacion[]>(
      `/inventario/ubicaciones${qs}`,
    );
    return Array.isArray(data) ? data : [];
  },

  // GET /inventario/ubicaciones/{id_ubicacion}
  async obtener(id_ubicacion: number): Promise<InventarioExistenciasUbicacion> {
    const { data } = await httpClient.get<InventarioExistenciasUbicacion>(
      `/inventario/ubicaciones/${id_ubicacion}`,
    );
    return data;
  },

  // POST /inventario/ubicaciones
  async crear(
    payload: InventarioExistenciasUbicacionCreate,
  ): Promise<InventarioExistenciasUbicacion> {
    const { data } = await httpClient.post<InventarioExistenciasUbicacion>(
      `/inventario/ubicaciones`,
      payload,
    );
    return data;
  },

  // PUT /inventario/ubicaciones/{id_ubicacion}
  async actualizar(
    id_ubicacion: number,
    payload: InventarioExistenciasUbicacionUpdate,
  ): Promise<InventarioExistenciasUbicacion> {
    const { data } = await httpClient.put<InventarioExistenciasUbicacion>(
      `/inventario/ubicaciones/${id_ubicacion}`,
      payload,
    );
    return data;
  },

  // PATCH /inventario/ubicaciones/{id_ubicacion}/estatus
  async cambiarEstatus(
    id_ubicacion: number,
    payload: InventarioExistenciasUbicacionStatusPayload,
  ): Promise<InventarioExistenciasUbicacion> {
    const { data } = await httpClient.patch<InventarioExistenciasUbicacion>(
      `/inventario/ubicaciones/${id_ubicacion}/estatus`,
      payload,
    );
    return data;
  },
};