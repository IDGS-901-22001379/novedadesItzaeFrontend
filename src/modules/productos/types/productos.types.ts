// src/modules/productos/types/productos.types.ts
// Types del módulo Productos.
// Incluye:
// - ProductoLite (listado / buscar / barcode)
// - Producto (detalle admin)
// - Payloads (create/update/estatus)
// - Queries (buscar/listar/barcode)
// - Catálogos (tipos, categorías, marcas, unidades)
// - Precios (historial, vigente, alta)
// - Tipos de cliente (para precios por cliente)

export type ProductoEstatus = "ACTIVO" | "INACTIVO";
export type Moneda = "MXN";
export type PresentacionPrecio = "UNIDAD" | "CAJA";

/* -------------------------------------------------------------------------- */
/* Listados / búsquedas                                                       */
/* -------------------------------------------------------------------------- */

// Respuesta ligera de producto (se usa en: /productos, /productos/buscar, /productos/barcode)
export type ProductoLite = {
  id_producto: number;
  sku: string;
  codigo_barras: string | null;
  nombre: string;
  estatus: ProductoEstatus;
  id_categoria: number;
  id_marca: number;
  id_proveedor: number;

  // Campos útiles para UI / filtros / tabla
  imagen_ruta?: string | null;
  modelo?: string | null;
  descripcion?: string | null;

  // Útil si después enriqueces desde frontend
  stock_minimo_tienda?: number | null;
};

// Query de listado admin: GET /productos
export type ProductosListQuery = {
  // swagger: solo_activos boolean (default false)
  solo_activos?: boolean;
};

// Query de búsqueda normal: GET /productos/buscar
export type ProductosBuscarQuery = {
  // requerido
  q: string; // min 1, max 160

  // opcionales
  solo_activos?: boolean; // default true (en swagger)
  limit?: number; // default 20, min 1, max 50
  offset?: number; // default 0, min 0
};

// Query de búsqueda por scanner: GET /productos/barcode
export type ProductosBarcodeQuery = {
  // requerido
  codigo: string; // min 1, max 40

  // opcional
  solo_activos?: boolean; // default true
};

/* -------------------------------------------------------------------------- */
/* Detalle / CRUD                                                             */
/* -------------------------------------------------------------------------- */

// Producto completo (detalle admin): GET /productos/{id_producto}
export type Producto = {
  id_producto: number;

  sku: string;
  codigo_barras: string | null;

  nombre: string;
  modelo: string | null;
  descripcion: string | null;

  // Metadata de imagen
  imagen_ruta: string | null;
  imagen_mime: string | null;
  imagen_size_bytes: number | null;
  imagen_hash: string | null;

  // Catálogos
  id_producto_tipo: number;
  id_categoria: number;
  id_marca: number;

  estatus: ProductoEstatus;

  // Unidad principal
  id_unidad_medida_principal: number;

  // Venta por caja
  permite_venta_por_caja: boolean;
  unidades_por_caja: number | null;
  id_unidad_medida_caja: number | null;

  // Inventario mínimo
  stock_minimo_tienda: number;

  // Notas internas
  notas_internas: string | null;

  // CFDI / SAT
  clave_prod_serv_sat: string | null;
  clave_unidad_sat: string | null;
  unidad_cfdi: string | null;

  // Impuestos / Facturación
  facturable: boolean;
  iva_tasa: number;

  // Auditoría
  creado_en: string;
  actualizado_en: string;
};

// Payload: POST /productos
export type ProductoCreate = {
  sku: string;
  codigo_barras?: string | null;

  nombre: string;
  modelo?: string | null;
  descripcion?: string | null;

  imagen_ruta?: string | null;
  imagen_mime?: string | null;
  imagen_size_bytes?: number | null;
  imagen_hash?: string | null;

  id_producto_tipo: number;
  id_categoria: number;
  id_marca: number;

  estatus?: ProductoEstatus;

  id_unidad_medida_principal: number;

  permite_venta_por_caja: boolean;
  unidades_por_caja?: number | null;
  id_unidad_medida_caja?: number | null;

  stock_minimo_tienda?: number;

  notas_internas?: string | null;

  clave_prod_serv_sat?: string | null;
  clave_unidad_sat?: string | null;
  unidad_cfdi?: string | null;

  facturable: boolean;
  iva_tasa: number;
};

