// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/useFacturacionCfdiForm.ts
// Hook del formulario de facturación CFDI.
// Responsabilidades:
// - centralizar estado del formulario
// - cargar sucursales activas para emisión
// - cargar series activas según la sucursal seleccionada
// - validar datos
// - ejecutar acciones de emitir y enviar
// - exponer datos listos para render

import { useEffect, useMemo, useState } from "react";
import type {
  ClienteFiscalBuscarItem,
  FacturaEmitirPayload,
  FacturaEnvioPayload,
  SerieFacturacion,
} from "../../../types/facturacion_cfdi.types";
import { facturacionCfdiService } from "../../../services/facturacion_cfdi.service";
import { facturacionCfdiSeriesService } from "../../../services/facturacion_cfdi_series.service";
import { inventarioSucursalesService } from "../../../../inventario_sucursales/services/inventario_sucursales.service";
import { getApiErrorMessage } from "../../../../../services/http/getApiErrorMessage";
import type {
  FacturacionCfdiFormProps,
  FacturacionCfdiFormState,
  FacturacionCfdiSucursalItem,
} from "./facturacionCfdiForm.types";
import {
  buildInitialForm,
  buildSubtitle,
} from "./facturacionCfdiForm.utils";
import {
  validarEmitir,
  validarEnviar,
} from "./facturacionCfdiForm.validators";

type SucursalRaw = {
  id_sucursal?: number | string | null;
  nombre?: string | null;
  sucursal?: string | null;
  descripcion?: string | null;
};

