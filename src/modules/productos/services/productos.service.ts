// src/modules/productos/services/productos.service.ts
// Service de Productos.
// Responsabilidades:
// - Listado admin / CRUD (GET/POST/PUT/PATCH)
// - Búsquedas para POS (buscar normal y barcode scanner)
// - Catálogos (tipos, categorías, marcas, unidades)
// - Precios (historial, vigente, alta)

// Nota: Este service solo consume API y regresa data tipada.
// La UI decide cómo mostrar errores / mensajes.

import { httpClient } from "../../../services/http/httpClient";
import type {
  Producto,
  ProductoCreate,
  ProductoUpdate,
  ProductoEstatusUpdate,
  ProductosListQuery,
  ProductosBuscarQuery,
  ProductosBarcodeQuery,
  ProductoLite, // (opcional) si tu types lo separa para /buscar y /barcode
  ProductoTipo,
  ProductoCategoria,
  ProductoMarca,
  UnidadMedida,
  PrecioProducto,
  PrecioProductoCreate,
  PrecioVigenteQuery,
} from "../types/productos.types";

/* -------------------------------------------------------------------------- */
/* Helpers: querystring                                                       */
/* -------------------------------------------------------------------------- */

// Convierte filtros a querystring para listado admin: GET /productos
function buildListQuery(params?: ProductosListQuery): string {
  if (!params) return "";
  const sp = new URLSearchParams();

  // según Swagger: solo_activos boolean (default false)
  if (params.solo_activos !== undefined) sp.set("solo_activos", String(params.solo_activos));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros a querystring para buscar normal: GET /productos/buscar
function buildBuscarQuery(params: ProductosBuscarQuery): string {
  const sp = new URLSearchParams();

  // q es requerido
  sp.set("q", params.q);

  // filtros opcionales
  if (params.solo_activos !== undefined) sp.set("solo_activos", String(params.solo_activos));
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.offset !== undefined) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros a querystring para buscar por barcode: GET /productos/barcode
function buildBarcodeQuery(params: ProductosBarcodeQuery): string {
  const sp = new URLSearchParams();

  // codigo es requerido
  sp.set("codigo", params.codigo);

  if (params.solo_activos !== undefined) sp.set("solo_activos", String(params.solo_activos));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros a querystring para catálogos: GET /productos/catalogos/*
function buildSoloActivosQuery(solo_activos?: boolean): string {
  if (solo_activos === undefined) return "";
  return `?solo_activos=${String(solo_activos)}`;
}

// Convierte query para precio vigente: GET /productos/{id}/precios/vigente
function buildPrecioVigenteQuery(params: PrecioVigenteQuery): string {
  const sp = new URLSearchParams();

  // requeridos por swagger
  sp.set("id_tipo_cliente", String(params.id_tipo_cliente));
  sp.set("presentacion", String(params.presentacion));

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

export const productosService = {
  /* ------------------------------- BÚSQUEDAS ------------------------------ */

  // GET /productos/buscar
  // Búsqueda normal (UI / ventas manuales).
  // q puede ser: nombre, sku, modelo, descripción o incluso código escrito.
  async buscar(params: ProductosBuscarQuery): Promise<ProductoLite[]> {
    const qs = buildBuscarQuery(params);
    const { data } = await httpClient.get<ProductoLite[]>(`/productos/buscar${qs}`);
    return data;
  },

  // GET /productos/barcode
  // Búsqueda por código de barras (scanner).
  // Backend puede devolver null si NO es candidato de scanner o no encuentra.
  async barcode(params: ProductosBarcodeQuery): Promise<ProductoLite | null> {
    const qs = buildBarcodeQuery(params);
    const { data } = await httpClient.get<ProductoLite | null>(`/productos/barcode${qs}`);
    return data;
  },

  /* ------------------------------ CRUD ADMIN ------------------------------ */

  // GET /productos
  // Listado administrativo (normalmente solo admin).
  async listar(params?: ProductosListQuery): Promise<ProductoLite[]> {
    const qs = buildListQuery(params);
    const { data } = await httpClient.get<ProductoLite[]>(`/productos${qs}`);
    return data;
  },

  // GET /productos/{id_producto}
  // Detalle del producto por ID.
  async obtener(id_producto: number): Promise<Producto> {
    const { data } = await httpClient.get<Producto>(`/productos/${id_producto}`);
    return data;
  },

  // POST /productos
  // Alta de producto (admin).
  async crear(payload: ProductoCreate): Promise<Producto> {
    const { data } = await httpClient.post<Producto>(`/productos`, payload);
    return data;
  },

  // PUT /productos/{id_producto}
  // Edición de producto (admin).
  async actualizar(id_producto: number, payload: ProductoUpdate): Promise<Producto> {
    const { data } = await httpClient.put<Producto>(`/productos/${id_producto}`, payload);
    return data;
  },

  // PATCH /productos/{id_producto}/estatus
  // Activar/Inactivar producto.
  async cambiarEstatus(id_producto: number, payload: ProductoEstatusUpdate): Promise<Producto> {
    const { data } = await httpClient.patch<Producto>(`/productos/${id_producto}/estatus`, payload);
    return data;
  },

  /* -------------------------------- CATÁLOGOS ----------------------------- */

  catalogos: {
    // GET /productos/catalogos/tipos
    async tipos(solo_activos = true): Promise<ProductoTipo[]> {
      const qs = buildSoloActivosQuery(solo_activos);
      const { data } = await httpClient.get<ProductoTipo[]>(`/productos/catalogos/tipos${qs}`);
      return data;
    },

    // GET /productos/catalogos/categorias
    async categorias(solo_activos = true): Promise<ProductoCategoria[]> {
      const qs = buildSoloActivosQuery(solo_activos);
      const { data } = await httpClient.get<ProductoCategoria[]>(
        `/productos/catalogos/categorias${qs}`,
      );
      return data;
    },

    // GET /productos/catalogos/marcas
    async marcas(solo_activos = true): Promise<ProductoMarca[]> {
      const qs = buildSoloActivosQuery(solo_activos);
      const { data } = await httpClient.get<ProductoMarca[]>(`/productos/catalogos/marcas${qs}`);
      return data;
    },

    // GET /productos/catalogos/unidades
    async unidades(solo_activos = true): Promise<UnidadMedida[]> {
      const qs = buildSoloActivosQuery(solo_activos);
      const { data } = await httpClient.get<UnidadMedida[]>(`/productos/catalogos/unidades${qs}`);
      return data;
    },
  },

  /* --------------------------------- PRECIOS ------------------------------ */

  precios: {
    // GET /productos/{id_producto}/precios
    // Historial de precios por producto (admin).
    async listarHistorial(id_producto: number): Promise<PrecioProducto[]> {
      const { data } = await httpClient.get<PrecioProducto[]>(`/productos/${id_producto}/precios`);
      return data;
    },

    // GET /productos/{id_producto}/precios/vigente?id_tipo_cliente=...&presentacion=...
    // Obtiene el precio vigente para ventas.
    // Si no hay precio vigente, devuelve null (la UI decide qué hacer).
    async obtenerVigente(
      id_producto: number,
      params: PrecioVigenteQuery,
    ): Promise<PrecioProducto | null> {
      const qs = buildPrecioVigenteQuery(params);
      const { data } = await httpClient.get<PrecioProducto | null>(
        `/productos/${id_producto}/precios/vigente${qs}`,
      );
      return data;
    },

    // POST /productos/precios
    // Alta de precio (admin).
    async crear(payload: PrecioProductoCreate): Promise<PrecioProducto> {
      const { data } = await httpClient.post<PrecioProducto>(`/productos/precios`, payload);
      return data;
    },
  },
};