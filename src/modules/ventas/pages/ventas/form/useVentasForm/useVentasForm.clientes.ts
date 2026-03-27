// src/modules/ventas/pages/ventas/form/useVentasForm/useVentasForm.clientes.ts

import { ventasClientesService } from "../../../../services/ventasClientes.service";
import { isExactClienteMatch } from "./useVentasForm.helpers";
import type { VentaClienteOption } from "../../../../types";
import type { VentaFormState } from "../ventasForm.types";

type SearchParams = {
  readOnly: boolean;
  clienteQuery: string;
  setClienteSearching: (value: boolean) => void;
  setClienteResults: (value: VentaClienteOption[]) => void;
  setClienteQuery: (value: string) => void;
  setForm: React.Dispatch<React.SetStateAction<VentaFormState>>;
};

function normalizeText(value?: string | null): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export async function searchVentasClientes({
  readOnly,
  clienteQuery,
  setClienteSearching,
  setClienteResults,
  setClienteQuery,
  setForm,
}: SearchParams): Promise<void> {
  if (readOnly) return;

  const q = clienteQuery.trim();

  if (!q) {
    setClienteResults([]);
    return;
  }

  let selectedClienteLabel = "";
  let selectedClienteId: number | null = null;

  setForm((prev) => {
    selectedClienteLabel = prev.cliente_label ?? "";
    selectedClienteId = prev.id_cliente ?? null;
    return prev;
  });

  if (
    selectedClienteId &&
    normalizeText(selectedClienteLabel) === normalizeText(q)
  ) {
    setClienteResults([]);
    return;
  }

  setClienteSearching(true);

  try {
    const items = await ventasClientesService.buscarClientes({
      q,
      solo_activos: true,
      limit: 10,
      offset: 0,
    });

    const exactMatches = items.filter((item) => isExactClienteMatch(item, q));

    if (exactMatches.length === 1) {
      const selected = exactMatches[0];

      setForm((prev) => ({
        ...prev,
        id_cliente: selected.id_cliente,
        cliente_label: selected.cliente_label,
        id_tipo_cliente: selected.id_tipo_cliente ?? null,
        tipo_cliente_label: selected.tipo_cliente_label ?? null,
        id_cliente_fiscal: null,
        cliente_fiscal_label: "",
      }));

      setClienteQuery(selected.cliente_label);
      setClienteResults([]);
      return;
    }

    setClienteResults(items);
  } catch {
    setClienteResults([]);
  } finally {
    setClienteSearching(false);
  }
}

export function selectVentasCliente(
  cliente: VentaClienteOption,
  setForm: React.Dispatch<React.SetStateAction<VentaFormState>>,
  setClienteQuery: (value: string) => void,
  setClienteResults: (value: VentaClienteOption[]) => void,
): void {
  setForm((prev) => ({
    ...prev,
    id_cliente: cliente.id_cliente,
    cliente_label: cliente.cliente_label,
    id_tipo_cliente: cliente.id_tipo_cliente ?? null,
    tipo_cliente_label: cliente.tipo_cliente_label ?? null,

    id_cliente_fiscal: null,
    cliente_fiscal_label: "",

    id_forma_pago_principal: prev.marcada_para_facturar
      ? prev.id_forma_pago_principal
      : null,
    forma_pago_principal_label: prev.marcada_para_facturar
      ? prev.forma_pago_principal_label
      : "",
    id_metodo_pago_cfdi: prev.marcada_para_facturar
      ? prev.id_metodo_pago_cfdi
      : null,
    metodo_cfdi_label: prev.marcada_para_facturar
      ? prev.metodo_cfdi_label
      : "",
  }));

  setClienteQuery(cliente.cliente_label);
  setClienteResults([]);
}