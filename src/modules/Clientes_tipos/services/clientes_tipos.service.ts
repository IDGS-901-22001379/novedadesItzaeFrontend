// src/modules/clientes_tipos/services/clientes_tipos.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  ClienteTipo,
  ClienteTipoCreate,
  ClienteTipoUpdate,
  ClientesTiposQuery,
} from "../types/clientes.types";

// Convierte filtros a querystring (listado)
function buildQuery(params?: ClientesTiposQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const clientesTiposService = {
  // GET /catalogos/tipos-cliente
  async listar(params?: ClientesTiposQuery): Promise<ClienteTipo[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<ClienteTipo[]>(`/catalogos/tipos-cliente${qs}`);
    return data;
  },

  // GET /catalogos/tipos-cliente/{id_tipo_cliente}
  async obtener(id_tipo_cliente: number): Promise<ClienteTipo> {
    const { data } = await httpClient.get<ClienteTipo>(
      `/catalogos/tipos-cliente/${id_tipo_cliente}`
    );
    return data;
  },

  // POST /catalogos/tipos-cliente
  async crear(payload: ClienteTipoCreate): Promise<ClienteTipo> {
    const { data } = await httpClient.post<ClienteTipo>(
      `/catalogos/tipos-cliente`,
      payload
    );
    return data;
  },

  // PUT /catalogos/tipos-cliente/{id_tipo_cliente}
  async actualizar(
    id_tipo_cliente: number,
    payload: ClienteTipoUpdate
  ): Promise<ClienteTipo> {
    const { data } = await httpClient.put<ClienteTipo>(
      `/catalogos/tipos-cliente/${id_tipo_cliente}`,
      payload
    );
    return data;
  },

  // PATCH /catalogos/tipos-cliente/{id_tipo_cliente}/desactivar
  async desactivar(id_tipo_cliente: number): Promise<ClienteTipo> {
    const { data } = await httpClient.patch<ClienteTipo>(
      `/catalogos/tipos-cliente/${id_tipo_cliente}/desactivar`
    );
    return data;
  },
};