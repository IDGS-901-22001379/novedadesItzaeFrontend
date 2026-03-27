// src/modules/ventas/pages/ventas/form/useVentasForm/useVentasForm.init.ts

import type { Dispatch, SetStateAction } from "react";
import { loadVentasFormCatalogContext } from "../ventasForm.catalogs";
import { readCurrentVentasUser } from "../ventasForm.session";
import { buildInitialForm } from "../ventasForm.utils";
import { ventasClientesService } from "../../../../services/ventasClientes.service";
import { usuariosService } from "../../../../../usuarios/services/usuarios.service";
import { FORMAS_PAGO_DEFAULT } from "./useVentasForm.helpers";
import type {
  VentaClienteOption,
  VentaFormaPagoOption,
} from "../../../../types";
import type { VentaFormState, VentasFormProps } from "../ventasForm.types";

type InitParams = {
  props: VentasFormProps;
  readOnly: boolean;

  setForm: Dispatch<SetStateAction<VentaFormState>>;
  setDefaultsLoaded: Dispatch<SetStateAction<boolean>>;
  setMsgError: Dispatch<SetStateAction<string>>;
  setMsgInfoAccion: Dispatch<SetStateAction<string>>;
  setClienteQuery: Dispatch<SetStateAction<string>>;
  setClienteResults: Dispatch<SetStateAction<VentaClienteOption[]>>;
  setCobroOpen: Dispatch<SetStateAction<boolean>>;
  setFormasPagoOptions: Dispatch<SetStateAction<VentaFormaPagoOption[]>>;
};

export async function initVentasForm({
  props,
  readOnly,
  setForm,
  setDefaultsLoaded,
  setMsgError,
  setMsgInfoAccion,
  setClienteQuery,
  setClienteResults,
  setCobroOpen,
  setFormasPagoOptions,
}: InitParams): Promise<void> {
  if (readOnly) {
    setForm(buildInitialForm("VER", props.initialVenta));
    setDefaultsLoaded(true);
    setMsgError("");
    setMsgInfoAccion("");
    setClienteQuery("");
    setClienteResults([]);
    setCobroOpen(false);
    setFormasPagoOptions(FORMAS_PAGO_DEFAULT);
    return;
  }

  setDefaultsLoaded(false);
  setMsgError("");
  setMsgInfoAccion("");
  setClienteQuery("");
  setClienteResults([]);
  setCobroOpen(false);
  setFormasPagoOptions(FORMAS_PAGO_DEFAULT);

  let currentUser = readCurrentVentasUser();

  if (currentUser?.id_usuario && !currentUser?.nombre_en_ticket) {
    try {
      const usuario = await usuariosService.obtener(currentUser.id_usuario);

      currentUser = {
        id_usuario: currentUser.id_usuario,
        nombre_en_ticket:
          usuario.nombre_en_ticket?.trim() ||
          usuario.username?.trim() ||
          currentUser.nombre_en_ticket ||
          "",
      };
    } catch {
      // seguir con lo que exista en sesión
    }
  }

  const catalogCtx = await loadVentasFormCatalogContext({
    services: {
      obtenerClientePublicoGeneral:
        ventasClientesService.obtenerClientePublicoGeneral,
      buscarClientes: ventasClientesService.buscarClientes,
    },
    currentUser,
  });

  setForm(buildInitialForm("CREAR", null, catalogCtx));
  setClienteQuery(
    catalogCtx.nombreClientePublicoGeneral?.trim() || "Publico General",
  );
  setDefaultsLoaded(true);
}