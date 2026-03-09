// src/modules/proveedores_productos/types/proveedores_productos.types.ts

/* ========================================================================== */
/* Proveedores                                                                */
/* ========================================================================== */

export type ProveedorTipo = "REGISTRADO" | "EXTERNO";
export type ProveedorEstatus = "ACTIVO" | "INACTIVO";

export type Proveedor = {
  id_proveedor: number;
  tipo: ProveedorTipo;
  razon_social: string;
  nombre_contacto: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  condiciones_pago: string | null;
  notas: string | null;
  estatus: ProveedorEstatus;
  creado_en: string;
  actualizado_en: string;
};

export type ProveedorListItem = {
  id_proveedor: number;
  razon_social: string;
  tipo: ProveedorTipo;
  estatus: ProveedorEstatus;
  telefono: string | null;
  correo: string | null;
};

export type ProveedoresListQuery = {
  solo_activos?: boolean;
};

export type ProveedoresBuscarQuery = {
  q: string;
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
};

/* ========================================================================== */
/* Productos (lite visual / auxiliar)                                         */
/* Nota: para búsquedas reales del formulario, conviene usar el ProductoLite  */
/* del módulo productos si estás consumiendo productosService.buscar(...).    */
/* ========================================================================== */

export type ProductoLite = {
  id_producto: number;
  nombre: string;
  sku: string | null;
  codigo_barras: string | null;
  modelo: string | null;
  descripcion?: string | null;
  estatus?: "ACTIVO" | "INACTIVO";
  imagen_ruta?: string | null;
};

/* ========================================================================== */
/* Relación proveedor-producto                                                 */
/* ========================================================================== */

export type ProveedorProducto = {
  id_proveedor: number;
  id_producto: number;
  sku_proveedor: string | null;
  costo_referencia: number | null;
  activo: boolean;
  creado_en: string;
};

export type ProveedorProductoCreate = {
  id_producto: number;
  sku_proveedor: string;
  costo_referencia: number;
  activo: boolean;
};

export type ProveedorProductoUpdate = {
  sku_proveedor: string;
  costo_referencia: number;
  activo: boolean;
};

export type ProveedorProductosListQuery = {
  solo_activos?: boolean;
};

/* ========================================================================== */
/* Estado / filtros de la pantalla                                            */
/* ========================================================================== */

export type ProveedorProductoActivoFilter = "TODOS" | "ACTIVOS" | "INACTIVOS";

export type Proveedores_productosFiltersState = {
  q: string;
  idProveedor: "TODOS" | string;
  activo: ProveedorProductoActivoFilter;
};

export type ProveedoresProductosFiltersQuery = {
  q: string;
  idProveedor: "TODOS" | string;
  activo: ProveedorProductoActivoFilter;
};

/* ========================================================================== */
/* Fila visual de tabla                                                       */
/* Esta no viene directa del backend; se arma en frontend combinando:         */
/* - proveedor                                                                */
/* - producto                                                                 */
/* - relación                                                                 */
/* ========================================================================== */

export type ProveedorProductoRow = {
  id_relacion: string;

  id_proveedor: number;
  razon_social: string;
  proveedor_tipo: ProveedorTipo;
  proveedor_estatus: ProveedorEstatus;
  proveedor_telefono: string | null;
  proveedor_correo: string | null;

  id_producto: number;
  producto_nombre: string;
  producto_sku: string | null;
  producto_codigo_barras: string | null;
  producto_modelo: string | null;
  producto_imagen_ruta?: string | null;

  sku_proveedor: string | null;
  costo_referencia: number | null;
  activo: boolean;
  creado_en: string;
};

/* ========================================================================== */
/* Formulario de relación                                                     */
/* ========================================================================== */

export type Proveedores_productosFormModo = "CREAR" | "EDITAR" | "VER";

export type ProveedorProductoFormState = {
  id_proveedor: number;
  proveedor_nombre: string;

  id_producto: number;
  producto_nombre: string;
  producto_sku: string;
  producto_codigo_barras: string;
  producto_modelo: string;

  sku_proveedor: string;
  costo_referencia: string;
  activo: boolean;
};