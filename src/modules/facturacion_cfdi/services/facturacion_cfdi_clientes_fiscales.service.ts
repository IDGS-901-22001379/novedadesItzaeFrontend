// src/modules/facturacion_cfdi/services/facturacion_cfdi_clientes_fiscales.service.ts
// Service de clientes fiscales para el módulo de facturación CFDI.
// Responsabilidades:
// - buscar clientes fiscales
// - obtener cliente fiscal por id
// - preparar opciones para emisión de factura

import { httpClient } from "../../../services/http/httpClient";
import type {
  ClienteFiscal,
  ClienteFiscalBuscarItem,
  ClientesFiscalesQuery,
} from "../types/facturacion_cfdi.types";

// Convierte filtros de clientes fiscales a querystring
function buildClientesFiscalesQuery(params: ClientesFiscalesQuery): string {
  const sp = new URLSearchParams();

  // q es requerido por API
  sp.set("q", params.q);

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  if (params.limit !== undefined) {
    sp.set("limit", String(params.limit));
  }

  if (params.offset !== undefined) {
    sp.set("offset", String(params.offset));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const facturacionCfdiClientesFiscalesService = {
  // GET /clientes-fiscales/buscar
  async buscar(
    params: ClientesFiscalesQuery
  ): Promise<ClienteFiscalBuscarItem[]> {
    const qs = buildClientesFiscalesQuery(params);
    const { data } = await httpClient.get<ClienteFiscalBuscarItem[]>(
      `/clientes-fiscales/buscar${qs}`
    );
    return data;
  },

  // GET /clientes-fiscales/{id_cliente_fiscal}
  async obtener(id_cliente_fiscal: number): Promise<ClienteFiscal> {
    const { data } = await httpClient.get<ClienteFiscal>(
      `/clientes-fiscales/${id_cliente_fiscal}`
    );
    return data;
  },
};