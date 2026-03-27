// src/modules/ventas/pages/ventas/form/ventasFromdetalle/useVentasFormDetalleNavigation.ts

import { useEffect, useRef } from "react";
import type { VentaDetalleForm } from "../ventasForm.types";
import type {
  EditableField,
  ModalBuscadorState,
} from "./ventasFormDetalle.types";
import { EDITABLE_FIELDS, buildCellKey } from "./ventasFormDetalle.helpers";

type Params = {
  detalles: VentaDetalleForm[];
  detallesOrdenados: Array<{
    detalle: VentaDetalleForm;
    indexOriginal: number;
  }>;
  posicionVisiblePorIndexOriginal: Map<number, number>;
  readOnly: boolean;
  setModalBuscador: React.Dispatch<React.SetStateAction<ModalBuscadorState>>;
  setPaginaModal: React.Dispatch<React.SetStateAction<number>>;
  modalSearchInputRef: React.RefObject<HTMLInputElement | null>;
  onUpdateDetalle: (index: number, patch: Partial<VentaDetalleForm>) => void;
};

export function useVentasFormDetalleNavigation({
  detalles,
  detallesOrdenados,
  posicionVisiblePorIndexOriginal,
  readOnly,
  setModalBuscador,
  setPaginaModal,
  modalSearchInputRef,
  onUpdateDetalle,
}: Params) {
  const cellRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement | null>
  >({});

  const prevDetallesLengthRef = useRef(detalles.length);

  function setCellRef(
    rowIndex: number,
    field: EditableField,
    element: HTMLInputElement | HTMLSelectElement | null,
  ) {
    cellRefs.current[buildCellKey(rowIndex, field)] = element;
  }

  function focusCell(rowIndex: number, field: EditableField) {
    const element = cellRefs.current[buildCellKey(rowIndex, field)];
    if (!element) return;

    element.focus();

    if (element instanceof HTMLInputElement) {
      element.select();
    }
  }

  function normalizeNumericBlur(
    rowIndex: number,
    key: "cantidad" | "descuento" | "iva_tasa",
    rawValue: string,
  ) {
    const numericValue = Number(rawValue);

    if (key === "cantidad") {
      if (!Number.isFinite(numericValue) || numericValue <= 0) {
        onUpdateDetalle(rowIndex, { cantidad: 1 });
      }
      return;
    }

    if (!Number.isFinite(numericValue) || numericValue < 0) {
      onUpdateDetalle(rowIndex, { [key]: 0 } as Partial<VentaDetalleForm>);
    }
  }

  function focusNextInRow(
    rowIndex: number,
    field: EditableField,
    direction: 1 | -1,
  ) {
    const currentFieldIndex = EDITABLE_FIELDS.indexOf(field);
    if (currentFieldIndex < 0) return;

    const nextFieldIndex = currentFieldIndex + direction;
    if (nextFieldIndex < 0 || nextFieldIndex >= EDITABLE_FIELDS.length) return;

    focusCell(rowIndex, EDITABLE_FIELDS[nextFieldIndex]);
  }

  function focusSameColumnOtherRow(
    rowIndex: number,
    field: EditableField,
    direction: 1 | -1,
  ) {
    const visiblePosition = posicionVisiblePorIndexOriginal.get(rowIndex);
    if (visiblePosition == null) return;

    const targetVisiblePosition = visiblePosition + direction;
    if (
      targetVisiblePosition < 0 ||
      targetVisiblePosition >= detallesOrdenados.length
    ) {
      return;
    }

    const targetRowIndex =
      detallesOrdenados[targetVisiblePosition]?.indexOriginal;
    if (targetRowIndex == null) return;

    focusCell(targetRowIndex, field);
  }

  function handleEditableKeyDown(
    rowIndex: number,
    field: EditableField,
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusNextInRow(rowIndex, field, 1);
      return;
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusNextInRow(rowIndex, field, -1);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusSameColumnOtherRow(rowIndex, field, 1);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      focusSameColumnOtherRow(rowIndex, field, -1);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      focusNextInRow(rowIndex, field, 1);
    }
  }

  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      if (e.key !== "F2") return;
      if (readOnly) return;

      setPaginaModal(1);
      setModalBuscador({ open: true });

      window.setTimeout(() => {
        modalSearchInputRef.current?.focus();
      }, 50);
    }

    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, [readOnly, setModalBuscador, setPaginaModal, modalSearchInputRef]);

  useEffect(() => {
    const prevLength = prevDetallesLengthRef.current;

    if (detalles.length > prevLength) {
      const lastAddedIndex = detalles.length - 1;

      window.setTimeout(() => {
        focusCell(lastAddedIndex, "cantidad");
      }, 50);
    }

    prevDetallesLengthRef.current = detalles.length;
  }, [detalles]);

  return {
    setCellRef,
    normalizeNumericBlur,
    handleEditableKeyDown,
  };
}