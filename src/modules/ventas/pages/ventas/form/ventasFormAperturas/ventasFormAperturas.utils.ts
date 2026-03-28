// src/modules/ventas/pages/ventas/form/ventasFormAperturas/ventasFormAperturas.utils.ts
// Utilidades del flujo de aperturas en ventas.
// Responsabilidades:
// - Construir labels visibles de caja y apertura.
// - Resolver si una caja/apertura está abierta.
// - Crear estado inicial del modal de apertura.

import {
  VENTAS_APERTURA_DEFAULT_FORM,
  VENTAS_CAJA_DEFAULT,
} from "./ventasFormAperturas.constants";
import type {
  AbrirAperturaFormState,
  VentaAperturaActual,
  VentaCajaDefault,
} from "./ventasFormAperturas.types";

function safeTrim(value?: string | null): string {
  return value?.trim() ?? "";
}

export function buildCajaLabel(params: {
  nombre?: string | null;
  codigo?: string | null;
}): string {
  const nombre = safeTrim(params.nombre);
  const codigo = safeTrim(params.codigo);

  if (nombre && codigo) return `${nombre} • ${codigo}`;
  if (nombre) return nombre;
  if (codigo) return codigo;

  return VENTAS_CAJA_DEFAULT.label;
}

export function buildAperturaLabel(params: {
  id_apertura?: number | null;
  nombre_caja?: string | null;
  codigo_caja?: string | null;
}): string {
  const cajaLabel = buildCajaLabel({
    nombre: params.nombre_caja,
    codigo: params.codigo_caja,
  });

  if (cajaLabel) return cajaLabel;

  return params.id_apertura ? `Apertura #${params.id_apertura}` : "";
}

export function isCajaAbierta(
  apertura: Pick<VentaAperturaActual, "id_apertura" | "estatus"> | null | undefined,
): boolean {
  return Boolean(
    apertura?.id_apertura &&
      String(apertura.estatus).toUpperCase() === "ABIERTA",
  );
}

export function buildCajaDefaultState(
  caja?: Partial<VentaCajaDefault> | null,
): VentaCajaDefault {
  return {
    id_caja: caja?.id_caja ?? VENTAS_CAJA_DEFAULT.id_caja,
    id_sucursal: caja?.id_sucursal ?? VENTAS_CAJA_DEFAULT.id_sucursal,
    nombre: caja?.nombre ?? VENTAS_CAJA_DEFAULT.nombre,
    codigo: caja?.codigo ?? VENTAS_CAJA_DEFAULT.codigo,
    activo: caja?.activo ?? VENTAS_CAJA_DEFAULT.activo,
    label:
      caja?.label ||
      buildCajaLabel({
        nombre: caja?.nombre ?? VENTAS_CAJA_DEFAULT.nombre,
        codigo: caja?.codigo ?? VENTAS_CAJA_DEFAULT.codigo,
      }),
  };
}

export function buildAbrirAperturaFormState(
  caja?: Partial<VentaCajaDefault> | null,
): AbrirAperturaFormState {
  const cajaDefault = buildCajaDefaultState(caja);

  return {
    ...VENTAS_APERTURA_DEFAULT_FORM,
    id_caja: cajaDefault.id_caja,
    caja_label: cajaDefault.label,
  };
}