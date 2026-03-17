// src/modules/traspasos/pages/traspasos/form/traspasosForm.types.ts

import type { TraspasoDetalle } from "../../../types/traspasos.types";

export type TraspasosFormModo = "CREAR" | "VER";

export type TraspasosFormProps = {
  modo: TraspasosFormModo;
  initialTraspaso: TraspasoDetalle | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export type FormItemState = {
  id_producto: number;
  cantidad: string;
};

export type FormState = {
  id_ubicacion_origen: number;
  id_ubicacion_destino: number;
  notas: string;
  items: FormItemState[];
};

export type UbicacionOption = {
  id: number;
  label: string;
};

export type ProductoOption = {
  id: number;
  label: string;
  nombre: string;
  modelo: string;
  codigo_barras: string;
};