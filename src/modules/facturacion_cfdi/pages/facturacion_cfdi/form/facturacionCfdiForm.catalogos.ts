// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/facturacionCfdiForm.catalogos.ts
// Carga de catálogos del formulario de facturación CFDI.
// Responsabilidades: obtener clientes fiscales, series activas y sucursales.

import { facturacionCfdiClientesFiscalesService } from "../../../services/facturacion_cfdi_clientes_fiscales.service";
import { facturacionCfdiSeriesService } from "../../../services/facturacion_cfdi_series.service";
import type { FacturacionCfdiCatalogos } from "./facturacionCfdiForm.types";

export async function cargarCatalogosFacturacionCfdi(): Promise<FacturacionCfdiCatalogos> {
  const [clientesFiscales, series] = await Promise.all([
    facturacionCfdiClientesFiscalesService.buscar({
      q: "a",
      solo_activos: true,
      limit: 100,
      offset: 0,
    }),
    facturacionCfdiSeriesService.listar({
      solo_activas: true,
    }),
  ]);

  return {
    clientesFiscales,
    series,
    sucursales: [],
  };
}