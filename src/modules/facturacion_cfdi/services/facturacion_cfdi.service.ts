// src/modules/facturacion_cfdi/services/facturacion_cfdi.service.ts
// Service principal del módulo de facturación CFDI.
// Responsabilidades:
// - consultar facturas
// - consultar detalle de factura
// - emitir facturas
// - timbrar en sandbox
// - cancelar facturas
// - enviar facturas por correo
// - descargar XML y PDF
// - enriquecer facturas con el folio real de venta
// - enriquecer facturas con el folio real de factura
// - enriquecer datos fiscales amigables para impresión/UI

import { httpClient } from "../../../services/http/httpClient";
import { ventasService } from "../../ventas/services/ventas.service";
import { facturacionCfdiClientesFiscalesService } from "./facturacion_cfdi_clientes_fiscales.service";
import type {
  Factura,
  FacturaCancelacionPayload,
  FacturaEnvioPayload,
  FacturaEmitirPayload,
  FacturaQuery,
  FacturaUltimasQuery,
} from "../types/facturacion_cfdi.types";

function buildFacturasQuery(params?: FacturaQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.q) sp.set("q", params.q);
  if (params.estado) sp.set("estado", params.estado);

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  if (params.id_cliente_fiscal !== undefined) {
    sp.set("id_cliente_fiscal", String(params.id_cliente_fiscal));
  }

  if (params.desde) sp.set("desde", params.desde);
  if (params.hasta) sp.set("hasta", params.hasta);

  if (params.limit !== undefined) {
    sp.set("limit", String(params.limit));
  }

  if (params.offset !== undefined) {
    sp.set("offset", String(params.offset));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function buildUltimasQuery(params?: FacturaUltimasQuery): string {
  if (!params) return "";

  const sp = new URLSearchParams();

  if (params.n !== undefined) {
    sp.set("n", String(params.n));
  }

  if (params.id_sucursal !== undefined) {
    sp.set("id_sucursal", String(params.id_sucursal));
  }

  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function asOptionalString(value: unknown): string | undefined {
  return asString(value) ?? undefined;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function buildFacturaFolio(raw: Record<string, unknown>): string | null {
  const directa =
    asString(raw.factura_folio) ||
    asString(raw.folio_factura) ||
    asString(raw.folio_completo) ||
    asString(raw.serie_folio);

  if (directa) return directa;

  const serie = asString(raw.serie) ?? "";
  const folio = asString(raw.folio) ?? "";
  const combinado = `${serie}${folio}`.trim();

  return combinado || null;
}

function getClienteFiscalNombre(raw: Record<string, unknown>): string | null {
  const clienteFiscal = asRecord(raw.cliente_fiscal);
  const receptor = asRecord(raw.receptor);

  return (
    asString(raw.cliente_fiscal_nombre) ||
    asString(raw.razon_social) ||
    asString(raw.nombre_cliente_fiscal) ||
    asString(clienteFiscal.razon_social) ||
    asString(clienteFiscal.nombre) ||
    asString(clienteFiscal.cliente_fiscal_nombre) ||
    asString(receptor.razon_social) ||
    asString(receptor.nombre) ||
    null
  );
}

function getClienteFiscalRfc(raw: Record<string, unknown>): string | null {
  const clienteFiscal = asRecord(raw.cliente_fiscal);
  const receptor = asRecord(raw.receptor);

  return (
    asString(raw.cliente_fiscal_rfc) ||
    asString(raw.rfc) ||
    asString(clienteFiscal.rfc) ||
    asString(receptor.rfc) ||
    null
  );
}

function normalizeFactura(raw: unknown): Factura {
  const r = asRecord(raw);

  return {
    id_factura: asNumber(r.id_factura) ?? 0,
    id_sucursal: asNumber(r.id_sucursal) ?? null,
    id_venta: asNumber(r.id_venta) ?? 0,
    id_cliente_fiscal: asNumber(r.id_cliente_fiscal) ?? 0,
    id_serie: asNumber(r.id_serie) ?? 0,

    serie: asString(r.serie),
    folio: (r.folio as number | string | null | undefined) ?? null,

    factura_folio: buildFacturaFolio(r),
    venta_folio: asString(r.venta_folio),

    cliente_fiscal_nombre: getClienteFiscalNombre(r),
    razon_social:
      asString(r.razon_social) || getClienteFiscalNombre(r) || null,
    cliente_fiscal_rfc: getClienteFiscalRfc(r),

    uuid: asString(r.uuid),

    fecha_emision: asString(r.fecha_emision) ?? "",
    fecha_timbrado: asString(r.fecha_timbrado),

    estado: ((asString(r.estado) ?? "ERROR") as Factura["estado"]),
    intentos_timbrado: asNumber(r.intentos_timbrado) ?? undefined,
    ultimo_error: asString(r.ultimo_error),
    ultimo_intento_en: asString(r.ultimo_intento_en),

    id_motivo_cancelacion_cfdi:
      asNumber(r.id_motivo_cancelacion_cfdi) ?? null,
    descripcion_cancelacion: asString(r.descripcion_cancelacion),
    fecha_cancelacion: asString(r.fecha_cancelacion),
    id_usuario_cancela: asNumber(r.id_usuario_cancela) ?? null,

    id_usuario_genero: asNumber(r.id_usuario_genero) ?? undefined,
    creado_en: asOptionalString(r.creado_en),

    conceptos: Array.isArray(r.conceptos)
      ? (r.conceptos as Factura["conceptos"])
      : [],
  };
}

function normalizeFacturas(raw: unknown): Factura[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeFactura);
}

function getVentaFolioFromVentaResponse(raw: unknown): string | null {
  const root = asRecord(raw);

  const candidatos: unknown[] = [
    root.folio,
    root.venta_folio,
    root.numero_venta,
    root.folio_venta,
    root.codigo,
  ];

  const data = asRecord(root.data);
  candidatos.push(
    data.folio,
    data.venta_folio,
    data.numero_venta,
    data.folio_venta,
    data.codigo,
  );

  const venta = asRecord(root.venta);
  candidatos.push(
    venta.folio,
    venta.venta_folio,
    venta.numero_venta,
    venta.folio_venta,
    venta.codigo,
  );

  const header = asRecord(root.header);
  candidatos.push(
    header.folio,
    header.venta_folio,
    header.numero_venta,
    header.folio_venta,
    header.codigo,
  );

  for (const candidato of candidatos) {
    const value = asString(candidato);
    if (value) return value;
  }

  return null;
}

async function resolverFoliosVenta(facturas: Factura[]): Promise<Factura[]> {
  const idsVenta = Array.from(
    new Set(
      facturas
        .map((factura) => factura.id_venta)
        .filter((idVenta) => Number.isFinite(idVenta) && idVenta > 0),
    ),
  );

  if (idsVenta.length === 0) {
    return facturas;
  }

  const mapaFoliosVenta = new Map<number, string>();

  await Promise.all(
    idsVenta.map(async (idVenta) => {
      try {
        const venta = await ventasService.obtener(idVenta);
        const folioVenta = getVentaFolioFromVentaResponse(venta);

        if (folioVenta) {
          mapaFoliosVenta.set(idVenta, folioVenta);
        }
      } catch {
        // fallback
      }
    }),
  );

  return facturas.map((factura) => ({
    ...factura,
    venta_folio:
      factura.venta_folio ||
      mapaFoliosVenta.get(factura.id_venta) ||
      null,
  }));
}

async function resolverFoliosFactura(facturas: Factura[]): Promise<Factura[]> {
  const idsFactura = Array.from(
    new Set(
      facturas
        .map((factura) => factura.id_factura)
        .filter((idFactura) => Number.isFinite(idFactura) && idFactura > 0),
    ),
  );

  if (idsFactura.length === 0) {
    return facturas;
  }

  const mapaFacturas = new Map<number, Factura>();

  await Promise.all(
    idsFactura.map(async (idFactura) => {
      try {
        const { data } = await httpClient.get<unknown>(`/facturas/${idFactura}`);
        const facturaDetalle = normalizeFactura(data);
        mapaFacturas.set(idFactura, facturaDetalle);
      } catch {
        // fallback
      }
    }),
  );

  return facturas.map((factura) => {
    const detalle = mapaFacturas.get(factura.id_factura);

    return {
      ...factura,
      factura_folio:
        factura.factura_folio ||
        detalle?.factura_folio ||
        `${detalle?.serie ?? ""}${detalle?.folio ?? ""}`.trim() ||
        null,

      cliente_fiscal_nombre:
        factura.cliente_fiscal_nombre ||
        detalle?.cliente_fiscal_nombre ||
        detalle?.razon_social ||
        null,

      razon_social:
        factura.razon_social ||
        detalle?.razon_social ||
        detalle?.cliente_fiscal_nombre ||
        null,

      cliente_fiscal_rfc:
        factura.cliente_fiscal_rfc ||
        detalle?.cliente_fiscal_rfc ||
        null,
    };
  });
}

async function resolverClientesFiscales(
  facturas: Factura[],
): Promise<Factura[]> {
  const idsClienteFiscal = Array.from(
    new Set(
      facturas
        .map((factura) => factura.id_cliente_fiscal)
        .filter((id) => Number.isFinite(id) && id > 0),
    ),
  );

  if (idsClienteFiscal.length === 0) {
    return facturas;
  }

  const mapaClientesFiscales = new Map<
    number,
    { nombre: string | null; rfc: string | null }
  >();

  await Promise.all(
    idsClienteFiscal.map(async (idClienteFiscal) => {
      try {
        const clienteFiscal =
          await facturacionCfdiClientesFiscalesService.obtener(idClienteFiscal);

        mapaClientesFiscales.set(idClienteFiscal, {
          nombre: clienteFiscal.razon_social ?? null,
          rfc: clienteFiscal.rfc ?? null,
        });
      } catch {
        // fallback
      }
    }),
  );

  return facturas.map((factura) => {
    const clienteFiscal = mapaClientesFiscales.get(factura.id_cliente_fiscal);

    return {
      ...factura,
      cliente_fiscal_nombre:
        factura.cliente_fiscal_nombre ||
        factura.razon_social ||
        clienteFiscal?.nombre ||
        null,

      razon_social:
        factura.razon_social ||
        factura.cliente_fiscal_nombre ||
        clienteFiscal?.nombre ||
        null,

      cliente_fiscal_rfc:
        factura.cliente_fiscal_rfc ||
        clienteFiscal?.rfc ||
        null,
    };
  });
}

async function enriquecerFacturas(facturas: Factura[]): Promise<Factura[]> {
  const conVenta = await resolverFoliosVenta(facturas);
  const conFactura = await resolverFoliosFactura(conVenta);
  const conClienteFiscal = await resolverClientesFiscales(conFactura);
  return conClienteFiscal;
}

async function enriquecerFactura(factura: Factura): Promise<Factura> {
  const [facturaEnriquecida] = await enriquecerFacturas([factura]);
  return facturaEnriquecida ?? factura;
}

export const facturacionCfdiService = {
  async listar(params?: FacturaQuery): Promise<Factura[]> {
    const qs = buildFacturasQuery(params);
    const { data } = await httpClient.get<unknown>(`/facturas${qs}`);
    const facturas = normalizeFacturas(data);
    return enriquecerFacturas(facturas);
  },

  async ultimas(params?: FacturaUltimasQuery): Promise<Factura[]> {
    const qs = buildUltimasQuery(params);
    const { data } = await httpClient.get<unknown>(`/facturas/ultimas${qs}`);
    const facturas = normalizeFacturas(data);
    return enriquecerFacturas(facturas);
  },

  async obtener(id_factura: number): Promise<Factura> {
    const { data } = await httpClient.get<unknown>(`/facturas/${id_factura}`);
    const factura = normalizeFactura(data);
    return enriquecerFactura(factura);
  },

  async emitir(payload: FacturaEmitirPayload): Promise<Factura> {
    const { data } = await httpClient.post<unknown>(`/facturas/emitir`, payload);
    const factura = normalizeFactura(data);
    return enriquecerFactura(factura);
  },

  async timbrarSandbox(id_factura: number): Promise<Factura> {
    const { data } = await httpClient.post<unknown>(
      `/facturas/${id_factura}/timbrar-sandbox`,
    );
    const factura = normalizeFactura(data);
    return enriquecerFactura(factura);
  },

  async cancelar(
    id_factura: number,
    payload: FacturaCancelacionPayload,
  ): Promise<Factura> {
    const { data } = await httpClient.post<unknown>(
      `/facturas/${id_factura}/cancelar`,
      payload,
    );
    const factura = normalizeFactura(data);
    return enriquecerFactura(factura);
  },

  async enviar(
    id_factura: number,
    payload: FacturaEnvioPayload,
  ): Promise<Record<string, unknown>> {
    const { data } = await httpClient.post<Record<string, unknown>>(
      `/facturas/${id_factura}/enviar`,
      payload,
    );
    return data;
  },

  async descargarXml(id_factura: number): Promise<Blob> {
    const { data } = await httpClient.get(`/facturas/${id_factura}/xml`, {
      responseType: "blob",
    });
    return data;
  },

  async descargarPdf(id_factura: number): Promise<Blob> {
    const { data } = await httpClient.get(`/facturas/${id_factura}/pdf`, {
      responseType: "blob",
    });
    return data;
  },
};