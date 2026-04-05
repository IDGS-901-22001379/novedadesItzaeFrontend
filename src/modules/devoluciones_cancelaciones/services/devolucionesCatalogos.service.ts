// src/modules/devoluciones_cancelaciones/services/devolucionesCatalogos.service.ts
// Service de catálogos auxiliares del módulo Devoluciones/Cancelaciones.
// Responsabilidades:
// - Listar formas de pago para reembolso.
// - Adaptar la respuesta del backend a opciones amigables para UI.
// - Mantener separado el consumo de catálogos propios del módulo.

import { httpClient } from "../../../services/http/httpClient";
import type { DevolucionFormaPagoOption } from "../types/devoluciones_catalogos.types";

type FormaPagoApiItem = {
  id_forma_pago: number;
  clave?: string | null;
  nombre: string;
};

function buildLabel(clave?: string | null, nombre?: string | null): string {
  const claveOk = clave?.trim() ?? "";
  const nombreOk = nombre?.trim() ?? "";

  if (claveOk && nombreOk) return `${claveOk} - ${nombreOk}`;
  if (nombreOk) return nombreOk;
  return claveOk || "";
}

export const devolucionesCatalogosService = {
  // GET /catalogos/formas-pago
  async listarFormasPago(): Promise<DevolucionFormaPagoOption[]> {
    const { data } = await httpClient.get<FormaPagoApiItem[]>(
      `/catalogos/formas-pago`,
    );

    return (Array.isArray(data) ? data : []).map((item) => ({
      id_forma_pago: item.id_forma_pago,
      clave: item.clave ?? null,
      label: buildLabel(item.clave, item.nombre),
    }));
  },
};