// src/modules/inventario_existencias/pages/inventario_existencias/form/inventarioExistenciasForm.types.ts

import type { Dispatch, SetStateAction } from "react";
import type { ExistenciaDetalle } from "../../../types/inventarioExistencias.types";

export type InventarioExistenciasFormModo = "AJUSTE" | "VER";

export type InventarioExistenciasFormProps = {
  modo: InventarioExistenciasFormModo;
  initialExistencia: ExistenciaDetalle | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export type FormState = {
  tipo: "AJUSTE" | "MERMA";
  motivo: string;
  referencia_tipo: string;
  referencia_id: string;
  modo_captura: "CAMBIO_FINAL" | "MOVIMIENTO";
  cantidad_movimiento: string;
  nueva_existencia: string;
};

export type FormSetter = Dispatch<SetStateAction<FormState>>;