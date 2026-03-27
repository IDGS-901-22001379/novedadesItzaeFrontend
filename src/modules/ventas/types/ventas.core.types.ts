// src/modules/ventas/types/ventas.core.types.ts
// Tipos base del módulo Ventas.
// Responsabilidades:
// - Centralizar enums/unions reutilizables.
// - Evitar repetir tipos base en varios archivos.

export type VentaEstatus = "COMPLETADA" | "CANCELADA";
export type VentaPresentacion = "UNIDAD" | "CAJA";
export type VentaFuenteHora = "SERVIDOR" | "CLIENTE";