// src/modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/form/devolucionesForm.types.ts
// Tipos internos del formulario de Devoluciones/Cancelaciones.
// Responsabilidades:
// - Definir modo del formulario.
// - Definir estado del formulario y del detalle.
// - Definir tipo de opción de ubicación usada por la UI.

import type {
  DevolucionDetail,
  DevolucionDisposicion,
  DevolucionTipo,
} from "../../../types/devoluciones_cancelaciones.types";

export type Devoluciones_cancelacionesFormModo = "CREAR" | "EDITAR" | "VER";

export type DevolucionesFormProps = {
  modo: Devoluciones_cancelacionesFormModo;
  initialDevolucion: DevolucionDetail | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export type FormDetalleState = {
  id_producto: string;
  cantidad_devuelta: string;
  precio_unitario: string;
  importe: string;
};

export type FormState = {
  id_venta: string;
  tipo: DevolucionTipo;
  motivo: string;
  id_forma_pago_reembolso: string;
  genera_nota_credito_interna: boolean;
  disposicion: DevolucionDisposicion;
  id_ubicacion_destino: string;
  importe_devuelto: string;
  detalle: FormDetalleState;
};

export type UbicacionOption = {
  id_ubicacion: number;
  id_sucursal: number;
  sucursal_nombre: string;
  nombre: string;
  tipo: "TIENDA" | "BODEGA" | "OTRO";
  label: string;
};