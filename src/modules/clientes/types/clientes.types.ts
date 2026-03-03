// src/modules/clientes/types/clientes.types.ts

export type ClienteEstatus = "ACTIVO" | "INACTIVO";

/*
  Item de lista para /clientes (admin) y /clientes/buscar (POS).
  Estos endpoints regresan un resumen del cliente.
*/
export interface ClienteListItem {
  id_cliente: number;
  numero_cliente: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  id_tipo_cliente: number;
  estatus: ClienteEstatus;
}

/*
  Detalle completo para /clientes/{id_cliente}.
*/
export interface Cliente extends ClienteListItem {
  correo?: string | null;
  telefono?: string | null;
  direccion?: string | null;

  fecha_registro?: string;
  fecha_ultima_compra?: string | null;

  credito_habilitado?: boolean;
  credito_limite?: number;
  credito_dias?: number;
  credito_observaciones?: string | null;

  creado_en?: string;
  actualizado_en?: string;
}

/*
  Payload para POST /clientes.
  numero_cliente puede ser opcional si el backend lo autogenera.
*/
export interface ClienteCreate {
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  correo?: string | null;
  telefono?: string | null;
  direccion?: string | null;

  id_tipo_cliente: number;
  numero_cliente?: string;

  credito_habilitado: boolean;
  credito_limite: number;
  credito_dias: number;
  credito_observaciones?: string | null;
}

/*
  Payload para PUT /clientes/{id_cliente}.
*/
export interface ClienteUpdate {
  nombre: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  correo?: string | null;
  telefono?: string | null;
  direccion?: string | null;

  id_tipo_cliente: number;

  credito_habilitado: boolean;
  credito_limite: number;
  credito_dias: number;
  credito_observaciones?: string | null;
}

/*
  Payload para PATCH /clientes/{id_cliente}/estatus.
*/
export interface ClienteEstatusUpdate {
  estatus: ClienteEstatus;
}

/*
  Query para GET /clientes/buscar.
  "q" es requerido por el backend (minLength: 1).
*/
export interface ClientesBuscarQuery {
  q: string;
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
}

/*
  Catálogo de tipos de cliente para combos/selects.
*/
export interface TipoCliente {
  id_tipo_cliente: number;
  nombre: string;
  activo: boolean;
}

/*
  Paged se mantiene igual que en usuarios por consistencia,
  por si después cambias /clientes a paginación real.
*/
export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}