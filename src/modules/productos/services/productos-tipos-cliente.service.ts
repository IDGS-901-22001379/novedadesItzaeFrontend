// src/modules/productos/services/productos-tipos-cliente.service.ts
// Service auxiliar para el módulo de Productos.
// Responsabilidades:
// - Consumir catálogo de tipos de cliente
// - Alimentar combos/selects del formulario de precios
//
// Regla importante:
// - Para precios normalmente solo se usan tipos de cliente ACTIVOS
//   (ej: Público general, Mayoreo, Distribuidor, etc.)

import { httpClient } from "../../../services/http/httpClient";
import type {
  TipoClienteCatalogo,
  TipoClienteCatalogoCreate,
  TipoClienteCatalogoUpdate,
} from "../types/productos.types";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function buildSoloActivosQuery(solo_activos?: boolean): string {
  if (solo_activos === undefined) return "";
  return `?solo_activos=${String(solo_activos)}`;
}

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

export const productosTiposClienteService = {
  // GET /catalogos/tipos-cliente
  // Para combos del frontend. Por defecto: solo activos.
  async listar(solo_activos = true): Promise<TipoClienteCatalogo[]> {
    const qs = buildSoloActivosQuery(solo_activos);
    const { data } = await httpClient.get<TipoClienteCatalogo[]>(
      `/catalogos/tipos-cliente${qs}`,
    );
    return data;
  },

  // GET /catalogos/tipos-cliente/{id_tipo_cliente}
  async obtener(id_tipo_cliente: number): Promise<TipoClienteCatalogo> {
    const { data } = await httpClient.get<TipoClienteCatalogo>(
      `/catalogos/tipos-cliente/${id_tipo_cliente}`,
    );
    return data;
  },

  // POST /catalogos/tipos-cliente
  async crear(payload: TipoClienteCatalogoCreate): Promise<TipoClienteCatalogo> {
    const { data } = await httpClient.post<TipoClienteCatalogo>(
      `/catalogos/tipos-cliente`,
      payload,
    );
    return data;
  },

  // PUT /catalogos/tipos-cliente/{id_tipo_cliente}
  async actualizar(
    id_tipo_cliente: number,
    payload: TipoClienteCatalogoUpdate,
  ): Promise<TipoClienteCatalogo> {
    const { data } = await httpClient.put<TipoClienteCatalogo>(
      `/catalogos/tipos-cliente/${id_tipo_cliente}`,
      payload,
    );
    return data;
  },

  // PATCH /catalogos/tipos-cliente/{id_tipo_cliente}/desactivar
  async desactivar(id_tipo_cliente: number): Promise<TipoClienteCatalogo> {
    const { data } = await httpClient.patch<TipoClienteCatalogo>(
      `/catalogos/tipos-cliente/${id_tipo_cliente}/desactivar`,
    );
    return data;
  },
};