// Payload: PUT /productos/{id_producto}
export type ProductoUpdate = {
  sku: string;
  codigo_barras?: string | null;

  nombre: string;
  modelo?: string | null;
  descripcion?: string | null;

  imagen_ruta?: string | null;
  imagen_mime?: string | null;
  imagen_size_bytes?: number | null;
  imagen_hash?: string | null;

  id_producto_tipo: number;
  id_categoria: number;
  id_marca: number;

  estatus: ProductoEstatus;

  id_unidad_medida_principal: number;

  permite_venta_por_caja: boolean;
  unidades_por_caja?: number | null;
  id_unidad_medida_caja?: number | null;

  stock_minimo_tienda: number;

  notas_internas?: string | null;

  clave_prod_serv_sat?: string | null;
  clave_unidad_sat?: string | null;
  unidad_cfdi?: string | null;

  facturable: boolean;
  iva_tasa: number;
};

// Payload: PATCH /productos/{id_producto}/estatus
export type ProductoEstatusUpdate = {
  estatus: ProductoEstatus;
};

/* -------------------------------------------------------------------------- */
/* Catálogos del módulo producto                                              */
/* -------------------------------------------------------------------------- */

export type ProductoTipo = {
  id_producto_tipo: number;
  nombre: string;
  activo: boolean;
};

export type ProductoCategoria = {
  id_categoria: number;
  nombre: string;
  activo: boolean;
};

export type ProductoMarca = {
  id_marca: number;
  nombre: string;
  activo: boolean;
};

export type UnidadMedida = {
  id_unidad_medida: number;
  nombre: string;
  abreviatura: string;
  activo: boolean;
};

/* -------------------------------------------------------------------------- */
/* Catálogo: Tipos de cliente                                                 */
/* -------------------------------------------------------------------------- */

// Para combos/selects del formulario de precios.
// Ej: Público general, Mayoreo, Distribuidor, etc.
export type TipoClienteCatalogo = {
  id_tipo_cliente: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
};

export type TipoClienteCatalogoCreate = {
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
};

export type TipoClienteCatalogoUpdate = {
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
};

/* -------------------------------------------------------------------------- */
/* Precios                                                                    */
/* -------------------------------------------------------------------------- */

// Respuesta precio: GET /productos/{id}/precios, /precios/vigente, POST /productos/precios
export type PrecioProducto = {
  id_precio: number;
  id_producto: number;
  id_tipo_cliente: number;

  // opcional para UI si luego el backend lo expone en joins
  tipo_cliente_nombre?: string | null;

  presentacion: PresentacionPrecio;
  moneda: Moneda;

  precio: number;

  vigente_desde: string; // YYYY-MM-DD
  vigente_hasta: string | null; // YYYY-MM-DD o null

  activo: boolean;
  creado_en: string; // ISO datetime
};

// Query para precio vigente: GET /productos/{id}/precios/vigente?id_tipo_cliente=...&presentacion=...
export type PrecioVigenteQuery = {
  id_tipo_cliente: number;
  presentacion: PresentacionPrecio;
};

// Payload para alta de precio: POST /productos/precios
export type PrecioProductoCreate = {
  id_producto: number;
  id_tipo_cliente: number;

  presentacion: PresentacionPrecio;
  moneda: Moneda;

  precio: number;

  vigente_desde: string;
  vigente_hasta?: string | null;

  activo: boolean;
};

/* -------------------------------------------------------------------------- */
/* Formularios / UI de precios                                                */
/* -------------------------------------------------------------------------- */

// Estado útil para form de alta de precio
export type PrecioProductoFormState = {
  id_tipo_cliente: number | "";
  presentacion: PresentacionPrecio;
  moneda: Moneda;
  precio: string;
  vigente_desde: string;
  vigente_hasta: string;
  activo: boolean;
};

// Opciones fijas para select de presentación
export const PRESENTACIONES_PRECIO_OPTIONS: Array<{
  value: PresentacionPrecio;
  label: string;
}> = [
  { value: "UNIDAD", label: "Unidad" },
  { value: "CAJA", label: "Caja" },
];

// Opciones fijas para moneda
export const MONEDAS_OPTIONS: Array<{
  value: Moneda;
  label: string;
}> = [{ value: "MXN", label: "MXN" }];

export type PrecioProductoUpdate = {
  id_producto: number;
  id_tipo_cliente: number;

  presentacion: PresentacionPrecio;
  moneda: Moneda;

  precio: number;

  vigente_desde: string;
  vigente_hasta?: string | null;

  activo: boolean;
};