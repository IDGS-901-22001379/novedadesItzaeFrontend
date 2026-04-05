// src/modules/devoluciones_cancelaciones/types/devoluciones_productos.types.ts
// Tipos auxiliares de productos para el módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Definir opciones de producto para búsqueda/autocomplete.
// - Definir filtros de búsqueda por texto o código de barras.

export interface DevolucionProductoOption {
  id_producto: number;
  nombre: string;
  modelo?: string | null;
  sku?: string | null;
  codigo_barras?: string | null;
  label: string;
}

export interface DevolucionesProductosBuscarQuery {
  q: string;
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
}

export interface DevolucionesProductosBarcodeQuery {
  codigo: string;
  solo_activos?: boolean;
}