// src/modules/inventario_existencias/types/inventarioExistencias.types.ts

export interface ExistenciaProductoLite {
  id_producto: number;
  sku: string | null;
  nombre: string;
  imagen_url?: string | null;

  // Opcionales para UI si después enriqueces desde productosService
  codigo_barras?: string | null;
  modelo?: string | null;
  estatus?: string | null;
}

export interface ExistenciaUbicacionLite {
  id_ubicacion: number;
  id_sucursal: number | null;
  tipo: string | null;
  nombre: string | null;
  codigo: string | null;
  vendible: boolean | null;
  activo: boolean | null;
  estatus?: string | null;

  creado_en?: string | null;
  actualizado_en?: string | null;

  // Para UI
  sucursal_nombre?: string | null;
  ubicacion_nombre_completo?: string | null;
}

export interface ExistenciaItem {
  // Cuando include_ceros=true puede venir null
  id_existencia: number | null;

  id_producto: number;
  id_ubicacion: number;
  existencia: number;

  // Cuando la fila es virtual puede venir null
  actualizado_en: string | null;

  // true si viene de tabla real, false si fue generado en cobertura
  es_existencia_real: boolean;

  // Opcionales si el backend manda joins enriquecidos
  producto?: ExistenciaProductoLite | null;
  ubicacion?: ExistenciaUbicacionLite | null;

  // Campos planos opcionales para UI/tabla
  producto_nombre?: string | null;
  producto_sku?: string | null;
  producto_imagen_url?: string | null;
  producto_codigo_barras?: string | null;
  producto_modelo?: string | null;
  producto_estatus?: string | null;

  sucursal_nombre?: string | null;
  ubicacion_nombre?: string | null;
  ubicacion_codigo?: string | null;
  ubicacion_tipo?: string | null;
  ubicacion_vendible?: boolean | null;
  ubicacion_activo?: boolean | null;
}

export interface ExistenciaDetalle {
  // Puede ser null si en algún momento reutilizas este tipo con cobertura
  id_existencia: number | null;

  id_producto: number;
  id_ubicacion: number;
  existencia: number;

  creado_en: string | null;
  actualizado_en: string | null;

  es_existencia_real?: boolean;

  producto?: ExistenciaProductoLite | null;
  ubicacion?: ExistenciaUbicacionLite | null;
}

export interface ExistenciaResumenItem {
  id_producto: number;
  stock: number;
}

export interface ExistenciaResumenResponse {
  id_sucursal: number | null;
  items: ExistenciaResumenItem[];
}

export interface InventarioExistenciasQuery {
  id_sucursal?: number;
  id_ubicacion?: number;
  id_producto?: number;
  solo_vendible?: boolean;
  solo_activos?: boolean;
  include_ceros?: boolean;
  q?: string;
  limit?: number;
  offset?: number;
}

export interface InventarioExistenciasResumenQuery {
  ids_productos: number[] | string;
  id_sucursal?: number;
  todas?: boolean;
  solo_vendible?: boolean;
  solo_activos?: boolean;
}

export interface ExistenciasPagedResponse {
  items: ExistenciaItem[];
  total: number;
  limit: number;
  offset: number;
  include_ceros?: boolean;
}

export type TipoAjusteExistencia = "AJUSTE" | "MERMA";

export interface AjusteExistenciaItem {
  id_producto: number;

  // Puede venir uno u otro según el modo
  delta?: number | null;
  nueva_existencia?: number | null;
}

export interface AjusteExistenciaPayload {
  id_ubicacion: number;
  tipo: TipoAjusteExistencia | string;
  motivo: string;
  referencia_tipo?: string | null;
  referencia_id?: number | string | null;
  items: AjusteExistenciaItem[];
}

export interface AjusteExistenciaResultadoItem {
  id_existencia: number;
  id_producto: number;
  id_ubicacion: number;
  existencia_antes: number;
  existencia_despues: number;

  modo?: "DELTA" | "ABSOLUTO";
  delta?: number;
  nueva_existencia?: number;
  delta_calculado?: number;
}

export interface AjusteExistenciaResponse {
  ok?: boolean;
  tipo?: string;
  id_ubicacion?: number;
  motivo?: string | null;
  referencia_tipo?: string | null;
  referencia_id?: number | string | null;
  items?: AjusteExistenciaResultadoItem[];

  [key: string]: unknown;
}