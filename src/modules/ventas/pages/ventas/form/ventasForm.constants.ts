// src/modules/ventas/pages/ventas/form/ventasForm.constants.ts
// Constantes del formulario de ventas.
// Responsabilidades:
// - Centralizar los valores por defecto del negocio.
// - Evitar repetir textos y configuraciones base en varios archivos.

export const VENTA_DEFAULTS = {
  clientePublicoGeneralLabel: "Público General",

  fuenteHora: "SERVIDOR" as const,

  timezonePosValue: "America/Mexico_City",
  timezonePosLabel: "Ciudad de México",

  offsetMinutosPos: 0,
};

export const VENTA_FACTURA_DEFAULTS = {
  marcadaParaFacturar: false,
  mostrarDatosFactura: false,
};

export const VENTA_UI_TEXTS = {
  tituloCrear: "Nueva venta",
  subtituloCrear: "Registrar venta",
  tituloVer: "Detalle de venta",
  subtituloVer: "Visualizar venta",

  cliente: "Cliente",
  vendedor: "Vendedor",
  apertura: "Apertura",
  fecha: "Fecha",
  fuenteHora: "Fuente de hora",
  zonaHoraria: "Zona horaria",

  facturar: "Facturar esta venta",
  clienteFiscal: "Cliente fiscal",
  formaPagoPrincipal: "Forma de pago principal",
  metodoCfdi: "Método CFDI",

  detalles: "Detalles",
  pagos: "Pagos",
  resumen: "Resumen",
  informacionVenta: "Información de la venta",

  registrarVenta: "Registrar venta",
};