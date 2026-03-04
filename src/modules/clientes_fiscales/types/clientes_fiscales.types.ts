export type EstatusGenerico = "ACTIVO" | "INACTIVO";

export type ClienteFiscalBuscarItem = {
  id_cliente_fiscal: number;
  id_cliente: number;
  rfc: string;
  razon_social: string;
  es_predeterminado: boolean;
  estatus: EstatusGenerico;
};

export type ClienteFiscal = {
  id_cliente_fiscal: number;
  id_cliente: number;

  rfc: string;
  razon_social: string;

  id_regimen_fiscal: number;
  codigo_postal_fiscal: string;

  correo_envio: string;
  id_uso_cfdi: number;

  telefono: string;

  es_predeterminado: boolean;
  estatus: EstatusGenerico;

  creado_en: string;
  actualizado_en: string;
};

export type ClientesFiscalesBuscarQuery = {
  q: string; // requerido
  solo_activos?: boolean;
  limit?: number;
  offset?: number;
};

export type ClienteFiscalCreate = {
  rfc: string;
  razon_social: string;

  id_regimen_fiscal: number;
  codigo_postal_fiscal: string;

  correo_envio: string;
  id_uso_cfdi: number;

  telefono: string;

  id_cliente: number;
  es_predeterminado: boolean;
};

export type ClienteFiscalUpdate = {
  rfc: string;
  razon_social: string;

  id_regimen_fiscal: number;
  codigo_postal_fiscal: string;

  correo_envio: string;
  id_uso_cfdi: number;

  telefono: string;

  es_predeterminado: boolean;
};

export type ClienteFiscalEstatusUpdate = {
  estatus: EstatusGenerico;
};