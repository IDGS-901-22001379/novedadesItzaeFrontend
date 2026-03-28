// src/modules/ventas/pages/ventas/form/cobro/cobro.types.ts

import type { VentaDetalleForm, VentaPagoForm } from "../ventasForm.types";

export type FormaPagoOption = {
  id_forma_pago: number;
  forma_pago_label: string;
};

export type VentasCobroModalProps = {
  open: boolean;
  saving?: boolean;

  detalles: VentaDetalleForm[];
  pagos: VentaPagoForm[];

  subtotal: number;
  descuentoTotal: number;
  impuestosTotal: number;
  total: number;
  montoPagado: number;
  cambio: number;

  formasPago?: FormaPagoOption[];

  onClose: () => void;
  onConfirmar: () => void;
  onImprimir: () => void;

  onUpdatePago: (index: number, patch: Partial<VentaPagoForm>) => void;
  onAgregarPago: () => void;
  onEliminarPago: (index: number) => void;
};