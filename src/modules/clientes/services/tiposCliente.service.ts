// src/modules/clientes/services/tiposCliente.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type { TipoCliente } from "../types/clientes.types";

/*
  buildTiposClienteQuery arma el querystring para el catálogo de tipos de cliente.
  Por defecto conviene pedir solo activos para combos/selects.
*/
function buildTiposClienteQuery(solo_activos?: boolean): string {
  if (solo_activos === undefined) return "";
  const sp = new URLSearchParams();
  sp.set("solo_activos", String(solo_activos));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const tiposClienteService = {
  /*
    GET /catalogos/tipos-cliente
    Catálogo para alimentar el combo de id_tipo_cliente.
  */
  async listar(solo_activos: boolean = true): Promise<TipoCliente[]> {
    const qs = buildTiposClienteQuery(solo_activos);
    const { data } = await httpClient.get<TipoCliente[]>(`/catalogos/tipos-cliente${qs}`);
    return data;
  },
};