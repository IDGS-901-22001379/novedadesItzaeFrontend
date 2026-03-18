import type { Compra, CompraDetalle } from "../../../types/compras.types";
import type {
  ComprasFormModo,
  DetalleFormRow,
  FormState,
} from "./comprasForm.types";

export const FORMAS_PAGO = [
  { id: 1, label: "Efectivo" },
  { id: 2, label: "Transferencia" },
  { id: 3, label: "Tarjeta" },
  { id: 4, label: "Crédito" },
];

export function makeRow(): DetalleFormRow {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    id_producto: 0,
    producto_label: "",
    cantidad: "",
    costo_unitario: "",
    descuento: 0,
    impuestos: 0,
    importe: 0,
  };
}

export function buildInitialForm(
  modo: ComprasFormModo,
  compra: Compra | null,
): FormState {
  if (modo === "VER" && compra) {
    const esExterno = !compra.id_proveedor && !!compra.proveedor_externo_nombre;

    return {
      id_forma_pago: compra.id_forma_pago ?? 1,
      documento_referencia: compra.documento_referencia ?? "",
      observaciones: compra.observaciones ?? "",
      id_ubicacion_destino: compra.id_ubicacion_destino ?? "",
      id_proveedor: compra.id_proveedor ?? "",
      usarProveedorExterno: esExterno,

      proveedor_externo_nombre: compra.proveedor_externo_nombre ?? "",
      proveedor_externo_contacto: compra.proveedor_externo_contacto ?? "",
      proveedor_externo_telefono: compra.proveedor_externo_telefono ?? "",
      proveedor_externo_descripcion: compra.proveedor_externo_descripcion ?? "",
    };
  }

  return {
    id_forma_pago: 1,
    documento_referencia: "",
    observaciones: "",
    id_ubicacion_destino: "",
    id_proveedor: "",
    usarProveedorExterno: false,

    proveedor_externo_nombre: "",
    proveedor_externo_contacto: "",
    proveedor_externo_telefono: "",
    proveedor_externo_descripcion: "",
  };
}

export function buildInitialDetalles(
  modo: ComprasFormModo,
  detalles: CompraDetalle[],
): DetalleFormRow[] {
  if (modo === "VER" && detalles.length > 0) {
    return detalles.map((d, idx) => ({
      id: `${d.id_producto}-${idx}`,
      id_producto: d.id_producto,
      producto_label: `${d.sku} - ${d.nombre}`,
      cantidad: d.cantidad,
      costo_unitario: d.costo_unitario,
      descuento: d.descuento,
      impuestos: d.impuestos,
      importe: d.importe,
    }));
  }

  return [makeRow()];
}

export function toNumber(value: number | ""): number {
  if (value === "") return 0;
  return Number(value) || 0;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(value || 0);
}