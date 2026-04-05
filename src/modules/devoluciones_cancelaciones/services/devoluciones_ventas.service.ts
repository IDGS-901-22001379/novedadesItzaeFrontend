// src/modules/devoluciones_cancelaciones/services/devoluciones_ventas.service.ts
// Service auxiliar de ventas para el módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Buscar ventas para devoluciones.
// - Exponer opciones amigables para UI usando folio en lugar de id.
// - Adaptar la respuesta real del backend al formato que necesita devoluciones.
// - Resolver el folio real de venta aun si el backend cambia el nombre del campo.

import { httpClient } from "../../../services/http/httpClient";
import type {
  DevolucionVentaOption,
  DevolucionesVentasQuery,
} from "../types/devoluciones_ventas.types";

type VentaListItem = {
  id_venta?: number | null;
  folio?: string | null;
  folio_venta?: string | null;
  venta_folio?: string | null;
  numero_venta?: string | null;
  codigo?: string | null;
};

type VentaDetailResponse = Record<string, unknown>;

type VentasListResponse = [VentaListItem[], number] | VentaListItem[];

function buildVentasQuery(params?: DevolucionesVentasQuery): string {
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

function normalizeVentasResponse(data: VentasListResponse): {
  items: VentaListItem[];
  total: number;
} {
  if (
    Array.isArray(data) &&
    data.length === 2 &&
    Array.isArray(data[0]) &&
    typeof data[1] === "number"
  ) {
    return {
      items: data[0],
      total: data[1],
    };
  }

  if (Array.isArray(data)) {
    return {
      items: data as VentaListItem[],
      total: data.length,
    };
  }

  return {
    items: [],
    total: 0,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function getVentaIdFromUnknown(raw: unknown, fallbackId?: number): number {
  const root = asRecord(raw);

  const candidatos: unknown[] = [
    root.id_venta,
    root.id,
  ];

  const data = asRecord(root.data);
  candidatos.push(data.id_venta, data.id);

  const venta = asRecord(root.venta);
  candidatos.push(venta.id_venta, venta.id);

  const header = asRecord(root.header);
  candidatos.push(header.id_venta, header.id);

  for (const candidato of candidatos) {
    const value = asNumber(candidato);
    if (value && value > 0) return value;
  }

  return fallbackId ?? 0;
}

function getVentaFolioFromUnknown(raw: unknown, fallbackId?: number): string {
  const root = asRecord(raw);

  const candidatos: unknown[] = [
    root.folio,
    root.venta_folio,
    root.numero_venta,
    root.folio_venta,
    root.codigo,
  ];

  const data = asRecord(root.data);
  candidatos.push(
    data.folio,
    data.venta_folio,
    data.numero_venta,
    data.folio_venta,
    data.codigo,
  );

  const venta = asRecord(root.venta);
  candidatos.push(
    venta.folio,
    venta.venta_folio,
    venta.numero_venta,
    venta.folio_venta,
    venta.codigo,
  );

  const header = asRecord(root.header);
  candidatos.push(
    header.folio,
    header.venta_folio,
    header.numero_venta,
    header.folio_venta,
    header.codigo,
  );

  for (const candidato of candidatos) {
    const value = asString(candidato);
    if (value) return value;
  }

  const id = getVentaIdFromUnknown(raw, fallbackId);
  return id > 0 ? `Venta #${id}` : "Venta sin folio";
}

function toVentaOption(raw: unknown, fallbackId?: number): DevolucionVentaOption {
  const id_venta = getVentaIdFromUnknown(raw, fallbackId);
  const folio = getVentaFolioFromUnknown(raw, fallbackId);

  return {
    id_venta,
    folio,
    label: folio,
  };
}

export const devolucionesVentasService = {
  async buscar(params?: DevolucionesVentasQuery): Promise<{
    items: DevolucionVentaOption[];
    total: number;
  }> {
    const qs = buildVentasQuery(params);
    const { data } = await httpClient.get<VentasListResponse>(`/ventas${qs}`);

    const normalized = normalizeVentasResponse(data);

    return {
      items: normalized.items
        .map((item) => toVentaOption(item))
        .filter((item) => item.id_venta > 0),
      total: normalized.total,
    };
  },

  async obtenerOpcion(id_venta: number): Promise<DevolucionVentaOption> {
    const { data } = await httpClient.get<VentaDetailResponse>(`/ventas/${id_venta}`);
    return toVentaOption(data, id_venta);
  },
};