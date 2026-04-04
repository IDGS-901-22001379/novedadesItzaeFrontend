// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/facturacionCfdiForm.types.ts
// Tipos del formulario de facturación CFDI.
// Responsabilidades: centralizar modos, props y estado del formulario.

import type {
  ClienteFiscalBuscarItem,
  Factura,
  SerieFacturacion,
} from "../../../types/facturacion_cfdi.types";

export type FacturacionCfdiFormModo = "EMITIR" | "ENVIAR" | "VER";

export type FacturacionCfdiFormProps = {
  modo: FacturacionCfdiFormModo;
  initialFactura: Factura | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export type FacturacionCfdiFormState = {
  id_venta: string;
  venta_label: string;

  id_cliente_fiscal: string;
  cliente_fiscal_label: string;

  id_sucursal: string;
  id_serie: string;

  correo_destino: string;
};

export type FacturacionCfdiSucursalItem = {
  id_sucursal: number;
  nombre: string;
};

export type FacturacionCfdiCatalogos = {
  clientesFiscales: ClienteFiscalBuscarItem[];
  sucursales: FacturacionCfdiSucursalItem[];
  series: SerieFacturacion[];
};