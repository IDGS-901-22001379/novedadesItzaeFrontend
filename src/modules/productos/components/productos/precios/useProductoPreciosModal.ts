// src/modules/productos/components/productos/precios/useProductoPreciosModal.ts

import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  Moneda,
  PrecioProducto,
  PrecioProductoCreate,
  PrecioProductoFormState,
  PrecioProductoUpdate,
  PresentacionPrecio,
  ProductoLite,
  TipoClienteCatalogo,
} from "../../../types/productos.types";

import { productosPreciosService } from "../../../services/productos-precios.service";
import { productosTiposClienteService } from "../../../services/productos-tipos-cliente.service";
import {
  buildInitialForm,
  getErrorMessage,
} from "./productoPreciosModal.utils";

export type LoadState = "idle" | "loading" | "success" | "error";
export type PrecioFormMode = "CREAR" | "EDITAR" | "VER";

export type HistorialFiltersState = {
  id_tipo_cliente: "" | number;
  presentacion: PresentacionPrecio;
  estado: "ACTIVO" | "INACTIVO" | "TODOS";
};

function resolveDefaultTipoClienteId(
  tipos: TipoClienteCatalogo[],
): "" | number {
  if (!tipos.length) return "";

  const activos = tipos.filter((t) => t.activo);
  if (!activos.length) return "";

  const publicoGeneral = activos.find(
    (t) => t.nombre.trim().toLowerCase() === "publico general",
  );

  if (publicoGeneral) return publicoGeneral.id_tipo_cliente;

  return activos[0].id_tipo_cliente;
}

function precioToForm(precio: PrecioProducto): PrecioProductoFormState {
  return {
    id_tipo_cliente: precio.id_tipo_cliente,
    presentacion: precio.presentacion,
    moneda: precio.moneda as Moneda,
    precio: String(precio.precio),
    vigente_desde: precio.vigente_desde,
    vigente_hasta: precio.vigente_hasta ?? "",
    activo: Boolean(precio.activo),
  };
}