export function useFacturacionCfdiForm({
  modo,
  initialFactura,
  onSuccess,
}: Pick<FacturacionCfdiFormProps, "modo" | "initialFactura" | "onSuccess">) {
  const [form, setForm] = useState<FacturacionCfdiFormState>(() =>
    buildInitialForm(modo, initialFactura),
  );
  const [saving, setSaving] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [msgInfo, setMsgInfo] = useState("");

  // El cliente fiscal se maneja por autocomplete.
  // Se conserva este arreglo para mantener compatibilidad con el bloque EMITIR.
  const clientesFiscales = useMemo<ClienteFiscalBuscarItem[]>(() => [], []);

  const [sucursales, setSucursales] = useState<FacturacionCfdiSucursalItem[]>(
    [],
  );
  const [series, setSeries] = useState<SerieFacturacion[]>([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);

  useEffect(() => {
    setForm(buildInitialForm(modo, initialFactura));
    setMsgError("");
    setMsgInfo("");
    setSeries([]);
    setSucursales([]);
  }, [modo, initialFactura]);

  // 1) Cargar sucursales activas y dejar seleccionada por defecto la de menor id.
  useEffect(() => {
    if (modo !== "EMITIR") return;

    let mounted = true;

    (async () => {
      try {
        setLoadingCatalogos(true);
        setMsgError("");

        const data = await inventarioSucursalesService.listar({
          solo_activos: true,
        });

        if (!mounted) return;

        const sucursalesActivas: FacturacionCfdiSucursalItem[] = (
          Array.isArray(data) ? (data as SucursalRaw[]) : []
        )
          .map((raw) => ({
            id_sucursal: Number(raw.id_sucursal),
            nombre: String(
              raw.nombre ??
                raw.sucursal ??
                raw.descripcion ??
                `Sucursal #${raw.id_sucursal}`,
            ),
          }))
          .filter(
            (x) =>
              Number.isFinite(x.id_sucursal) &&
              x.id_sucursal > 0 &&
              !!x.nombre,
          )
          .sort((a, b) => a.id_sucursal - b.id_sucursal);

        setSucursales(sucursalesActivas);

        setForm((prev) => {
          if (prev.id_sucursal) return prev;

          const primeraSucursal = sucursalesActivas[0];
          if (!primeraSucursal) return prev;

          return {
            ...prev,
            id_sucursal: String(primeraSucursal.id_sucursal),
          };
        });
      } catch (e: unknown) {
        if (!mounted) return;

        setMsgError(
          getApiErrorMessage(e, "No se pudieron cargar las sucursales activas."),
        );
      } finally {
        if (mounted) setLoadingCatalogos(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [modo]);

  // 2) Cargar series activas cada vez que cambie la sucursal seleccionada.
  useEffect(() => {
    if (modo !== "EMITIR") return;

    if (!form.id_sucursal) {
      setSeries([]);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        setLoadingCatalogos(true);
        setMsgError("");

        const seriesData = await facturacionCfdiSeriesService.listar({
          id_sucursal: Number(form.id_sucursal),
          solo_activas: true,
        });

        if (!mounted) return;

        setSeries(seriesData);

        setForm((prev) => {
          const seriePrincipal =
            seriesData.find((x) => x.es_principal && x.activo) ?? seriesData[0];

          const serieActualValida = seriesData.some(
            (x) => String(x.id_serie) === prev.id_serie,
          );

          if (serieActualValida) return prev;

          return {
            ...prev,
            id_serie: seriePrincipal ? String(seriePrincipal.id_serie) : "",
          };
        });
      } catch (e: unknown) {
        if (!mounted) return;

        setMsgError(
          getApiErrorMessage(
            e,
            "No se pudieron cargar las series de la sucursal.",
          ),
        );
        setSeries([]);
      } finally {
        if (mounted) setLoadingCatalogos(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [modo, form.id_sucursal]);

  const subtitulo = useMemo(
    () => buildSubtitle(modo, initialFactura),
    [modo, initialFactura],
  );

  const clienteFiscalSeleccionado = useMemo(() => {
    return clientesFiscales.find(
      (x) => String(x.id_cliente_fiscal) === form.id_cliente_fiscal,
    );
  }, [clientesFiscales, form.id_cliente_fiscal]);

  const sucursalSeleccionada = useMemo(() => {
    return sucursales.find((x) => String(x.id_sucursal) === form.id_sucursal);
  }, [sucursales, form.id_sucursal]);

  const serieSeleccionada = useMemo(() => {
    return series.find((x) => String(x.id_serie) === form.id_serie);
  }, [series, form.id_serie]);

  async function guardar() {
    if (modo === "VER") return false;

    const err =
      modo === "EMITIR"
        ? validarEmitir(form)
        : validarEnviar(form, initialFactura);

    if (err) {
      setMsgError(err);
      setMsgInfo("");
      return false;
    }

    try {
      setSaving(true);
      setMsgError("");
      setMsgInfo("");

      if (modo === "EMITIR") {
        const payload: FacturaEmitirPayload = {
          id_venta: Number(form.id_venta),
          id_cliente_fiscal: Number(form.id_cliente_fiscal),
          id_serie: Number(form.id_serie),
          id_usuario: 1,
        };

        await facturacionCfdiService.emitir(payload);
        onSuccess();
        return true;
      }

      if (!initialFactura) {
        setMsgError("No se encontró la factura a enviar.");
        return false;
      }

      const payload: FacturaEnvioPayload = {
        id_factura: initialFactura.id_factura,
        correo_destino: form.correo_destino.trim(),
        id_usuario: 1,
      };

      await facturacionCfdiService.enviar(initialFactura.id_factura, payload);
      setMsgInfo("La factura fue enviada correctamente.");
      onSuccess();
      return true;
    } catch (e: unknown) {
      setMsgError(getApiErrorMessage(e, "No se pudo procesar la factura."));
      setMsgInfo("");
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    form,
    setForm,

    saving,
    msgError,
    msgInfo,

    clientesFiscales,
    sucursales,
    series,
    loadingCatalogos,

    subtitulo,
    clienteFiscalSeleccionado,
    sucursalSeleccionada,
    serieSeleccionada,

    setMsgError,
    setMsgInfo,
    guardar,
  };
}