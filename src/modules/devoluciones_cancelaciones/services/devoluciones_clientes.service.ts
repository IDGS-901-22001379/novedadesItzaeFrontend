// src/modules/devoluciones_cancelaciones/services/devoluciones_clientes.service.ts
// Service auxiliar de clientes para el módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Buscar clientes por texto.
// - Obtener cliente por id y devolver opción amigable para UI.
// - Evitar mostrar el id_cliente directamente al usuario.

import { httpClient } from "../../../services/http/httpClient";
import type {
  DevolucionClienteOption,
  DevolucionesClientesBuscarQuery,
} from "../types/devoluciones_clientes.types";

type ClienteApiItem = {
  id_cliente: number;
  numero_cliente?: string | null;
  nombre?: string | null;
  apellidos?: string | null;
  telefono?: string | null;
  correo?: string | null;
};

function buildBuscarQuery(params?: DevolucionesClientesBuscarQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
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

function normalizeText(value?: string | null): string {
  return (value ?? "").trim();
}

function buildNombreCompleto(item: ClienteApiItem): string {
  const nombre = normalizeText(item.nombre);
  const apellidos = normalizeText(item.apellidos);
  return [nombre, apellidos].filter(Boolean).join(" ") || "Cliente sin nombre";
}

function buildClienteLabel(item: ClienteApiItem): string {
  const nombreCompleto = buildNombreCompleto(item);
  const numeroCliente = normalizeText(item.numero_cliente);
  const telefono = normalizeText(item.telefono);

  if (numeroCliente && telefono) {
    return `${nombreCompleto} · Cliente: ${numeroCliente} · Tel: ${telefono}`;
  }

  if (numeroCliente) {
    return `${nombreCompleto} · Cliente: ${numeroCliente}`;
  }

  if (telefono) {
    return `${nombreCompleto} · Tel: ${telefono}`;
  }

  return nombreCompleto;
}

function toClienteOption(item: ClienteApiItem): DevolucionClienteOption {
  return {
    id_cliente: item.id_cliente,
    numero_cliente: normalizeText(item.numero_cliente) || null,
    nombre_completo: buildNombreCompleto(item),
    telefono: normalizeText(item.telefono) || null,
    correo: normalizeText(item.correo) || null,
    label: buildClienteLabel(item),
  };
}

export const devolucionesClientesService = {
  // GET /clientes/buscar
  async buscar(
    params: DevolucionesClientesBuscarQuery,
  ): Promise<DevolucionClienteOption[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<ClienteApiItem[]>(`/clientes/buscar${qs}`);

    return (Array.isArray(data) ? data : []).map(toClienteOption);
  },

  // GET /clientes/{id_cliente}
  async obtenerOpcion(id_cliente: number): Promise<DevolucionClienteOption> {
    const { data } = await httpClient.get<ClienteApiItem>(`/clientes/${id_cliente}`);
    return toClienteOption(data);
  },
};