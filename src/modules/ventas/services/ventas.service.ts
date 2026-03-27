// src/modules/ventas/services/ventas.service.ts
// Service principal del módulo Ventas.
// Responsabilidades:
// - Listar ventas con filtros.
// - Obtener una venta por id.
// - Crear una venta.
// - Normalizar la respuesta real del backend en el listado.

import { httpClient } from "../../../services/http/httpClient";
import type {
  VentaCreate,
  VentaCreateResponse,
  VentaListItem,
  VentaObtenerResponse,
  VentasListResponse,
  VentasQuery,
} from "../types";

function buildVentasQuery(params?: VentasQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.desde) sp.set("desde", params.desde);
  if (params.hasta) sp.set("hasta", params.hasta);
  if (params.q) sp.set("q", params.q);

  if (params.id_cliente !== undefined) {
    sp.set("id_cliente", String(params.id_cliente));
  }

  if (params.estatus) {
    sp.set("estatus", params.estatus);
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

export const ventasService = {
  // Lista ventas y adapta la respuesta del backend:
  // [
  //   [ ...ventas ],
  //   total
  // ]
  async listar(params?: VentasQuery): Promise<{
    items: VentaListItem[];
    total: number;
  }> {
    const qs = buildVentasQuery(params);

    const { data } = await httpClient.get<VentasListResponse>(`/ventas${qs}`);

    const items = Array.isArray(data?.[0]) ? data[0] : [];
    const total = typeof data?.[1] === "number" ? data[1] : items.length;

    return { items, total };
  },

  async obtener(id_venta: number): Promise<VentaObtenerResponse> {
    const { data } = await httpClient.get<VentaObtenerResponse>(
      `/ventas/${id_venta}`,
    );
    return data;
  },

  async crear(payload: VentaCreate): Promise<VentaCreateResponse> {
    const { data } = await httpClient.post<VentaCreateResponse>(
      `/ventas`,
      payload,
    );
    return data;
  },
};