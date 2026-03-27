// src/modules/ventas/pages/ventas/form/ventasFormAperturas/ventasFormAperturas.constants.ts
// Constantes del flujo de aperturas para ventas.
// Responsabilidades:
// - Centralizar la caja principal por defecto.
// - Centralizar textos base del flujo de caja/apertura.

import type {
  AbrirAperturaFormState,
  VentaCajaDefault,
} from "./ventasFormAperturas.types";

export const VENTAS_CAJA_DEFAULT: VentaCajaDefault = {
  id_caja: 1,
  id_sucursal: 1,
  nombre: "CAJA PRINCIPAL",
  codigo: "CAJA01",
  activo: true,
  label: "CAJA PRINCIPAL • CAJA01",
};

export const VENTAS_APERTURA_UI_TEXTS = {
  cajaAbierta: "Caja abierta",
  cajaCerrada: "Caja cerrada",
  abrirCaja: "Abrir caja",
  cancelar: "Cancelar",
  tituloAbrirApertura: "Abrir apertura",
  descripcionCajaCerrada:
    "La caja está cerrada. Para realizar una venta tienes que abrir la caja.",
  placeholderMontoInicial: "Monto inicial",
};

export const VENTAS_APERTURA_DEFAULT_FORM: AbrirAperturaFormState = {
  id_caja: VENTAS_CAJA_DEFAULT.id_caja,
  caja_label: VENTAS_CAJA_DEFAULT.label,
  monto_inicial: "",
};