// src/modules/ventas/services/ventasClientes.service.ts
// Service de clientes para el módulo de ventas.
// Responsabilidades:
// - Buscar clientes para POS.
// - Buscar clientes fiscales.
// - Dejar disponible el tipo de cliente para reglas de precio.
// - Preparar la selección de cliente para usarla después en productos/precios.

import { httpClient } from "../../../services/http/httpClient";
import { tiposClienteService } from "../../clientes/services/tiposCliente.service";
import type {
  VentaClienteFiscalOption,
  VentaClienteOption,
} from "../types";

type ClienteBuscarApiItem = {
  id_cliente: number;
  numero_cliente?: string | null;

  // Cliente persona
  nombre?: string | null;
  apellido_paterno?: string | null;
  apellido_materno?: string | null;

  // Alternativos comunes por si el backend usa otros nombres
  apellidos?: string | null;
  nombre_completo?: string | null;
  cliente_label?: string | null;

  // Cliente empresa
  razon_social?: string | null;

  telefono?: string | null;
  email?: string | null;

  id_tipo_cliente?: number | null;
  tipo_cliente?: string | null;
  tipo_cliente_label?: string | null;
  nombre_tipo_cliente?: string | null;
};

type ClienteFiscalApiItem = {
  id_cliente_fiscal: number;
  razon_social?: string | null;
  rfc?: string | null;
};

type TipoClienteCatalogItem = {
  id_tipo_cliente: number;
  nombre?: string | null;
  tipo_cliente?: string | null;
  tipo_cliente_label?: string | null;
  nombre_tipo_cliente?: string | null;
};

function buildBuscarQuery(params: {
  q: string;
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
}): string {
  const sp = new URLSearchParams();

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

function buildClientesFiscalesQuery(params: {
  q?: string;
  limit?: number;
  offset?: number;
}): string {
  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function safeTrim(value?: string | null): string {
  return value?.trim() ?? "";
}

function normalizeText(value?: string | null): string {
  return safeTrim(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildNombreCompleto(item: ClienteBuscarApiItem): string {
  const nombreCompletoDirecto =
    safeTrim(item.nombre_completo) ||
    safeTrim(item.cliente_label) ||
    safeTrim(item.apellidos);

  if (nombreCompletoDirecto) {
    if (safeTrim(item.nombre) && safeTrim(item.apellidos)) {
      return `${safeTrim(item.nombre)} ${safeTrim(item.apellidos)}`.trim();
    }
    return nombreCompletoDirecto;
  }

  return [
    safeTrim(item.nombre),
    safeTrim(item.apellido_paterno),
    safeTrim(item.apellido_materno),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function toVentaClienteOptionBase(item: ClienteBuscarApiItem): VentaClienteOption {
  const nombreCompleto = buildNombreCompleto(item);

  return {
    id_cliente: item.id_cliente,
    cliente_label:
      safeTrim(item.razon_social) ||
      nombreCompleto ||
      safeTrim(item.numero_cliente) ||
      `Cliente #${item.id_cliente}`,
    telefono: item.telefono ?? null,
    email: item.email ?? null,
    numero_cliente: item.numero_cliente ?? null,
    id_tipo_cliente: item.id_tipo_cliente ?? null,
    tipo_cliente_label:
      safeTrim(item.tipo_cliente_label) ||
      safeTrim(item.nombre_tipo_cliente) ||
      safeTrim(item.tipo_cliente) ||
      null,
  };
}

function toVentaClienteFiscalOption(
  item: ClienteFiscalApiItem,
): VentaClienteFiscalOption {
  return {
    id_cliente_fiscal: item.id_cliente_fiscal,
    razon_social: item.razon_social ?? null,
    rfc: item.rfc ?? null,
    cliente_fiscal_label:
      safeTrim(item.razon_social) ||
      safeTrim(item.rfc) ||
      `Cliente fiscal #${item.id_cliente_fiscal}`,
  };
}

async function enrichTipoClienteLabels(
  items: VentaClienteOption[],
): Promise<VentaClienteOption[]> {
  const needsEnrichment = items.some(
    (item) => item.id_tipo_cliente && !safeTrim(item.tipo_cliente_label),
  );

  if (!needsEnrichment) return items;

  try {
    const catalogo = (await tiposClienteService.listar(true)) as TipoClienteCatalogItem[];

    const tiposMap = new Map<number, string>();

    for (const tipo of catalogo) {
      const label =
        safeTrim(tipo.tipo_cliente_label) ||
        safeTrim(tipo.nombre_tipo_cliente) ||
        safeTrim(tipo.tipo_cliente) ||
        safeTrim(tipo.nombre);

      if (tipo.id_tipo_cliente && label) {
        tiposMap.set(tipo.id_tipo_cliente, label);
      }
    }

    return items.map((item) => ({
      ...item,
      tipo_cliente_label:
        item.tipo_cliente_label ||
        (item.id_tipo_cliente ? tiposMap.get(item.id_tipo_cliente) ?? null : null),
    }));
  } catch {
    return items;
  }
}

export const ventasClientesService = {
  async buscarClientes(params: {
    q: string;
    solo_activos?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<VentaClienteOption[]> {
    const qs = buildBuscarQuery({
      q: params.q,
      solo_activos: params.solo_activos ?? true,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
    });

    const { data } = await httpClient.get<ClienteBuscarApiItem[]>(
      `/clientes/buscar${qs}`,
    );

    const mapped = (Array.isArray(data) ? data : []).map(toVentaClienteOptionBase);
    return enrichTipoClienteLabels(mapped);
  },

  async obtenerClientePublicoGeneral(): Promise<VentaClienteOption | null> {
    const items = await this.buscarClientes({
      q: "Publico General",
      solo_activos: true,
      limit: 20,
      offset: 0,
    });

    return (
      items.find((item) =>
        normalizeText(item.cliente_label).includes("publico general"),
      ) ?? null
    );
  },

  async obtenerClientePorId(
    id_cliente: number,
  ): Promise<VentaClienteOption | null> {
    if (!id_cliente || id_cliente <= 0) return null;

    const { data } = await httpClient.get<ClienteBuscarApiItem>(
      `/clientes/${id_cliente}`,
    );

    if (!data) return null;

    const enriched = await enrichTipoClienteLabels([
      toVentaClienteOptionBase(data),
    ]);

    return enriched[0] ?? null;
  },

  async buscarClientesFiscales(params: {
    id_cliente: number;
    q?: string;
    limit?: number;
    offset?: number;
  }): Promise<VentaClienteFiscalOption[]> {
    if (!params.id_cliente || params.id_cliente <= 0) return [];

    const qs = buildClientesFiscalesQuery({
      q: params.q,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
    });

    const { data } = await httpClient.get<ClienteFiscalApiItem[]>(
      `/clientes/${params.id_cliente}/fiscales${qs}`,
    );

    return (Array.isArray(data) ? data : []).map(toVentaClienteFiscalOption);
  },
};