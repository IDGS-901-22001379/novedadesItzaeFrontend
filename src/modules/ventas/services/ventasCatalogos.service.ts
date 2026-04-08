// src/modules/ventas/services/ventasCatalogos.service.ts

import { httpClient } from "../../../services/http/httpClient";
import type {
  VentaFormaPagoOption,
  VentaMetodoPagoCfdiOption,
} from "../types";

export const ventasCatalogosService = {
  // Ajusta la ruta exacta según tu backend
  async listarFormasPago(): Promise<VentaFormaPagoOption[]> {
    const { data } = await httpClient.get<
      Array<{
        id_forma_pago: number;
        clave?: string | null;
        nombre: string;
      }>
    >(`/catalogos/formas-pago`);

    return (Array.isArray(data) ? data : []).map((item) => {
      const nombre = item.nombre?.trim() || "";
      const clave = item.clave?.trim() || null;
      const label = clave ? `${clave} - ${nombre}` : nombre;

      return {
        id_forma_pago: item.id_forma_pago,
        clave,
        label,
        forma_pago_label: label,
      };
    });
  },

  // Ajusta la ruta exacta según tu backend
  async listarMetodosPagoCfdi(): Promise<VentaMetodoPagoCfdiOption[]> {
    const { data } = await httpClient.get<
      Array<{
        id_metodo_pago_cfdi: number;
        clave?: string | null;
        nombre: string;
      }>
    >(`/catalogos/metodos-pago-cfdi`);

    return (Array.isArray(data) ? data : []).map((item) => {
      const nombre = item.nombre?.trim() || "";
      const clave = item.clave?.trim() || null;
      const label = clave ? `${clave} - ${nombre}` : nombre;

      return {
        id_metodo_pago_cfdi: item.id_metodo_pago_cfdi,
        clave,
        label,
        metodo_cfdi_label: label,
      };
    });
  },
};