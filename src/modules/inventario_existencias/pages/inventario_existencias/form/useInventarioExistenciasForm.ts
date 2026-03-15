// src/modules/inventario_existencias/pages/inventario_existencias/form/useInventarioExistenciasForm.ts

import { useMemo, useState } from "react";

import { inventarioExistenciasService } from "../../../services/inventarioExistencias.service";

import type {
  FormState,
  InventarioExistenciasFormProps,
} from "./inventarioExistenciasForm.types";

import {
  buildInitialForm,
  getApiErrorMessage,
  getProductoNombre,
  toSafeNumber,
} from "./inventarioExistenciasForm.utils";

import { validarInventarioExistenciasForm } from "./inventarioExistenciasForm.validators";

export function useInventarioExistenciasForm({
  modo,
  initialExistencia,
  onSuccess,
}: InventarioExistenciasFormProps) {
  const readOnly = modo === "VER";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(initialExistencia),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [msgOk, setMsgOk] = useState("");

  const subtitulo = useMemo(() => {
    if (modo === "AJUSTE") {
      return `Ajustar existencia: ${getProductoNombre(initialExistencia)}`;
    }
    return `Visualizar existencia: ${getProductoNombre(initialExistencia)}`;
  }, [modo, initialExistencia]);

  const existenciaActual = Number(initialExistencia?.existencia ?? 0);
  const esRegistroVirtual = initialExistencia?.es_existencia_real === false;

  const cantidadMovimientoNum = useMemo(
    () => toSafeNumber(form.cantidad_movimiento || "0"),
    [form.cantidad_movimiento],
  );

  const nuevaExistenciaNum = useMemo(
    () => toSafeNumber(form.nueva_existencia || "0"),
    [form.nueva_existencia],
  );

  const deltaCalculado = useMemo(() => {
    if (form.modo_captura === "CAMBIO_FINAL") {
      if (!Number.isFinite(nuevaExistenciaNum)) return NaN;
      return nuevaExistenciaNum - existenciaActual;
    }

    if (!Number.isFinite(cantidadMovimientoNum)) return NaN;

    if (form.tipo === "MERMA") {
      return -Math.abs(cantidadMovimientoNum);
    }

    return Math.abs(cantidadMovimientoNum);
  }, [
    form.modo_captura,
    form.tipo,
    cantidadMovimientoNum,
    nuevaExistenciaNum,
    existenciaActual,
  ]);

  const nuevaExistenciaPreview = useMemo(() => {
    if (!Number.isFinite(deltaCalculado)) return existenciaActual;
    return existenciaActual + deltaCalculado;
  }, [deltaCalculado, existenciaActual]);

  async function guardar() {
    const err = validarInventarioExistenciasForm({
      item: initialExistencia,
      form,
      existenciaActual,
      cantidadMovimientoNum,
      nuevaExistenciaNum,
      deltaCalculado,
      nuevaExistenciaPreview,
    });

    if (err) {
      setMsgError(err);
      setMsgOk("");
      return;
    }

    if (!initialExistencia) {
      setMsgError("No se encontró la existencia a ajustar.");
      setMsgOk("");
      return;
    }

    try {
      setSaving(true);
      setMsgError("");
      setMsgOk("");

      const itemAjuste =
        form.modo_captura === "MOVIMIENTO"
          ? {
              id_producto: initialExistencia.id_producto,
              delta: deltaCalculado,
            }
          : {
              id_producto: initialExistencia.id_producto,
              nueva_existencia: nuevaExistenciaPreview,
            };

      await inventarioExistenciasService.ajustar({
        id_ubicacion: initialExistencia.id_ubicacion,
        tipo: form.tipo,
        motivo: form.motivo.trim(),
        referencia_tipo: form.referencia_tipo.trim() || null,
        referencia_id: form.referencia_id.trim()
          ? Number(form.referencia_id.trim())
          : null,
        items: [itemAjuste],
      });

      setMsgOk("La existencia se ajustó correctamente.");
      onSuccess();
    } catch (e: unknown) {
      setMsgError(getApiErrorMessage(e));
      setMsgOk("");
    } finally {
      setSaving(false);
    }
  }

  return {
    readOnly,
    form,
    setForm,
    saving,
    msgError,
    msgOk,
    subtitulo,
    existenciaActual,
    esRegistroVirtual,
    cantidadMovimientoNum,
    nuevaExistenciaNum,
    deltaCalculado,
    nuevaExistenciaPreview,
    guardar,
  };
}