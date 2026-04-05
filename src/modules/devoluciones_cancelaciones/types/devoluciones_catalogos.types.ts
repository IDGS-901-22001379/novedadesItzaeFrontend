// src/modules/devoluciones_cancelaciones/types/devoluciones_catalogos.types.ts
// Tipos de catálogos auxiliares del módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Definir opciones de forma de pago para reembolso.

export interface DevolucionFormaPagoOption {
  id_forma_pago: number;
  clave?: string | null;
  label: string;
}