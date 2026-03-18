// src/modules/compras/services/compras.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  Compra,
  CompraCreate,
  CompraDetalle,
  CompraListItem,
  ComprasQuery,
} from "../types/compras.types";

export type CompraSucursalOption = {
  id_sucursal: number;
  nombre: string;
};

export type CompraUbicacionOption = {
  id_ubicacion: number;
  label: string;
  id_sucursal?: number;
  sucursal_nombre?: string;
};

export type CompraProveedorOption = {
  id_proveedor: number;
  label: string;
};

export type CompraProductoOption = {
  id_producto: number;
  label: string;
  nombre: string;
  modelo?: string | null;
  codigo_barras?: string | null;
  costo_sugerido?: number | null;
};

// Convierte filtros a querystring (listado de compras)
function buildComprasQuery(params?: ComprasQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (params.id_proveedor !== undefined) {
    sp.set("id_proveedor", String(params.id_proveedor));
  }
  if (params.id_ubicacion_destino !== undefined) {
    sp.set("id_ubicacion_destino", String(params.id_ubicacion_destino));
  }
  if (params.desde) sp.set("desde", params.desde);
  if (params.hasta) sp.set("hasta", params.hasta);
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function buildUbicacionesQuery(params?: {
  id_sucursal?: number;
  solo_activos?: boolean;
}): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function buildSucursalesQuery(params?: {
  solo_activos?: boolean;
}): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.solo_activos !== undefined) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function buildProveedoresBuscarQuery(params: {
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

function buildProductosBuscarQuery(params: {
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

export const comprasService = {
  async listar(params?: ComprasQuery): Promise<CompraListItem[]> {
    const qs = buildComprasQuery(params);
    const { data } = await httpClient.get<CompraListItem[]>(`/compras${qs}`);
    return data;
  },

  async obtener(id_compra: number): Promise<Compra> {
    const { data } = await httpClient.get<Compra>(`/compras/${id_compra}`);
    return data;
  },

  async listarDetalles(id_compra: number): Promise<CompraDetalle[]> {
    const { data } = await httpClient.get<CompraDetalle[]>(
      `/compras/${id_compra}/detalles`,
    );
    return data;
  },

  async crear(payload: CompraCreate): Promise<Compra> {
    const { data } = await httpClient.post<Compra>(`/compras`, payload);
    return data;
  },

  // GET /inventario/sucursales?solo_activos=true
  async listarSucursalesActivas(): Promise<CompraSucursalOption[]> {
    const qs = buildSucursalesQuery({ solo_activos: true });

    const { data } = await httpClient.get<
      Array<{
        id_sucursal: number;
        nombre: string;
      }>
    >(`/inventario/sucursales${qs}`);

    return data.map((item) => ({
      id_sucursal: item.id_sucursal,
      nombre: item.nombre,
    }));
  },

  // GET /inventario/ubicaciones?id_sucursal=...&solo_activos=true
  async listarUbicacionesActivasPorSucursal(
    id_sucursal: number,
  ): Promise<CompraUbicacionOption[]> {
    const qs = buildUbicacionesQuery({
      id_sucursal,
      solo_activos: true,
    });

    const { data } = await httpClient.get<
      Array<{
        id_ubicacion: number;
        nombre: string;
        id_sucursal?: number;
        sucursal_nombre?: string;
      }>
    >(`/inventario/ubicaciones${qs}`);

    return data.map((item) => ({
      id_ubicacion: item.id_ubicacion,
      label: item.sucursal_nombre
        ? `${item.sucursal_nombre} - ${item.nombre}`
        : item.nombre,
      id_sucursal: item.id_sucursal,
      sucursal_nombre: item.sucursal_nombre,
    }));
  },

  async buscarProveedoresActivos(params: {
    q: string;
    limit?: number;
    offset?: number;
  }): Promise<CompraProveedorOption[]> {
    const qs = buildProveedoresBuscarQuery({
      q: params.q,
      solo_activos: true,
      limit: params.limit ?? 10,
      offset: params.offset ?? 0,
    });

    const { data } = await httpClient.get<
      Array<{
        id_proveedor: number;
        razon_social?: string | null;
        nombre_contacto?: string | null;
        nombre?: string | null;
      }>
    >(`/proveedores/buscar${qs}`);

    return data.map((item) => ({
      id_proveedor: item.id_proveedor,
      label:
        item.razon_social?.trim() ||
        item.nombre?.trim() ||
        item.nombre_contacto?.trim() ||
        `Proveedor #${item.id_proveedor}`,
    }));
  },

  async buscarProductos(params: {
    q: string;
    limit?: number;
    offset?: number;
  }): Promise<CompraProductoOption[]> {
    const qs = buildProductosBuscarQuery({
      q: params.q,
      solo_activos: true,
      limit: params.limit ?? 10,
      offset: params.offset ?? 0,
    });

    const { data } = await httpClient.get<
      Array<{
        id_producto: number;
        nombre: string;
        modelo?: string | null;
        codigo_barras?: string | null;
        sku?: string | null;
        precio_compra?: number | null;
        costo?: number | null;
        costo_promedio?: number | null;
      }>
    >(`/productos/buscar${qs}`);

    return data.map((item) => {
      const partesSecundarias = [
        item.modelo?.trim() ? `Modelo: ${item.modelo.trim()}` : "",
        item.codigo_barras?.trim()
          ? `Código: ${item.codigo_barras.trim()}`
          : "",
        item.sku?.trim() ? `SKU: ${item.sku.trim()}` : "",
      ].filter(Boolean);

      return {
        id_producto: item.id_producto,
        nombre: item.nombre,
        modelo: item.modelo ?? null,
        codigo_barras: item.codigo_barras ?? null,
        costo_sugerido:
          item.precio_compra ?? item.costo ?? item.costo_promedio ?? 1,
        label:
          partesSecundarias.length > 0
            ? `${item.nombre} · ${partesSecundarias.join(" · ")}`
            : item.nombre,
      };
    });
  },
};