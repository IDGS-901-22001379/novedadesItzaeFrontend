// src/modules/ventas/types/ventas.options.types.ts
// Tipos auxiliares/opciones del módulo Ventas.
// Responsabilidades:
// - Definir opciones de clientes, productos, pagos, CFDI y aperturas.
// - Servir de base para autocompletes, selects y defaults del formulario.

export interface VentaClienteOption {
  id_cliente: number;
  cliente_label: string;
  telefono?: string | null;
  email?: string | null;

  // Para reglas de precio según tipo de cliente.
  id_tipo_cliente?: number | null;
  tipo_cliente_label?: string | null;
  numero_cliente?: string | null;
}

export interface VentaClienteFiscalOption {
  id_cliente_fiscal: number;
  cliente_fiscal_label: string;
  rfc?: string | null;
  razon_social?: string | null;
}

export interface VentaProductoOption {
  id_producto: number;

  // Texto principal y texto listo para mostrar en autocompletes/listas.
  nombre: string;
  producto_label: string;
  label: string;

  // Datos auxiliares visibles en la búsqueda.
  sku?: string | null;
  codigo_barras?: string | null;
  modelo?: string | null;

  // Precios usados para resolver el precio final según el tipo de cliente.
  // precio_venta funciona como precio público general.
  precio_venta?: number | null;
  precio_mayoreo?: number | null;
  precio_especial?: number | null;
  precio_descuento?: number | null;
  precio_caja?: number | null;

  // Configuración de empaque / presentación.
  unidades_por_caja?: number | null;
  permite_venta_por_caja?: boolean | null;
}

export interface VentaFormaPagoOption {
  id_forma_pago: number;
  clave?: string | null;
  forma_pago_label: string;
}

export interface VentaMetodoPagoCfdiOption {
  id_metodo_pago_cfdi: number;
  clave?: string | null;
  metodo_cfdi_label: string;
}

export interface VentaVendedorOption {
  id_usuario: number;
  vendedor_label: string;
  nombre_en_ticket?: string | null;
}

export interface VentaAperturaOption {
  id_apertura: number;
  apertura_label: string;
  id_usuario?: number | null;
  nombre_usuario?: string | null;
  fecha_apertura?: string | null;
}