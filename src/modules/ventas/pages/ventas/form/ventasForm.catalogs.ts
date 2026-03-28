// src/modules/ventas/pages/ventas/form/ventasForm.catalogs.ts
// Resolución de catálogos base del formulario de ventas.
// Responsabilidades:
// - Resolver cliente Público General.
// - Resolver usuario actual como vendedor.
// - Preparar el contexto base para una venta nueva.
// - La lógica de aperturas vive aparte en ventasFormAperturas.

import type { VentaClienteOption } from "../../../types";
import type { VentaDefaultsContext } from "./ventasForm.defaults";

export type CurrentVentasUser = {
  id_usuario?: number | null;
  nombre_en_ticket?: string | null;
};

export type VentasFormCatalogServices = {
  obtenerClientePublicoGeneral?: () => Promise<VentaClienteOption | null>;

  buscarClientes?: (params: {
    q: string;
    solo_activos?: boolean;
    limit?: number;
    offset?: number;
  }) => Promise<VentaClienteOption[]>;
};

function normalizeText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// Busca el cliente Público General dentro del catálogo disponible.
export async function resolveClientePublicoGeneral(
  services: VentasFormCatalogServices,
): Promise<{
  idClientePublicoGeneral: number | null;
  nombreClientePublicoGeneral: string;
  idTipoClientePublicoGeneral: number | null;
  tipoClientePublicoGeneralLabel: string | null;
}> {
  if (services.obtenerClientePublicoGeneral) {
    try {
      const publicoGeneral = await services.obtenerClientePublicoGeneral();

      return {
        idClientePublicoGeneral: publicoGeneral?.id_cliente ?? null,
        nombreClientePublicoGeneral:
          publicoGeneral?.cliente_label ?? "Público General",
        idTipoClientePublicoGeneral:
          publicoGeneral?.id_tipo_cliente ?? null,
        tipoClientePublicoGeneralLabel:
          publicoGeneral?.tipo_cliente_label ?? null,
      };
    } catch {
      // Si falla, intenta abajo con la búsqueda manual.
    }
  }

  if (!services.buscarClientes) {
    return {
      idClientePublicoGeneral: null,
      nombreClientePublicoGeneral: "Público General",
      idTipoClientePublicoGeneral: null,
      tipoClientePublicoGeneralLabel: null,
    };
  }

  try {
    const clientes = await services.buscarClientes({
      q: "Publico General",
      solo_activos: true,
      limit: 10,
      offset: 0,
    });

    const publicoGeneral =
      clientes.find((c) =>
        normalizeText(c.cliente_label).includes("publico general"),
      ) ?? null;

    return {
      idClientePublicoGeneral: publicoGeneral?.id_cliente ?? null,
      nombreClientePublicoGeneral:
        publicoGeneral?.cliente_label ?? "Público General",
      idTipoClientePublicoGeneral:
        publicoGeneral?.id_tipo_cliente ?? null,
      tipoClientePublicoGeneralLabel:
        publicoGeneral?.tipo_cliente_label ?? null,
    };
  } catch {
    return {
      idClientePublicoGeneral: null,
      nombreClientePublicoGeneral: "Público General",
      idTipoClientePublicoGeneral: null,
      tipoClientePublicoGeneralLabel: null,
    };
  }
}

// Construye el contexto base para inicializar una venta nueva.
// La apertura se resolverá aparte desde ventasFormAperturas.
export async function loadVentasFormCatalogContext(params: {
  services: VentasFormCatalogServices;
  currentUser?: CurrentVentasUser;
}): Promise<VentaDefaultsContext> {
  const { services, currentUser } = params;

  const clientePublicoGeneral = await resolveClientePublicoGeneral(services);

  return {
    idClientePublicoGeneral: clientePublicoGeneral.idClientePublicoGeneral,
    nombreClientePublicoGeneral:
      clientePublicoGeneral.nombreClientePublicoGeneral,
    idTipoClientePublicoGeneral:
      clientePublicoGeneral.idTipoClientePublicoGeneral,
    tipoClientePublicoGeneralLabel:
      clientePublicoGeneral.tipoClientePublicoGeneralLabel,

    idUsuarioLogeado: currentUser?.id_usuario ?? null,
    nombreVendedorTicket: currentUser?.nombre_en_ticket ?? "",

    idAperturaActiva: null,
    aperturaLabel: "",
  };
}