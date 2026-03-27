// src/modules/ventas/pages/ventas/form/useVentasForm/useVentasForm.helpers.ts

import type { VentaClienteOption, VentaFormaPagoOption } from "../../../../types";

export const FORMAS_PAGO_DEFAULT: VentaFormaPagoOption[] = [
  {
    id_forma_pago: 1,
    forma_pago_label: "Efectivo",
    clave: "01",
  },
  {
    id_forma_pago: 2,
    forma_pago_label: "Tarjeta",
    clave: "04",
  },
  {
    id_forma_pago: 3,
    forma_pago_label: "Transferencia",
    clave: "03",
  },
];

export function normalizeText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function isExactClienteMatch(
  cliente: VentaClienteOption,
  query: string,
): boolean {
  const q = normalizeText(query);

  return (
    normalizeText(cliente.cliente_label) === q ||
    normalizeText(cliente.numero_cliente) === q
  );
}