// src/modules/ventas/pages/ventas/form/ventasFormAperturas/ventasFormAperturas.catalogs.ts
// Resolución de datos base para la lógica de aperturas en ventas.
// Responsabilidades:
// - Resolver la caja principal por defecto.
// - Resolver la apertura activa de esa caja.
// - Construir el contexto inicial de apertura para el formulario.

import { ventasFormAperturasService } from "./ventasFormAperturas.service";
import { VENTAS_CAJA_DEFAULT } from "./ventasFormAperturas.constants";
import { buildCajaDefaultState, isCajaAbierta } from "./ventasFormAperturas.utils";
import type {
  VentaAperturaActual,
  VentaCajaDefault,
  VentasFormAperturaContext,
} from "./ventasFormAperturas.types";

export async function resolveCajaPrincipalDefault(): Promise<VentaCajaDefault> {
  try {
    const caja = await ventasFormAperturasService.obtenerCajaPrincipal();
    return buildCajaDefaultState(caja);
  } catch {
    return buildCajaDefaultState(VENTAS_CAJA_DEFAULT);
  }
}

export async function resolveAperturaPrincipalActiva(): Promise<VentaAperturaActual | null> {
  try {
    return await ventasFormAperturasService.obtenerAperturaActivaCajaPrincipal();
  } catch {
    return null;
  }
}

export async function loadVentasFormAperturaContext(): Promise<VentasFormAperturaContext> {
  const [cajaDefault, aperturaActual] = await Promise.all([
    resolveCajaPrincipalDefault(),
    resolveAperturaPrincipalActiva(),
  ]);

  return {
    cajaDefault,
    aperturaActual,
    cajaAbierta: isCajaAbierta(aperturaActual),
  };
}