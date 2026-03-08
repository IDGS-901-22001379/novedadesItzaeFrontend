import type { Producto, ProductoEstatus } from "../../../types/productos.types";

export type ProductosFormModo = "CREAR" | "EDITAR" | "VER";

export type ProductosFormProps = {
  modo: ProductosFormModo;
  initialProducto: Producto | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export type ProductosFormState = {
  sku: string;
  codigo_barras: string;

  nombre: string;
  modelo: string;
  descripcion: string;

  // Imagen (solo link)
  imagen_ruta: string;
  imagen_mime: string;

  // Catálogos
  id_producto_tipo: number;
  id_categoria: number;
  id_marca: number;

  // Estatus
  estatus: ProductoEstatus;

  // Unidades
  id_unidad_medida_principal: number;

  // Caja
  permite_venta_por_caja: boolean;
  unidades_por_caja: string;
  id_unidad_medida_caja: number;

  // Inventario
  stock_minimo_tienda: string;
  notas_internas: string;

  // Facturación
  facturable: boolean;
  clave_prod_serv_sat: string;
  clave_unidad_sat: string;
  unidad_cfdi: string;
  iva_tasa: string;
};

export function buildInitialForm(
  modo: ProductosFormModo,
  p: Producto | null,
): ProductosFormState {
  if ((modo === "EDITAR" || modo === "VER") && p) {
    return {
      sku: p.sku ?? "",
      codigo_barras: p.codigo_barras ?? "",

      nombre: p.nombre ?? "",
      modelo: p.modelo ?? "",
      descripcion: p.descripcion ?? "",

      imagen_ruta: p.imagen_ruta ?? "",
      imagen_mime: p.imagen_mime ?? "",

      id_producto_tipo: p.id_producto_tipo ?? 0,
      id_categoria: p.id_categoria ?? 0,
      id_marca: p.id_marca ?? 0,

      estatus: p.estatus ?? "ACTIVO",

      id_unidad_medida_principal: p.id_unidad_medida_principal ?? 0,

      permite_venta_por_caja: Boolean(p.permite_venta_por_caja),
      unidades_por_caja: p.unidades_por_caja ? String(p.unidades_por_caja) : "",
      id_unidad_medida_caja: p.id_unidad_medida_caja ?? 0,

      stock_minimo_tienda:
        p.stock_minimo_tienda !== undefined && p.stock_minimo_tienda !== null
          ? String(p.stock_minimo_tienda)
          : "0",
      notas_internas: p.notas_internas ?? "",

      facturable: Boolean(p.facturable),
      clave_prod_serv_sat: p.clave_prod_serv_sat ?? "",
      clave_unidad_sat: p.clave_unidad_sat ?? "",
      unidad_cfdi: p.unidad_cfdi ?? "",
      iva_tasa:
        p.iva_tasa !== undefined && p.iva_tasa !== null ? String(p.iva_tasa) : "16",
    };
  }

  return {
    sku: "",
    codigo_barras: "",

    nombre: "",
    modelo: "",
    descripcion: "",

    imagen_ruta: "",
    imagen_mime: "",

    id_producto_tipo: 0,
    id_categoria: 0,
    id_marca: 0,

    estatus: "ACTIVO",

    id_unidad_medida_principal: 0,

    permite_venta_por_caja: false,
    unidades_por_caja: "",
    id_unidad_medida_caja: 0,

    stock_minimo_tienda: "0",
    notas_internas: "",

    facturable: false,
    clave_prod_serv_sat: "",
    clave_unidad_sat: "",
    unidad_cfdi: "",
    iva_tasa: "16",
  };
}