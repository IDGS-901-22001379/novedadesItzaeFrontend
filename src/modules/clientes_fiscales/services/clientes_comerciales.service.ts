// src/modules/clientes_fiscales/services/clientes_comerciales.service.ts
import { httpClient } from "../../../services/http/httpClient";

export type ClienteComercialApiItem = {
  id_cliente: number;
  nombre: string;
  apellido_paterno?: string | null;
  apellido_materno?: string | null;
  numero_cliente?: string | number | null;
  estatus?: "ACTIVO" | "INACTIVO";
};

export type ClienteComercialOption = {
  id_cliente: number;
  label: string;
  numero?: string;
  estatus?: string;
};

function toOption(c: ClienteComercialApiItem): ClienteComercialOption {
  const fullName = `${c.nombre ?? ""} ${c.apellido_paterno ?? ""} ${c.apellido_materno ?? ""}`
    .replace(/\s+/g, " ")
    .trim();

  return {
    id_cliente: c.id_cliente,
    label: fullName || `Cliente #${c.id_cliente}`,
    numero: c.numero_cliente != null ? String(c.numero_cliente) : undefined,
    estatus: c.estatus,
  };
}

export const clientesComercialesService = {
  // GET /clientes/buscar?q=ana&limit=50&offset=0  (AJUSTA si tu ruta cambia)
  async buscar(q: string): Promise<ClienteComercialOption[]> {
    const sp = new URLSearchParams();
    sp.set("q", q);
    sp.set("limit", "50");
    sp.set("offset", "0");

    const { data } = await httpClient.get<ClienteComercialApiItem[]>(
      `/clientes/buscar?${sp.toString()}`
    );

    return (Array.isArray(data) ? data : []).map(toOption);
  },

  // Para resolver por id si algún día lo ocupas:
  async listar(): Promise<ClienteComercialOption[]> {
    // si no existe endpoint listar, simplemente devuelve []
    return [];
  },


  // GET /clientes/{id_cliente}
async obtener(id_cliente: number): Promise<ClienteComercialOption | null> {
  const { data } = await httpClient.get<ClienteComercialApiItem>(`/clientes/${id_cliente}`);
  return data ? toOption(data) : null;
},
};