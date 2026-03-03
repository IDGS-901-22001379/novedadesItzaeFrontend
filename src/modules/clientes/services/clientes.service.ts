// src/modules/clientes/services/clientes.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  ClienteListItem,
  Cliente,
  ClienteCreate,
  ClienteUpdate,
  ClienteEstatusUpdate,
  ClientesBuscarQuery,
} from "../types/clientes.types";

/*
  Convierte filtros del endpoint /clientes/buscar a querystring.
  Este endpoint se usa para POS/ventas (búsqueda por texto).
*/
function buildBuscarQuery(params?: ClientesBuscarQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (params.solo_activos !== undefined) sp.set("solo_activos", String(params.solo_activos));
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const clientesService = {
  /*
    GET /clientes
    Listado administrativo. Normalmente solo admin.
  */
  async listar(): Promise<ClienteListItem[]> {
    const { data } = await httpClient.get<ClienteListItem[]>(`/clientes`);
    return data;
  },

  /*
    GET /clientes/{id_cliente}
    Detalle para pantalla administrativa.
  */
  async obtener(id_cliente: number): Promise<Cliente> {
    const { data } = await httpClient.get<Cliente>(`/clientes/${id_cliente}`);
    return data;
  },

  /*
    POST /clientes
    Alta de cliente comercial.
    numero_cliente puede omitirse o mandarse vacío ("") si el backend lo autogenera.
  */
  async crear(payload: ClienteCreate): Promise<Cliente> {
    const { data } = await httpClient.post<Cliente>(`/clientes`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  /*
    PUT /clientes/{id_cliente}
    Edición de cliente comercial.
  */
  async actualizar(id_cliente: number, payload: ClienteUpdate): Promise<Cliente> {
    const { data } = await httpClient.put<Cliente>(`/clientes/${id_cliente}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  /*
    PATCH /clientes/{id_cliente}/estatus
    Activar/Inactivar cliente.
  */
  async cambiarEstatus(id_cliente: number, payload: ClienteEstatusUpdate): Promise<Cliente> {
    const { data } = await httpClient.patch<Cliente>(`/clientes/${id_cliente}/estatus`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  /*
    GET /clientes/buscar
    Búsqueda para POS/ventas por texto (nombre, apellidos, correo, teléfono, número_cliente).
  */
  async buscar(params: ClientesBuscarQuery): Promise<ClienteListItem[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<ClienteListItem[]>(`/clientes/buscar${qs}`);
    return data;
  },
};