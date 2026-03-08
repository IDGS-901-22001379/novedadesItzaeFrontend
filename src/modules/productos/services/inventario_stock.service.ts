// src/modules/productos/services/inventario_stock.service.ts
// Services del inventario relacionados al módulo Productos.
// Responsabilidades:
// - Listar sucursales (para selector).
// - (Legacy) Listar existencias por sucursal/producto (paginado, por ubicación).
// - (Nuevo) Obtener resumen de existencias por producto (1 request para la página).
//
// Nota:
// - El endpoint /inventario/existencias devuelve existencias por UBICACIÓN.
// - El endpoint /inventario/existencias/resumen devuelve stock SUMADO por producto.

import { httpClient } from "../../../services/http/httpClient";

/* ----------------------------- Sucursales ----------------------------- */

export type SucursalLite = {
  id_sucursal: number;
  codigo: string;
  nombre: string;
  activo: boolean;
};

/* ---------------------------- Existencias (legacy) ---------------------------- */

export type ExistenciaItem = {
  id_existencia: number;
  id_producto: number;
  id_ubicacion: number;
  existencia: number;
  actualizado_en: string;
};

export type ExistenciasResponse = {
  items: ExistenciaItem[];
  total: number;
  limit: number;
  offset: number;
};

export type ExistenciasQuery = {
  id_sucursal?: number;
  id_producto?: number;
  solo_vendible?: boolean;
  solo_activos?: boolean;
  q?: string;
  limit?: number;
  offset?: number;
};

function buildQuery(params?: ExistenciasQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  if (params.id_sucursal !== undefined)
    sp.set("id_sucursal", String(params.id_sucursal));
  if (params.id_producto !== undefined)
    sp.set("id_producto", String(params.id_producto));

  if (params.solo_vendible !== undefined)
    sp.set("solo_vendible", String(params.solo_vendible));
  if (params.solo_activos !== undefined)
    sp.set("solo_activos", String(params.solo_activos));

  if (params.q) sp.set("q", params.q);

  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/* ---------------------------- Existencias (resumen) ---------------------------- */

export type ExistenciaResumenItem = {
  id_producto: number;
  stock: number;
};

export type ExistenciaResumenResponse = {
  // En tu backend: None cuando todas=true
  id_sucursal: number | null;
  items: ExistenciaResumenItem[];
};

export type ExistenciaResumenQuery = {
  ids_productos: number[];

  // Si todas=false se usa id_sucursal
  id_sucursal?: number;

  // true => suma todas las sucursales
  todas?: boolean;

  // filtros extra
  solo_vendible?: boolean;
  solo_activos?: boolean;
};

function buildResumenQuery(params: ExistenciaResumenQuery): string {
  const sp = new URLSearchParams();

  sp.set("ids_productos", params.ids_productos.join(","));
  sp.set("todas", String(Boolean(params.todas)));

  if (params.id_sucursal !== undefined)
    sp.set("id_sucursal", String(params.id_sucursal));

  if (params.solo_vendible !== undefined)
    sp.set("solo_vendible", String(Boolean(params.solo_vendible)));

  if (params.solo_activos !== undefined)
    sp.set("solo_activos", String(Boolean(params.solo_activos)));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/* -------------------------------- Service API -------------------------------- */

export const inventarioStockService = {
  // GET /inventario/sucursales
  async listarSucursales(solo_activos = true): Promise<SucursalLite[]> {
    const { data } = await httpClient.get<SucursalLite[]>(
      `/inventario/sucursales?solo_activos=${String(solo_activos)}`,
    );
    return data;
  },

  // GET /inventario/existencias (legacy)
  async listarExistencias(params?: ExistenciasQuery): Promise<ExistenciasResponse> {
    const qs = buildQuery(params);
    const { data } = await httpClient.get<ExistenciasResponse>(
      `/inventario/existencias${qs}`,
    );
    return data;
  },

  // GET /inventario/existencias/resumen (nuevo, recomendado)
  async resumenExistencias(
    params: ExistenciaResumenQuery,
  ): Promise<ExistenciaResumenResponse> {
    const qs = buildResumenQuery(params);
    const { data } = await httpClient.get<ExistenciaResumenResponse>(
      `/inventario/existencias/resumen${qs}`,
    );
    return data;
  },
};