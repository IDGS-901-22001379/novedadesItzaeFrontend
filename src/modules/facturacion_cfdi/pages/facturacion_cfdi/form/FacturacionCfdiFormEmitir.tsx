// src/modules/facturacion_cfdi/pages/facturacion_cfdi/form/FacturacionCfdiFormEmitir.tsx
// Bloque visual del modo EMITIR.
// Responsabilidades: capturar venta, cliente fiscal, sucursal, serie y mostrar resumen.

import type {
  ClienteFiscalBuscarItem,
  SerieFacturacion,
} from "../../../types/facturacion_cfdi.types";
import type {
  FacturacionCfdiFormState,
  FacturacionCfdiSucursalItem,
} from "./facturacionCfdiForm.types";
import FacturacionCfdiClienteFiscalAutocomplete from "./FacturacionCfdiClienteFiscalAutocomplete";
import FacturacionCfdiVentaAutocomplete from "./FacturacionCfdiVentaAutocomplete";

type Props = {
  form: FacturacionCfdiFormState;
  setForm: React.Dispatch<React.SetStateAction<FacturacionCfdiFormState>>;
  clientesFiscales: ClienteFiscalBuscarItem[];
  sucursales: FacturacionCfdiSucursalItem[];
  series: SerieFacturacion[];
  loadingCatalogos: boolean;
};

export default function FacturacionCfdiFormEmitir({
  form,
  setForm,
  clientesFiscales,
  sucursales,
  series,
  loadingCatalogos,
}: Props) {
  const clienteFiscalSeleccionado = clientesFiscales.find(
    (x) => String(x.id_cliente_fiscal) === form.id_cliente_fiscal,
  );

  const sucursalSeleccionada = sucursales.find(
    (x) => String(x.id_sucursal) === form.id_sucursal,
  );

  const serieSeleccionada = series.find(
    (x) => String(x.id_serie) === form.id_serie,
  );

  return (
    <div className="space-y-4">
      {loadingCatalogos ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          Cargando catálogos...
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Venta</label>
          <FacturacionCfdiVentaAutocomplete
            valueId={form.id_venta}
            valueLabel={form.venta_label}
            onPick={(venta) =>
              setForm((p) => ({
                ...p,
                id_venta: String(venta.id_venta),
                venta_label: venta.folio || `Venta #${venta.id_venta}`,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Cliente fiscal</label>
          <FacturacionCfdiClienteFiscalAutocomplete
            valueId={form.id_cliente_fiscal}
            valueLabel={form.cliente_fiscal_label}
            onPick={(cliente) =>
              setForm((p) => ({
                ...p,
                id_cliente_fiscal: String(cliente.id_cliente_fiscal),
                cliente_fiscal_label: `${cliente.razon_social} - ${cliente.rfc}`,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Sucursal</label>
          <select
            value={form.id_sucursal}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                id_sucursal: e.target.value,
                id_serie: "",
              }))
            }
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          >
            <option value="">Selecciona una sucursal</option>
            {sucursales.map((s) => (
              <option key={s.id_sucursal} value={String(s.id_sucursal)}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-extrabold">Serie</label>
          <select
            value={form.id_serie}
            onChange={(e) =>
              setForm((p) => ({ ...p, id_serie: e.target.value }))
            }
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
          >
            <option value="">Selecciona una serie</option>
            {series.map((s) => (
              <option key={s.id_serie} value={String(s.id_serie)}>
                {s.serie} {s.descripcion ? `- ${s.descripcion}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
        <div className="text-sm font-extrabold text-black/70">
          Resumen de emisión
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs font-extrabold text-black/50">Venta</div>
            <div className="text-sm font-semibold text-black/80">
              {form.venta_label || "-"}
            </div>
          </div>

          <div>
            <div className="text-xs font-extrabold text-black/50">Sucursal</div>
            <div className="text-sm font-semibold text-black/80">
              {sucursalSeleccionada?.nombre || "-"}
            </div>
          </div>

          <div>
            <div className="text-xs font-extrabold text-black/50">Serie</div>
            <div className="text-sm font-semibold text-black/80">
              {serieSeleccionada
                ? `${serieSeleccionada.serie}${
                    serieSeleccionada.descripcion
                      ? ` - ${serieSeleccionada.descripcion}`
                      : ""
                  }`
                : "-"}
            </div>
          </div>

          <div>
            <div className="text-xs font-extrabold text-black/50">
              Cliente fiscal
            </div>
            <div className="text-sm font-semibold text-black/80">
              {clienteFiscalSeleccionado
                ? `${clienteFiscalSeleccionado.razon_social} - ${clienteFiscalSeleccionado.rfc}`
                : form.cliente_fiscal_label || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
