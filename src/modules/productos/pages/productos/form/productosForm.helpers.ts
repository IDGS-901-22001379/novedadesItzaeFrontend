// src/modules/productos/pages/productos/form/productosForm.helpers.ts
// Helpers del form de Productos.
// Responsabilidades:
// - Parsear números de inputs (string -> number)
// - Validar reglas del formulario (incluye validación condicional por "facturable")
// - Construir payloads tipados para API (create/update) sin unions

import type { ProductoCreate, ProductoUpdate } from "../../../types/productos.types";
import type { ProductosFormState } from "./productosForm.types";

/* -------------------------------------------------------------------------- */
/* Parsers                                                                    */
/* -------------------------------------------------------------------------- */

export function asIntOr0(v: string): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.trunc(n);
}

export function asFloatOr0(v: string): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return n;
}

/* -------------------------------------------------------------------------- */
/* Validación                                                                 */
/* -------------------------------------------------------------------------- */

export function validarProductoForm(form: ProductosFormState): string {
  // Requeridos base
  if (!form.sku.trim()) return "Te falta registrar el SKU.";
  if (!form.nombre.trim()) return "Te falta registrar el nombre del producto.";

  if (!form.id_producto_tipo || form.id_producto_tipo <= 0)
    return "Te falta seleccionar el tipo de producto.";
  if (!form.id_categoria || form.id_categoria <= 0)
    return "Te falta seleccionar la categoría.";
  if (!form.id_marca || form.id_marca <= 0) return "Te falta seleccionar la marca.";

  if (!form.id_unidad_medida_principal || form.id_unidad_medida_principal <= 0)
    return "Te falta seleccionar la unidad principal.";

  // Caja (solo si permite)
  if (form.permite_venta_por_caja) {
    const upc = asIntOr0(form.unidades_por_caja);
    if (upc <= 0) return "Te falta registrar las unidades por caja.";
    if (!form.id_unidad_medida_caja || form.id_unidad_medida_caja <= 0)
      return "Te falta seleccionar la unidad de medida de caja.";
  }

  // Inventario mínimo (permitimos 0)
  if (form.stock_minimo_tienda.trim() === "")
    return "Te falta registrar el stock mínimo (puede ser 0).";
  if (asIntOr0(form.stock_minimo_tienda) < 0)
    return "El stock mínimo no puede ser negativo.";

  // Facturación (solo si facturable)
  if (form.facturable) {
    if (!form.clave_prod_serv_sat.trim())
      return "Te falta registrar la clave SAT (Prod/Serv).";
    if (!form.clave_unidad_sat.trim())
      return "Te falta registrar la clave SAT (Unidad).";
    if (!form.unidad_cfdi.trim()) return "Te falta registrar la unidad CFDI.";
    if (form.iva_tasa.trim() === "") return "Te falta registrar la tasa de IVA.";

    const iva = asFloatOr0(form.iva_tasa);
    if (iva < 0 || iva > 100) return "La tasa de IVA debe estar entre 0 y 100.";
  }

  return "";
}

/* -------------------------------------------------------------------------- */
/* Payload builders                                                           */
/* -------------------------------------------------------------------------- */

// Payload común (base) para create/update.
// Nota: aquí normalizamos strings vacíos a null para que el backend lo maneje mejor.
export function buildPayloadCommon(form: ProductosFormState) {
  return {
    sku: form.sku.trim(),
    codigo_barras: form.codigo_barras.trim() ? form.codigo_barras.trim() : null,

    nombre: form.nombre.trim(),
    modelo: form.modelo.trim() ? form.modelo.trim() : null,
    descripcion: form.descripcion.trim() ? form.descripcion.trim() : null,

    imagen_ruta: form.imagen_ruta.trim() ? form.imagen_ruta.trim() : null,
    imagen_mime: form.imagen_mime.trim() ? form.imagen_mime.trim() : null,

    id_producto_tipo: form.id_producto_tipo,
    id_categoria: form.id_categoria,
    id_marca: form.id_marca,

    estatus: form.estatus,

    id_unidad_medida_principal: form.id_unidad_medida_principal,

    permite_venta_por_caja: form.permite_venta_por_caja,
    unidades_por_caja: form.permite_venta_por_caja
      ? asIntOr0(form.unidades_por_caja)
      : null,
    id_unidad_medida_caja: form.permite_venta_por_caja
      ? form.id_unidad_medida_caja
      : null,

    stock_minimo_tienda: asIntOr0(form.stock_minimo_tienda),

    notas_internas: form.notas_internas.trim() ? form.notas_internas.trim() : null,

    facturable: form.facturable,
    clave_prod_serv_sat: form.facturable ? form.clave_prod_serv_sat.trim() : null,
    clave_unidad_sat: form.facturable ? form.clave_unidad_sat.trim() : null,
    unidad_cfdi: form.facturable ? form.unidad_cfdi.trim() : null,
    iva_tasa: form.facturable ? asFloatOr0(form.iva_tasa) : 0,
  };
}

//  Payload exacto para CREAR
export function buildCreatePayload(form: ProductosFormState): ProductoCreate {
  const common = buildPayloadCommon(form);

  return {
    ...common,
    // En crear mandamos estatus por si acaso
    estatus: common.estatus ?? "ACTIVO",
  };
}

//  Payload exacto para ACTUALIZAR
export function buildUpdatePayload(form: ProductosFormState): ProductoUpdate {
  const common = buildPayloadCommon(form);

  return {
    ...common,
    // En update se manda el estatus tal cual
    estatus: common.estatus,
  };
}