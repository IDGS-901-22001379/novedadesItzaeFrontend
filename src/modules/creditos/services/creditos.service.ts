// src/modules/creditos_cobranza/services/creditos.service.ts
// Service del módulo Créditos y Cobranza - Créditos.
// Responsabilidades:
// - consumir endpoints de créditos
// - listar últimos créditos
// - buscar con filtros
// - obtener detalle
// - crear y actualizar créditos
// - consultar créditos por cliente o venta
// - generar crédito desde venta
// - actualizar saldo después de abonos

import { httpClient } from "../../../services/http/httpClient";
import type {
  Credito,
  CreditoListItem,
  CreditoCreate,
  CreditoUpdate,
  CreditoSaldoUpdate,
  CreditosQuery,
  CreditoClienteResumen,
} from "../types/creditos.types";

// Convierte filtros de búsqueda a querystring
function buildQuery(params?: CreditosQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (params.id_cliente !== undefined) sp.set("id_cliente", String(params.id_cliente));
  if (params.id_venta !== undefined) sp.set("id_venta", String(params.id_venta));
  if (params.estado) sp.set("estado", params.estado);
  if (params.vencidos_solo !== undefined) sp.set("vencidos_solo", String(params.vencidos_solo));
  if (params.fecha_vencimiento_desde) {
    sp.set("fecha_vencimiento_desde", params.fecha_vencimiento_desde);
  }
  if (params.fecha_vencimiento_hasta) {
    sp.set("fecha_vencimiento_hasta", params.fecha_vencimiento_hasta);
  }
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const creditosService = {
  // GET /creditos
  async listarUltimos(params?: Pick<CreditosQuery, "limit" | "offset">): Promise<CreditoListItem[]> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<CreditoListItem[]>(`/creditos${qs}`);
    return data;
  },

  // GET /creditos/buscar
  async buscar(params?: CreditosQuery): Promise<CreditoListItem[] | string> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<CreditoListItem[] | string>(`/creditos/buscar${qs}`);
    return data;
  },

  // GET /creditos/{id_venta_credito}
  async obtener(id_venta_credito: number): Promise<Credito> {
    const { data } = await httpClient.get<Credito>(`/creditos/${id_venta_credito}`);
    return data;
  },

  // POST /creditos
  async crear(payload: CreditoCreate): Promise<Credito> {
    const { data } = await httpClient.post<Credito>(`/creditos`, payload);
    return data;
  },

  // PUT /creditos/{id_venta_credito}
  async actualizar(id_venta_credito: number, payload: CreditoUpdate): Promise<Credito> {
    const { data } = await httpClient.put<Credito>(`/creditos/${id_venta_credito}`, payload);
    return data;
  },

  // GET /creditos/cliente/{id_cliente}
  async listarPorCliente(
    id_cliente: number,
    params?: Pick<CreditosQuery, "limit" | "offset">
  ): Promise<CreditoListItem[] | string> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<CreditoListItem[] | string>(
      `/creditos/cliente/${id_cliente}${qs}`
    );
    return data;
  },

  // GET /creditos/cliente/{id_cliente}/resumen
  async obtenerResumenCliente(id_cliente: number): Promise<CreditoClienteResumen | string> {
    const { data } = await httpClient.get<CreditoClienteResumen | string>(
      `/creditos/cliente/${id_cliente}/resumen`
    );
    return data;
  },

  // GET /creditos/cliente/{id_cliente}/abiertas
  async listarAbiertasPorCliente(id_cliente: number): Promise<CreditoListItem[]> {
    const { data } = await httpClient.get<CreditoListItem[]>(
      `/creditos/cliente/${id_cliente}/abiertas`
    );
    return data;
  },

  // GET /creditos/venta/{id_venta}
  async obtenerPorVenta(id_venta: number): Promise<Credito> {
    const { data } = await httpClient.get<Credito>(`/creditos/venta/${id_venta}`);
    return data;
  },

  // POST /creditos/generar-por-venta/{id_venta}
  async generarPorVenta(id_venta: number, notas?: string): Promise<Credito> {
    const qs = notas ? `?notas=${encodeURIComponent(notas)}` : "";
    const { data } = await httpClient.post<Credito>(
      `/creditos/generar-por-venta/${id_venta}${qs}`
    );
    return data;
  },

  // PATCH /creditos/{id_venta_credito}/saldo
  async actualizarSaldo(id_venta_credito: number, payload: CreditoSaldoUpdate): Promise<Credito> {
    const sp = new URLSearchParams();
    sp.set("nuevo_total_abonado", String(payload.nuevo_total_abonado));
    sp.set("nuevo_saldo_pendiente", String(payload.nuevo_saldo_pendiente));

    const { data } = await httpClient.patch<Credito>(
      `/creditos/${id_venta_credito}/saldo?${sp.toString()}`
    );
    return data;
  },
};