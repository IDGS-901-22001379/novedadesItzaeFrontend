// src/modules/movimientos_inventario/pages/movimientos_inventario/form/useMovimientosForm.ts
// Hook del formulario de Movimientos de Inventario.
// Responsabilidades:
// - preparar subtítulo
// - exponer movimiento y detalle
// - calcular total formateado
// - controlar apertura de secciones

import { useMemo, useState } from "react";

import type { MovimientoInventarioDetalle } from "../../../types/movimientos_inventario.types";
import type {
  UseMovimientosFormParams,
  UseMovimientosFormResult,
} from "./movimientosForm.types";

function formatMoney(value?: number | null): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(n);
}

function calcularTotalDetalle(
  detalle: MovimientoInventarioDetalle[] = [],
): number {
  return detalle.reduce((acc, item) => acc + Number(item.importe ?? 0), 0);
}

export function useMovimientosForm({
  modo,
  initialMovimiento,
  onSuccess,
}: UseMovimientosFormParams): UseMovimientosFormResult {
  void onSuccess;

  const [openGeneral, setOpenGeneral] = useState(true);
  const [openDetalle, setOpenDetalle] = useState(true);

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar movimiento";
    if (modo === "EDITAR") {
      return `Editar movimiento: ${initialMovimiento?.tipo ?? ""}`;
    }
    return `Visualizar movimiento: ${initialMovimiento?.tipo ?? ""}`;
  }, [modo, initialMovimiento]);

  const movimiento = initialMovimiento ?? null;

  const detalle = useMemo(() => {
    return movimiento?.detalle ?? [];
  }, [movimiento]);

  const totalDetalle = useMemo(() => {
    return formatMoney(calcularTotalDetalle(detalle));
  }, [detalle]);

  return {
    subtitulo,
    movimiento,
    detalle,
    totalDetalle,

    openGeneral,
    setOpenGeneral,

    openDetalle,
    setOpenDetalle,
  };
}