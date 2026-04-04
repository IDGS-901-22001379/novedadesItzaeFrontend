// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/cancelacion/facturacionCfdiCancelarForm.types.ts
// Tipos del formulario de cancelación CFDI.
// Responsabilidades: centralizar props, estado y catálogos del formulario de cancelación.

import type {
  Factura,
  MotivoCancelacionCfdi,
} from "../../../../types/facturacion_cfdi.types";

export type FacturacionCfdiCancelarFormProps = {
  factura: Factura | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export type FacturacionCfdiCancelarFormState = {
  id_factura: string;
  id_motivo_cancelacion_cfdi: string;
  uuid_sustitucion: string;
  id_usuario: string;
};

export type FacturacionCfdiCancelarFormCatalogos = {
  motivosCancelacion: MotivoCancelacionCfdi[];
};