// src/modules/traspasos/pages/traspasos/form/useTraspasosFormSubmit.ts

import { useState } from "react";
import { traspasosService } from "../../../services/traspasos.service";
import type { TraspasoCreate } from "../../../types/traspasos.types";
import type { FormState } from "./traspasosForm.types";
import { getApiErrorMessage } from "../../../../../services/http/getApiErrorMessage";

function validarCrear(form: FormState): string {
  if (!form.id_ubicacion_origen || form.id_ubicacion_origen <= 0) {
    return "Te falta seleccionar la ubicación origen.";
  }

  if (!form.id_ubicacion_destino || form.id_ubicacion_destino <= 0) {
    return "Te falta seleccionar la ubicación destino.";
  }

  if (form.id_ubicacion_origen === form.id_ubicacion_destino) {
    return "La ubicación origen y destino no pueden ser la misma.";
  }

  if (!form.items.length) {
    return "Te falta agregar al menos un producto.";
  }

  for (let i = 0; i < form.items.length; i += 1) {
    const item = form.items[i];

    if (!item.id_producto || item.id_producto <= 0) {
      return `Te falta seleccionar el producto en la fila ${i + 1}.`;
    }

    const cantidad = Number(item.cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      return `La cantidad de la fila ${i + 1} debe ser mayor a 0.`;
    }
  }

  return "";
}

export function useTraspasosFormSubmit(onSuccess: () => void) {
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  async function guardar(form: FormState) {
    const err = validarCrear(form);
    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      const payload: TraspasoCreate = {
        id_ubicacion_origen: form.id_ubicacion_origen,
        id_ubicacion_destino: form.id_ubicacion_destino,
        notas: form.notas.trim() || null,
        items: form.items.map((item) => ({
          id_producto: item.id_producto,
          cantidad: Number(item.cantidad),
        })),
      };

      await traspasosService.crear(payload);
      onSuccess();
    } catch (e: unknown) {
      setMsgError(
        getApiErrorMessage(
          e,
          "No se pudo registrar el traspaso. Revisa existencias y datos capturados.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    saving,
    msgError,
    setMsgError,
    guardar,
  };
}