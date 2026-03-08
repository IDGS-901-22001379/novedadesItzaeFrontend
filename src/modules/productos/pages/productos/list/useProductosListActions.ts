// src/modules/productos/pages/productos/list/useProductosListActions.ts
// Acciones del listado de Productos.
// Responsabilidades:
// - Manejar estado de modales (Nuevo/Editar/Ver/Precios).
// - Cargar detalle del producto para Editar/Ver.
// - Abrir confirmación para Activar/Desactivar.
// - Ejecutar cambio de estatus y recargar listado.
// - Exponer helpers (close*) para que ProductosList quede limpio.
//
// Nota TS:
// - confirmVariant debe ser del tipo ConfirmVariant (union), no string.

import { useCallback, useState } from "react";

import { productosService } from "../../../services/productos.service";
import type { Producto, ProductoLite } from "../../../types/productos.types";
import type { ConfirmVariant } from "../../../components/productos/ConfirmActionModal";

type Args = {
  // Para refrescar listado después de crear/editar/cambiar estatus
  recargar: () => void;
};

export function useProductosListActions({ recargar }: Args) {
  // Producto completo para el form (Editar/Ver)
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  // Modales principales
  const [openNuevo, setOpenNuevo] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [openVer, setOpenVer] = useState(false);

  // Modal precios
  const [openPrecios, setOpenPrecios] = useState(false);
  const [precioTarget, setPrecioTarget] = useState<ProductoLite | null>(null);

  // Confirmación estatus (Activar/Desactivar)
  const [openConfirmEstatus, setOpenConfirmEstatus] = useState(false);
  const [productoEstatusTarget, setProductoEstatusTarget] = useState<ProductoLite | null>(null);
  const [savingEstatus, setSavingEstatus] = useState(false);

  // Abrir modal NUEVO
  const onNuevo = useCallback(() => {
    setSelectedProducto(null);
    setOpenNuevo(true);
  }, []);

  // Abrir modal EDITAR (carga detalle)
  const onEditar = useCallback(async (p: ProductoLite) => {
    try {
      const detalle = await productosService.obtener(p.id_producto);
      setSelectedProducto(detalle);
      setOpenEditar(true);
    } catch (e: unknown) {
      alert(
        e instanceof Error ? e.message : "No se pudo cargar el detalle del producto.",
      );
    }
  }, []);

  // Abrir modal VER (carga detalle)
  const onVer = useCallback(async (p: ProductoLite) => {
    try {
      const detalle = await productosService.obtener(p.id_producto);
      setSelectedProducto(detalle);
      setOpenVer(true);
    } catch (e: unknown) {
      alert(
        e instanceof Error ? e.message : "No se pudo cargar el detalle del producto.",
      );
    }
  }, []);

  // Abrir modal PRECIOS
  const onPrecios = useCallback((p: ProductoLite) => {
    setPrecioTarget(p);
    setOpenPrecios(true);
  }, []);

  // Abrir confirmación de estatus (desde tabla)
  // Nota: el nombre del handler se dejó como "onEliminar" para mantener compatibilidad
  // con la tabla (que ya lo usa para activar/desactivar).
  const onEliminar = useCallback((p: ProductoLite) => {
    setProductoEstatusTarget(p);
    setOpenConfirmEstatus(true);
  }, []);

  // Ejecutar cambio de estatus
  const confirmarCambioEstatus = useCallback(async () => {
    if (!productoEstatusTarget) return;

    try {
      setSavingEstatus(true);

      const nuevoEstatus =
        productoEstatusTarget.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";

      await productosService.cambiarEstatus(productoEstatusTarget.id_producto, {
        estatus: nuevoEstatus,
      });

      // cerrar confirm y refrescar
      setOpenConfirmEstatus(false);
      setProductoEstatusTarget(null);
      recargar();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "No se pudo cambiar el estatus.");
    } finally {
      setSavingEstatus(false);
    }
  }, [productoEstatusTarget, recargar]);

  // Helpers de cierre (para que el List tenga código mínimo)
  const closeNuevo = useCallback(() => setOpenNuevo(false), []);
  const closeEditar = useCallback(() => setOpenEditar(false), []);
  const closeVer = useCallback(() => setOpenVer(false), []);

  const closePrecios = useCallback(() => {
    setOpenPrecios(false);
    setPrecioTarget(null);
  }, []);

  const closeConfirmEstatus = useCallback(() => {
    if (savingEstatus) return;
    setOpenConfirmEstatus(false);
    setProductoEstatusTarget(null);
  }, [savingEstatus]);

  // Derivados para ConfirmActionModal
  const estatusNuevo =
    productoEstatusTarget?.estatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";

  const confirmVariant: ConfirmVariant =
    estatusNuevo === "INACTIVO" ? "danger" : "success";

  const confirmText = estatusNuevo === "INACTIVO" ? "Desactivar" : "Activar";

  return {
    // state
    selectedProducto,

    openNuevo,
    openEditar,
    openVer,

    openPrecios,
    precioTarget,

    openConfirmEstatus,
    productoEstatusTarget,
    savingEstatus,

    // actions
    onNuevo,
    onEditar,
    onVer,
    onPrecios,
    onEliminar,
    confirmarCambioEstatus,

    // closers
    closeNuevo,
    closeEditar,
    closeVer,
    closePrecios,
    closeConfirmEstatus,

    // confirm derived
    estatusNuevo,
    confirmVariant,
    confirmText,
  };
}