// src/modules/devoluciones_cancelaciones/pages/devoluciones_cancelaciones/Devoluciones_cancelacionesForm.tsx
// Formulario principal del módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Coordinar hooks, validaciones y submit.
// - Mantener el archivo principal como punto de entrada del formulario.
// - Delegar UI y lógica secundaria a archivos del submódulo form.

import { useMemo, useState } from "react";
import type {
  DevolucionCreate,
  DevolucionDetail,
} from "../../types/devoluciones_cancelaciones.types";
import { devolucionesCancelacionesService } from "../../services/devoluciones_cancelaciones.service";
import { getCurrentUserId } from "../../services/authSession.service";

import type {
  DevolucionesFormProps,
  FormState,
} from "./form/devolucionesForm.types";
import { buildInitialForm, toNumber } from "./form/devolucionesForm.helpers";
import {
  validarCrear,
  validarEditar,
} from "./form/devolucionesForm.validation";
import { useDevolucionesFormCatalogos } from "./form/useDevolucionesFormCatalogos";
import { useDevolucionesFormBusquedas } from "./form/useDevolucionesFormBusquedas";
import DevolucionesFormFields from "./form/DevolucionesFormFields";
import DevolucionesFormDetalle from "./form/DevolucionesFormDetalle";
import DevolucionesFormReadonly from "./form/DevolucionesFormReadonly";

export type Devoluciones_cancelacionesFormModo = "CREAR" | "EDITAR" | "VER";

export default function Devoluciones_cancelacionesForm({
  modo,
  initialDevolucion,
  onSuccess,
  onCancel,
}: DevolucionesFormProps) {
  const readOnly = modo === "VER";
  const isCrear = modo === "CREAR";
  const isEditar = modo === "EDITAR";

  const [form, setForm] = useState<FormState>(() =>
    buildInitialForm(modo, initialDevolucion),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");

  const subtitulo = useMemo(() => {
    if (modo === "CREAR") return "Registrar devolución";
    if (modo === "EDITAR") {
      return `Editar devolución de venta #${initialDevolucion?.id_venta ?? ""}`;
    }
    return `Visualizar devolución de venta #${initialDevolucion?.id_venta ?? ""}`;
  }, [modo, initialDevolucion]);

  const catalogos = useDevolucionesFormCatalogos({
    form,
    setForm,
    setMsgError,
  });

  const busquedas = useDevolucionesFormBusquedas({
    form,
    setMsgError,
  });

  const formaPagoSeleccionada = useMemo(() => {
    const id = Number(form.id_forma_pago_reembolso);
    return id
      ? (catalogos.formasPagoOptions.find((x) => x.id_forma_pago === id) ??
          null)
      : null;
  }, [form.id_forma_pago_reembolso, catalogos.formasPagoOptions]);

  const ubicacionSeleccionada = useMemo(() => {
    const id = Number(form.id_ubicacion_destino);
    return id
      ? (catalogos.ubicacionesOptions.find((x) => x.id_ubicacion === id) ??
          null)
      : null;
  }, [form.id_ubicacion_destino, catalogos.ubicacionesOptions]);

  async function guardar() {
    const err = isCrear
      ? validarCrear(form)
      : validarEditar(form, initialDevolucion as DevolucionDetail | null);

    if (err) {
      setMsgError(err);
      return;
    }

    try {
      setSaving(true);
      setMsgError("");

      if (isCrear) {
        const currentUserId = getCurrentUserId();

        if (!currentUserId) {
          setMsgError("No se encontró el usuario de la sesión actual.");
          return;
        }

        const payload: DevolucionCreate = {
          id_venta: toNumber(form.id_venta),
          tipo: form.tipo,
          motivo: form.motivo.trim(),
          id_forma_pago_reembolso: toNumber(form.id_forma_pago_reembolso),
          genera_nota_credito_interna: form.genera_nota_credito_interna,
          disposicion: form.disposicion,
          id_ubicacion_destino: toNumber(form.id_ubicacion_destino),
          importe_devuelto: toNumber(form.importe_devuelto),
          id_usuario: currentUserId,
          detalles: [
            {
              id_producto: toNumber(form.detalle.id_producto),
              cantidad_devuelta: toNumber(form.detalle.cantidad_devuelta),
              precio_unitario: toNumber(form.detalle.precio_unitario),
              importe: toNumber(form.detalle.importe),
            },
          ],
        };

        await devolucionesCancelacionesService.crear(payload);
        onSuccess();
        return;
      }

      if (!initialDevolucion) {
        setMsgError("No se encontró la devolución a editar.");
        return;
      }

      await devolucionesCancelacionesService.actualizarMotivo(
        initialDevolucion.id_devolucion,
        {
          motivo: form.motivo.trim(),
        },
      );

      onSuccess();
    } catch (e: unknown) {
      setMsgError(
        e instanceof Error ? e.message : "Ocurrió un error al guardar.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

      {msgError ? (
        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {msgError}
        </div>
      ) : null}

      <DevolucionesFormFields
        form={form}
        setForm={setForm}
        readOnly={readOnly}
        isEditar={isEditar}
        ventaQuery={busquedas.ventaQuery}
        setVentaQuery={busquedas.setVentaQuery}
        ventasLoading={busquedas.ventasLoading}
        ventasOptions={busquedas.ventasOptions}
        ventaSeleccionada={busquedas.ventaSeleccionada}
        setVentaSeleccionada={busquedas.setVentaSeleccionada}
        ventaOpen={busquedas.ventaOpen}
        setVentaOpen={busquedas.setVentaOpen}
        ventaActiveIndex={busquedas.ventaActiveIndex}
        setVentaActiveIndex={busquedas.setVentaActiveIndex}
        formasPagoLoading={catalogos.formasPagoLoading}
        formasPagoOptions={catalogos.formasPagoOptions}
        ubicacionesLoading={catalogos.ubicacionesLoading}
        ubicacionesOptions={catalogos.ubicacionesOptions}
      />

      {isCrear ? (
        <DevolucionesFormDetalle
          form={form}
          setForm={setForm}
          productoQuery={busquedas.productoQuery}
          setProductoQuery={busquedas.setProductoQuery}
          productosLoading={busquedas.productosLoading}
          productosOptions={busquedas.productosOptions}
          productoSeleccionado={busquedas.productoSeleccionado}
          setProductoSeleccionado={busquedas.setProductoSeleccionado}
          productoOpen={busquedas.productoOpen}
          setProductoOpen={busquedas.setProductoOpen}
          productoActiveIndex={busquedas.productoActiveIndex}
          setProductoActiveIndex={busquedas.setProductoActiveIndex}
        />
      ) : null}

      {modo !== "VER" ? (
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void guardar()}
            disabled={saving}
            className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] shadow-sm transition hover:bg-[#2fe72f] disabled:opacity-50"
          >
            {saving ? "Guardando..." : isCrear ? "Crear" : "Actualizar motivo"}
          </button>
        </div>
      ) : null}

      {modo === "VER" && initialDevolucion ? (
        <DevolucionesFormReadonly
          initialDevolucion={initialDevolucion}
          ventaSeleccionada={busquedas.ventaSeleccionada}
          formaPagoSeleccionada={formaPagoSeleccionada}
          ubicacionSeleccionada={ubicacionSeleccionada}
        />
      ) : null}
    </div>
  );
}
