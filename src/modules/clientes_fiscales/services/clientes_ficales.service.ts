import { httpClient } from "../../../services/http/httpClient";
import type {
  ClienteFiscal,
  ClienteFiscalBuscarItem,
  ClienteFiscalCreate,
  ClienteFiscalUpdate,
  ClienteFiscalEstatusUpdate,
  ClientesFiscalesBuscarQuery,
} from "../types/clientes_fiscales.types";

// Convierte filtros a querystring (buscar)
function buildBuscarQuery(params: ClientesFiscalesBuscarQuery): string {
  const sp = new URLSearchParams();

  // q es requerido por API
  sp.set("q", params.q);

  if (params.solo_activos !== undefined) sp.set("solo_activos", String(params.solo_activos));
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const clientesFiscalesService = {
  // GET /clientes-fiscales/buscar
  async buscar(params: ClientesFiscalesBuscarQuery): Promise<ClienteFiscalBuscarItem[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<ClienteFiscalBuscarItem[]>(
      `/clientes-fiscales/buscar${qs}`
    );
    return data;
  },

  // GET /clientes-fiscales/{id_cliente_fiscal}
  async obtener(id_cliente_fiscal: number): Promise<ClienteFiscal> {
    const { data } = await httpClient.get<ClienteFiscal>(`/clientes-fiscales/${id_cliente_fiscal}`);
    return data;
  },

  // GET /clientes-fiscales/por-cliente/{id_cliente}
  async listarPorCliente(id_cliente: number): Promise<ClienteFiscalBuscarItem[]> {
    const { data } = await httpClient.get<ClienteFiscalBuscarItem[]>(
      `/clientes-fiscales/por-cliente/${id_cliente}`
    );
    return data;
  },

  // POST /clientes-fiscales
  async crear(payload: ClienteFiscalCreate): Promise<ClienteFiscal> {
    const { data } = await httpClient.post<ClienteFiscal>(`/clientes-fiscales`, payload);
    return data;
  },

  // PUT /clientes-fiscales/{id_cliente_fiscal}
  async actualizar(id_cliente_fiscal: number, payload: ClienteFiscalUpdate): Promise<ClienteFiscal> {
    const { data } = await httpClient.put<ClienteFiscal>(
      `/clientes-fiscales/${id_cliente_fiscal}`,
      payload
    );
    return data;
  },

  // PATCH /clientes-fiscales/{id_cliente_fiscal}/estatus
  async cambiarEstatus(
    id_cliente_fiscal: number,
    payload: ClienteFiscalEstatusUpdate
  ): Promise<ClienteFiscal> {
    const { data } = await httpClient.patch<ClienteFiscal>(
      `/clientes-fiscales/${id_cliente_fiscal}/estatus`,
      payload
    );
    return data;
  },
};