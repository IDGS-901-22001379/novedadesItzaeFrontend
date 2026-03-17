// src/modules/traspasos/pages/traspasos/form/useTraspasosFormState.ts

import { useMemo, useState } from "react";
import type {
  FormItemState,
  FormState,
  TraspasosFormModo,
} from "./traspasosForm.types";
import type { TraspasoDetalle } from "../../../types/traspasos.types";
import { buildInitialForm } from "./traspasosForm.utils";

export function useTraspasosFormState(
  modo: TraspasosFormModo,
  initialTraspaso: TraspasoDetalle | null,
) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialTraspaso),
  );

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar traspaso";
    return `Visualizar traspaso: ${initialTraspaso?.id_movimiento ?? ""}`;
  }, [modo, initialTraspaso]);

  function setItem(index: number, patch: Partial<FormItemState>) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  function agregarItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { id_producto: 0, cantidad: "1" }],
    }));
  }

  function eliminarItem(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  return {
    readOnly,
    form,
    setForm,
    subtitulo,
    setItem,
    agregarItem,
    eliminarItem,
  };
}