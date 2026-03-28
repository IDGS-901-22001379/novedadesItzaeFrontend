// src/modules/ventas/pages/ventas/form/ventasFormAperturas/ventasFormAperturas.types.ts
// Tipos de apoyo para la lógica de aperturas dentro del formulario de ventas.
// Responsabilidades:
// - Definir la caja por defecto.
// - Definir el estado visual de caja.
// - Definir la apertura abierta actual.
// - Definir el payload para abrir apertura.

export type VentaCajaEstatus = "ABIERTA" | "CERRADA";

export type VentaCajaDefault = {
  id_caja: number;
  id_sucursal: number;
  nombre: string;
  codigo: string;
  activo: boolean;
  label: string;
};

export type VentaAperturaActual = {
  id_apertura: number | null;
  id_caja: number;
  id_usuario: number | null;
  fecha_hora_apertura?: string | null;
  apertura_label: string;
  estatus: VentaCajaEstatus;
};

export type AbrirAperturaFormState = {
  id_caja: number;
  caja_label: string;
  monto_inicial: number | "";
};

export type AbrirAperturaPayload = {
  id_caja: number;
  monto_inicial: number;
};

export type VentasFormAperturaContext = {
  cajaDefault: VentaCajaDefault;
  aperturaActual: VentaAperturaActual | null;
  cajaAbierta: boolean;
};