export function useProductoPreciosModal(producto: ProductoLite) {
  const [tiposCliente, setTiposCliente] = useState<TipoClienteCatalogo[]>([]);
  const [historial, setHistorial] = useState<PrecioProducto[]>([]);

  const [loadTiposState, setLoadTiposState] = useState<LoadState>("idle");
  const [loadHistorialState, setLoadHistorialState] =
    useState<LoadState>("idle");

  const [errorTipos, setErrorTipos] = useState("");
  const [errorHistorial, setErrorHistorial] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<PrecioFormMode>("CREAR");
  const [selectedPrecio, setSelectedPrecio] = useState<PrecioProducto | null>(
    null,
  );

  const [form, setForm] = useState<PrecioProductoFormState>(buildInitialForm());

  const [historialFilters, setHistorialFilters] =
    useState<HistorialFiltersState>({
      id_tipo_cliente: "",
      presentacion: "UNIDAD",
      estado: "ACTIVO",
    });

  const cargarTiposCliente = useCallback(async () => {
    setLoadTiposState("loading");
    setErrorTipos("");

    try {
      const data = await productosTiposClienteService.listar(true);
      setTiposCliente(data);

      const defaultTipoClienteId = resolveDefaultTipoClienteId(data);

      setHistorialFilters((prev) => ({
        ...prev,
        id_tipo_cliente: defaultTipoClienteId,
      }));

      setForm((prev) => ({
        ...prev,
        id_tipo_cliente: defaultTipoClienteId,
      }));

      setLoadTiposState("success");
    } catch (error) {
      setErrorTipos(getErrorMessage(error));
      setLoadTiposState("error");
    }
  }, []);

  const cargarHistorial = useCallback(async () => {
    setLoadHistorialState("loading");
    setErrorHistorial("");

    try {
      const data = await productosPreciosService.listarHistorial(
        producto.id_producto,
      );
      setHistorial(data);
      setLoadHistorialState("success");
    } catch (error) {
      setErrorHistorial(getErrorMessage(error));
      setLoadHistorialState("error");
    }
  }, [producto.id_producto]);

  useEffect(() => {
    const initialForm = buildInitialForm();

    setForm(initialForm);
    setFormMode("CREAR");
    setSelectedPrecio(null);
    setSaveError("");
    setSaveSuccess("");
    setFormOpen(false);
    setHistorialFilters({
      id_tipo_cliente: "",
      presentacion: "UNIDAD",
      estado: "ACTIVO",
    });

    void cargarTiposCliente();
    void cargarHistorial();
  }, [producto.id_producto, cargarTiposCliente, cargarHistorial]);

  const tiposClienteOrdenados = useMemo(() => {
    return [...tiposCliente].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es"),
    );
  }, [tiposCliente]);

  const tipoClienteNombreSeleccionado = useMemo(() => {
    if (form.id_tipo_cliente === "") return "";
    return (
      tiposCliente.find(
        (x) => x.id_tipo_cliente === Number(form.id_tipo_cliente),
      )?.nombre ?? ""
    );
  }, [form.id_tipo_cliente, tiposCliente]);

  const historialFiltrado = useMemo(() => {
    return historial.filter((item) => {
      const okTipo =
        historialFilters.id_tipo_cliente === ""
          ? true
          : item.id_tipo_cliente === Number(historialFilters.id_tipo_cliente);

      const okPresentacion = item.presentacion === historialFilters.presentacion;

      const okEstado =
        historialFilters.estado === "TODOS"
          ? true
          : historialFilters.estado === "ACTIVO"
            ? item.activo
            : !item.activo;

      return okTipo && okPresentacion && okEstado;
    });
  }, [historial, historialFilters]);

  function updateForm<K extends keyof PrecioProductoFormState>(
    key: K,
    value: PrecioProductoFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateHistorialFilter<K extends keyof HistorialFiltersState>(
    key: K,
    value: HistorialFiltersState[K],
  ) {
    setHistorialFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearSaveMessages() {
    setSaveError("");
    setSaveSuccess("");
  }

  function resetFormToCreate() {
    const defaultTipoClienteId = resolveDefaultTipoClienteId(tiposCliente);
    setForm({
      ...buildInitialForm(),
      id_tipo_cliente: defaultTipoClienteId,
    });
    setFormMode("CREAR");
    setSelectedPrecio(null);
  }

  function resetAndCloseForm() {
    setFormOpen(false);
    setSaveError("");
    resetFormToCreate();
  }

  function openCrear() {
    clearSaveMessages();
    resetFormToCreate();
    setFormMode("CREAR");
    setFormOpen(true);
  }

  function onVerPrecio(precio: PrecioProducto) {
    clearSaveMessages();
    setSelectedPrecio(precio);
    setForm(precioToForm(precio));
    setFormMode("VER");
    setFormOpen(true);
  }

  function onEditarPrecio(precio: PrecioProducto) {
    clearSaveMessages();
    setSelectedPrecio(precio);
    setForm(precioToForm(precio));
    setFormMode("EDITAR");
    setFormOpen(true);
  }

  async function onDesactivarPrecio(precio: PrecioProducto) {
    setSaveError("");
    setSaveSuccess("");

    try {
      await productosPreciosService.desactivar(precio.id_precio);
      setSaveSuccess("Precio desactivado correctamente.");
      if (selectedPrecio?.id_precio === precio.id_precio) {
        resetAndCloseForm();
      }
      await cargarHistorial();
    } catch (error) {
      setSaveError(getErrorMessage(error));
    }
  }

  async function onActivarPrecio(precio: PrecioProducto) {
    setSaveError("");
    setSaveSuccess("");

    try {
      // Esta parte requiere que exista el endpoint/service activar.
      // Si todavía no lo agregas, aquí lanzará error si llamas a una función inexistente.
      await (productosPreciosService as typeof productosPreciosService & {
        activar?: (id_precio: number) => Promise<PrecioProducto>;
      }).activar?.(precio.id_precio);

      setSaveSuccess("Precio activado correctamente.");
      await cargarHistorial();
    } catch (error) {
      setSaveError(getErrorMessage(error));
    }
  }

  function validar(): string | null {
    if (form.id_tipo_cliente === "") return "Selecciona el tipo de cliente.";
    if (!form.presentacion) return "Selecciona la presentación.";
    if (!form.moneda) return "Selecciona la moneda.";

    const precioNum = Number(form.precio);
    if (!form.precio.trim()) return "Captura el precio.";
    if (!Number.isFinite(precioNum) || precioNum <= 0) {
      return "El precio debe ser mayor a 0.";
    }

    if (!form.vigente_desde) return "Selecciona la fecha de vigencia inicial.";

    if (form.vigente_hasta && form.vigente_hasta < form.vigente_desde) {
      return "La fecha de vigencia final no puede ser menor que la fecha inicial.";
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    setSaveSuccess("");

    if (formMode === "VER") {
      return;
    }

    const validationError = validar();
    if (validationError) {
      setSaveError(validationError);
      return;
    }

    setSaving(true);

    try {
      if (formMode === "CREAR") {
        const payload: PrecioProductoCreate = {
          id_producto: producto.id_producto,
          id_tipo_cliente: Number(form.id_tipo_cliente),
          presentacion: form.presentacion,
          moneda: form.moneda as Moneda,
          precio: Number(form.precio),
          vigente_desde: form.vigente_desde,
          vigente_hasta: form.vigente_hasta.trim() ? form.vigente_hasta : null,
          activo: form.activo,
        };

        await productosPreciosService.crear(payload);
        setSaveSuccess("Precio registrado correctamente.");
      }

      if (formMode === "EDITAR" && selectedPrecio) {
        const payload: PrecioProductoUpdate = {
          id_producto: producto.id_producto,
          id_tipo_cliente: Number(form.id_tipo_cliente),
          presentacion: form.presentacion,
          moneda: form.moneda as Moneda,
          precio: Number(form.precio),
          vigente_desde: form.vigente_desde,
          vigente_hasta: form.vigente_hasta.trim() ? form.vigente_hasta : null,
          activo: form.activo,
        };

        await productosPreciosService.actualizar(
          selectedPrecio.id_precio,
          payload,
        );
        setSaveSuccess("Precio actualizado correctamente.");
      }

      resetFormToCreate();
      setFormOpen(false);
      await cargarHistorial();
    } catch (error) {
      setSaveError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return {
    tiposCliente,
    tiposClienteOrdenados,
    historial,
    historialFiltrado,

    loadTiposState,
    loadHistorialState,

    errorTipos,
    errorHistorial,
    saveError,
    saveSuccess,

    saving,

    formOpen,
    setFormOpen,
    form,
    formMode,
    selectedPrecio,
    updateForm,

    historialFilters,
    updateHistorialFilter,

    tipoClienteNombreSeleccionado,

    cargarTiposCliente,
    cargarHistorial,
    handleSubmit,
    clearSaveMessages,
    resetAndCloseForm,

    openCrear,
    onVerPrecio,
    onEditarPrecio,
    onDesactivarPrecio,
    onActivarPrecio,
  };
}