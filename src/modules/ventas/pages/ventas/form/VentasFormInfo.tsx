// src/modules/ventas/pages/ventas/form/VentasFormInfo.tsx
// Bloque de información registrada de la venta.
// Responsabilidades:
// - Mostrar datos de solo lectura cuando el formulario está en modo VER.
// - Separar la información administrativa del resto del formulario.
// - Mostrar datos internos relevantes de la venta ya registrada.

import type { VentaObtenerResponse } from "../../../types";

type Props = {
  venta: VentaObtenerResponse | null;
  formatDate: (value?: string | null) => string;
};

export default function VentasFormInfo({ venta, formatDate }: Props) {
  if (!venta?.venta) return null;

  const item = venta.venta;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 text-sm font-extrabold text-black/70">
        Información registrada
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="text-xs font-extrabold text-black/50">ID venta</div>
        <div className="text-sm font-semibold text-black/80">
          {item.id_venta}
        </div>

        <div className="text-xs font-extrabold text-black/50">Folio</div>
        <div className="text-sm font-semibold text-black/80">
          {item.folio || "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">Estatus</div>
        <div className="text-sm font-semibold text-black/80">
          {item.estatus}
        </div>

        <div className="text-xs font-extrabold text-black/50">Cliente</div>
        <div className="text-sm font-semibold text-black/80">
          {item.id_cliente ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">Vendedor</div>
        <div className="text-sm font-semibold text-black/80">
          {item.id_usuario_vendedor ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">Apertura</div>
        <div className="text-sm font-semibold text-black/80">
          {item.id_apertura ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Fecha servidor
        </div>
        <div className="text-sm font-semibold text-black/80">
          {formatDate(item.fecha_hora)}
        </div>

        <div className="text-xs font-extrabold text-black/50">Fecha POS</div>
        <div className="text-sm font-semibold text-black/80">
          {formatDate(item.fecha_hora_pos)}
        </div>

        <div className="text-xs font-extrabold text-black/50">Fuente hora</div>
        <div className="text-sm font-semibold text-black/80">
          {item.fuente_hora ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Zona horaria POS
        </div>
        <div className="text-sm font-semibold text-black/80">
          {item.timezone_pos ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Offset minutos POS
        </div>
        <div className="text-sm font-semibold text-black/80">
          {item.offset_minutos_pos ?? 0}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Marcada para facturar
        </div>
        <div className="text-sm font-semibold text-black/80">
          {item.marcada_para_facturar ? "Sí" : "No"}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Cliente fiscal
        </div>
        <div className="text-sm font-semibold text-black/80">
          {item.id_cliente_fiscal ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Forma de pago principal
        </div>
        <div className="text-sm font-semibold text-black/80">
          {item.id_forma_pago_principal ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">Método CFDI</div>
        <div className="text-sm font-semibold text-black/80">
          {item.id_metodo_pago_cfdi ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Estado de factura
        </div>
        <div className="text-sm font-semibold text-black/80">
          {item.factura_estado ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Error de factura
        </div>
        <div className="text-sm font-semibold text-black/80">
          {item.factura_error ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">Creado en</div>
        <div className="text-sm font-semibold text-black/80">
          {formatDate(item.creado_en)}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Actualizado en
        </div>
        <div className="text-sm font-semibold text-black/80">
          {formatDate(item.actualizado_en)}
        </div>

        <div className="text-xs font-extrabold text-black/50 md:col-span-2">
          Notas
        </div>
        <div className="text-sm font-semibold text-black/80 md:col-span-2">
          {item.notas?.trim() || "-"}
        </div>
      </div>
    </div>
  );
}
