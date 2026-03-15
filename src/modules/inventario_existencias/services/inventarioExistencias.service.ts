import { httpClient } from "../../../services/http/httpClient";
import type {
  AjusteExistenciaPayload,
  AjusteExistenciaResponse,
  ExistenciaDetalle,
  ExistenciaResumenResponse,
  ExistenciasPagedResponse,
  InventarioExistenciasQuery,
  InventarioExistenciasResumenQuery,
} from "../types";

// Convierte filtros del listado principal a querystring
function buildListadoQuery(params?: InventarioExistenciasQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.id_sucursal != null) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.id_ubicacion != null) {
    sp.set("id_ubicacion", String(params.id_ubicacion));
  }

  if (params.id_producto != null) {
    sp.set("id_producto", String(params.id_producto));
  }

  if (params.solo_vendible != null) {
    sp.set("solo_vendible", String(params.solo_vendible));
  }

  if (params.solo_activos != null) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  if (params.include_ceros != null) {
    sp.set("include_ceros", String(params.include_ceros));
  }

  if (typeof params.q === "string" && params.q.trim()) {
    sp.set("q", params.q.trim());
  }

  if (params.limit != null) {
    sp.set("limit", String(params.limit));
  }

  if (params.offset != null) {
    sp.set("offset", String(params.offset));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// Convierte filtros del resumen a querystring
function buildResumenQuery(params: InventarioExistenciasResumenQuery): string {
  const sp = new URLSearchParams();

  const ids = Array.isArray(params.ids_productos)
    ? params.ids_productos.join(",")
    : params.ids_productos;

  sp.set("ids_productos", String(ids));

  if (params.id_sucursal != null) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.todas != null) {
    sp.set("todas", String(params.todas));
  }

  if (params.solo_vendible != null) {
    sp.set("solo_vendible", String(params.solo_vendible));
  }

  if (params.solo_activos != null) {
    sp.set("solo_activos", String(params.solo_activos));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const inventarioExistenciasService = {
  // GET /inventario/existencias
  async listar(params?: InventarioExistenciasQuery): Promise<ExistenciasPagedResponse> {
    const qs = buildListadoQuery(params);
    const { data } = await httpClient.get<ExistenciasPagedResponse>(
      `/inventario/existencias${qs}`,
    );
    return data;
  },

  // GET /inventario/existencias/resumen
  async obtenerResumen(
    params: InventarioExistenciasResumenQuery,
  ): Promise<ExistenciaResumenResponse> {
    const qs = buildResumenQuery(params);
    const { data } = await httpClient.get<ExistenciaResumenResponse>(
      `/inventario/existencias/resumen${qs}`,
    );
    return data;
  },

  // GET /inventario/existencias/{id_existencia}
  async obtener(id_existencia: number): Promise<ExistenciaDetalle> {
    const { data } = await httpClient.get<ExistenciaDetalle>(
      `/inventario/existencias/${id_existencia}`,
    );
    return data;
  },

  // GET /inventario/existencias/ubicacion/{id_ubicacion}/producto/{id_producto}
  async obtenerPorUbicacionProducto(
    id_ubicacion: number,
    id_producto: number,
  ): Promise<ExistenciaDetalle> {
    const { data } = await httpClient.get<ExistenciaDetalle>(
      `/inventario/existencias/ubicacion/${id_ubicacion}/producto/${id_producto}`,
    );
    return data;
  },

  // POST /inventario/existencias/ajuste
  async ajustar(payload: AjusteExistenciaPayload): Promise<AjusteExistenciaResponse> {
    const { data } = await httpClient.post<AjusteExistenciaResponse>(
      `/inventario/existencias/ajuste`,
      payload,
    );
    return data;
  },
};