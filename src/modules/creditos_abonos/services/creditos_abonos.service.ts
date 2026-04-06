// src/modules/creditos_abonos/services/creditos_abonos.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  AbonoMovimientoCajaPayload,
  AbonoTicketPayload,
  CreditoAbono,
  CreditoAbonoCancel,
  CreditoAbonoCreate,
  CreditoAbonoResumen,
  CreditoAbonoUpdate,
  CreditosAbonosClienteQuery,
  CreditosAbonosQuery,
  ListParams,
} from "../types/creditos_abonos.types";

// Convierte filtros simples a querystring (listados)
function buildListQuery(params?: ListParams): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros de búsqueda a querystring
function buildBuscarQuery(params?: CreditosAbonosQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (params.id_cliente !== undefined) sp.set("id_cliente", String(params.id_cliente));
  if (params.id_usuario_cobra !== undefined) {
    sp.set("id_usuario_cobra", String(params.id_usuario_cobra));
  }
  if (params.id_apertura !== undefined) sp.set("id_apertura", String(params.id_apertura));
  if (params.id_forma_pago !== undefined) {
    sp.set("id_forma_pago", String(params.id_forma_pago));
  }
  if (params.estatus) sp.set("estatus", params.estatus);
  if (params.fecha_desde) sp.set("fecha_desde", params.fecha_desde);
  if (params.fecha_hasta) sp.set("fecha_hasta", params.fecha_hasta);
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros de historial por cliente a querystring
function buildClienteQuery(params?: CreditosAbonosClienteQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const creditosAbonosService = {
  // GET /abonos-credito
  async listarUltimos(params?: ListParams): Promise<CreditoAbonoResumen[]> {
    const qs = buildListQuery(params);
    const { data } = await httpClient.get<CreditoAbonoResumen[]>(`/abonos-credito${qs}`);
    return data;
  },

  // POST /abonos-credito
  async crear(payload: CreditoAbonoCreate): Promise<CreditoAbono> {
    const { data } = await httpClient.post<CreditoAbono>(`/abonos-credito`, payload);
    return data;
  },

  // GET /abonos-credito/buscar
  async buscar(params?: CreditosAbonosQuery): Promise<CreditoAbonoResumen[] | string> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<CreditoAbonoResumen[] | string>(
      `/abonos-credito/buscar${qs}`
    );
    return data;
  },

  // GET /abonos-credito/cliente/{id_cliente}
  async listarPorCliente(
    id_cliente: number,
    params?: CreditosAbonosClienteQuery
  ): Promise<CreditoAbonoResumen[] | string> {
    const qs = buildClienteQuery(params);
    const { data } = await httpClient.get<CreditoAbonoResumen[] | string>(
      `/abonos-credito/cliente/${id_cliente}${qs}`
    );
    return data;
  },

  // GET /abonos-credito/cliente/{id_cliente}/ultimo
  async obtenerUltimoPorCliente(id_cliente: number): Promise<CreditoAbono> {
    const { data } = await httpClient.get<CreditoAbono>(
      `/abonos-credito/cliente/${id_cliente}/ultimo`
    );
    return data;
  },

  // GET /abonos-credito/folio/{folio}
  async obtenerPorFolio(folio: string): Promise<CreditoAbono> {
    const { data } = await httpClient.get<CreditoAbono>(
      `/abonos-credito/folio/${encodeURIComponent(folio)}`
    );
    return data;
  },

  // GET /abonos-credito/{id_abono}
  async obtener(id_abono: number): Promise<CreditoAbono> {
    const { data } = await httpClient.get<CreditoAbono>(`/abonos-credito/${id_abono}`);
    return data;
  },

  // PUT /abonos-credito/{id_abono}
  async actualizar(id_abono: number, payload: CreditoAbonoUpdate): Promise<CreditoAbono> {
    const { data } = await httpClient.put<CreditoAbono>(
      `/abonos-credito/${id_abono}`,
      payload
    );
    return data;
  },

  // PATCH /abonos-credito/{id_abono}/cancelar
  async cancelar(id_abono: number, payload: CreditoAbonoCancel): Promise<CreditoAbono> {
    const { data } = await httpClient.patch<CreditoAbono>(
      `/abonos-credito/${id_abono}/cancelar`,
      payload
    );
    return data;
  },

  // GET /abonos-credito/{id_abono}/ticket
  async construirTicket(id_abono: number): Promise<AbonoTicketPayload | string> {
    const { data } = await httpClient.get<AbonoTicketPayload | string>(
      `/abonos-credito/${id_abono}/ticket`
    );
    return data;
  },

  // GET /abonos-credito/{id_abono}/movimiento-caja
  async construirMovimientoCaja(
    id_abono: number
  ): Promise<AbonoMovimientoCajaPayload | string> {
    const { data } = await httpClient.get<AbonoMovimientoCajaPayload | string>(
      `/abonos-credito/${id_abono}/movimiento-caja`
    );
    return data;
  },
};