// src/modules/traspasos/pages/traspasos/form/traspasosForm.utils.ts

import type {
  FormState,
  ProductoOption,
  TraspasosFormModo,
  UbicacionOption,
} from "./traspasosForm.types";
import type { TraspasoDetalle } from "../../../types/traspasos.types";

export function extractArray(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data.filter(
      (x): x is Record<string, unknown> => !!x && typeof x === "object",
    );
  }

  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: unknown[] }).items)
  ) {
    return (data as { items: unknown[] }).items.filter(
      (x): x is Record<string, unknown> => !!x && typeof x === "object",
    );
  }

  return [];
}

export function mapUbicacionOption(
  raw: Record<string, unknown>,
): UbicacionOption {
  const id = Number(raw.id_ubicacion ?? raw.id ?? 0);
  const nombre = String(
    raw.nombre ?? raw.nombre_ubicacion ?? `Ubicación #${id}`,
  );
  const codigo = String(raw.codigo ?? "");
  const tipo = String(raw.tipo ?? raw.tipo_ubicacion ?? "");
  const sucursal = String(
    raw.sucursal_nombre ?? raw.nombre_sucursal ?? raw.sucursal ?? "",
  );

  const parts = [nombre];
  if (codigo) parts.push(codigo);
  if (tipo) parts.push(tipo);
  if (sucursal) parts.push(sucursal);

  return {
    id,
    label: parts.join(" · "),
  };
}

export function mapProductoOption(raw: Record<string, unknown>): ProductoOption {
  const id = Number(raw.id_producto ?? raw.id ?? 0);
  const nombre = String(raw.nombre ?? raw.descripcion ?? `Producto #${id}`);
  const sku = String(raw.sku ?? raw.codigo ?? "");
  const marca = String(raw.marca_nombre ?? raw.marca ?? "");
  const modelo = String(raw.modelo ?? "");
  const codigo_barras = String(raw.codigo_barras ?? "");

  const parts = [nombre];
  if (modelo) parts.push(modelo);
  if (codigo_barras) parts.push(codigo_barras);
  if (sku) parts.push(sku);
  if (marca) parts.push(marca);

  return {
    id,
    label: parts.join(" · "),
    nombre,
    modelo,
    codigo_barras,
  };
}

export function buildInitialForm(
  modo: TraspasosFormModo,
  traspaso: TraspasoDetalle | null,
): FormState {
  if (modo === "VER" && traspaso) {
    return {
      id_ubicacion_origen: traspaso.id_ubicacion_origen ?? 0,
      id_ubicacion_destino: traspaso.id_ubicacion_destino ?? 0,
      notas: traspaso.notas ?? "",
      items: (traspaso.items ?? []).map((item) => ({
        id_producto: item.id_producto,
        cantidad: String(item.cantidad),
      })),
    };
  }

  return {
    id_ubicacion_origen: 0,
    id_ubicacion_destino: 0,
    notas: "",
    items: [{ id_producto: 0, cantidad: "1" }],
  };
}