import { Search } from "lucide-react";
import type { VentaDetalleForm } from "../ventasForm.types";
import type { VentaProductoOption } from "../../../../types";
import type { EditableField } from "./ventasFormDetalle.types";
import { formatMoney } from "./ventasFormDetalle.helpers";

type Props = {
  detalle: VentaDetalleForm;
  indexOriginal: number;
  readOnly: boolean;
  producto: VentaProductoOption | null;
  detallesLength: number;
  calcDetalleImporte: (detalle: VentaDetalleForm) => number;
  onUpdateDetalle: (index: number, patch: Partial<VentaDetalleForm>) => void;
  onEliminarDetalle: (index: number) => void;
  onOpenCajaModal: (index: number) => void;
  onOpenPreciosModal: (index: number) => void;
  setCellRef: (
    rowIndex: number,
    field: EditableField,
    element: HTMLInputElement | HTMLSelectElement | null,
  ) => void;
  handleEditableKeyDown: (
    rowIndex: number,
    field: EditableField,
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  normalizeNumericBlur: (
    rowIndex: number,
    key: "cantidad" | "descuento" | "iva_tasa",
    rawValue: string,
  ) => void;
};

export default function VentasFormDetalleRow({
  detalle,
  indexOriginal,
  readOnly,
  producto,
  detallesLength,
  calcDetalleImporte,
  onUpdateDetalle,
  onEliminarDetalle,
  onOpenCajaModal,
  onOpenPreciosModal,
  setCellRef,
  handleEditableKeyDown,
  normalizeNumericBlur,
}: Props) {
  function updateField<K extends keyof VentaDetalleForm>(
    key: K,
    value: VentaDetalleForm[K],
  ) {
    onUpdateDetalle(indexOriginal, {
      [key]: value,
    } as Partial<VentaDetalleForm>);
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-3">
      <div className="overflow-x-auto">
        <div className="flex min-w-295 items-end gap-2">
          <div className="min-w-47.5 flex-[1.35]">
            <label className="mb-1 block text-[11px] font-extrabold">
              Producto
            </label>
            <input
              value={detalle.producto_label}
              disabled
              placeholder="Selecciona un producto"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />
          </div>

          <div className="min-w-37.5 flex-1">
            <label className="mb-1 block text-[11px] font-extrabold">
              Modelo
            </label>
            <input
              value={producto?.modelo ?? ""}
              disabled
              placeholder="Sin modelo"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />
          </div>

          <div className="min-w-42.5 flex-[1.1]">
            <label className="mb-1 block text-[11px] font-extrabold">
              Código barras
            </label>
            <input
              value={producto?.codigo_barras ?? ""}
              disabled
              placeholder="Sin código"
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
            />
          </div>

          <div className="w-28 shrink-0">
            <label className="mb-1 block text-[11px] font-extrabold">
              Presentación
            </label>
            <div className="flex items-center gap-2">
              <select
                ref={(el) => setCellRef(indexOriginal, "presentacion", el)}
                value={detalle.presentacion}
                onChange={(e) =>
                  updateField(
                    "presentacion",
                    e.target.value as VentaDetalleForm["presentacion"],
                  )
                }
                onKeyDown={(e) =>
                  handleEditableKeyDown(indexOriginal, "presentacion", e)
                }
                disabled={readOnly || !detalle.id_producto}
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
              >
                <option value="UNIDAD">UNID</option>
                <option value="CAJA">CAJA</option>
              </select>

              <button
                type="button"
                onClick={() => onOpenCajaModal(indexOriginal)}
                disabled={!detalle.id_producto}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3b82f6] text-white shadow-sm transition hover:bg-[#2563eb] disabled:opacity-50"
                title="Ver información de caja"
              >
                <Search size={15} />
              </button>
            </div>
          </div>

          <div className="w-24 shrink-0">
            <label className="mb-1 block text-[11px] font-extrabold">
              Cantidad
            </label>
            <input
              ref={(el) => setCellRef(indexOriginal, "cantidad", el)}
              type="number"
              min="1"
              step="1"
              value={detalle.cantidad}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) =>
                updateField("cantidad", Number(e.target.value || 0))
              }
              onBlur={(e) =>
                normalizeNumericBlur(
                  indexOriginal,
                  "cantidad",
                  e.currentTarget.value,
                )
              }
              onKeyDown={(e) =>
                handleEditableKeyDown(indexOriginal, "cantidad", e)
              }
              disabled={readOnly}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
            />
          </div>

          <div className="w-30.5 shrink-0">
            <label className="mb-1 block text-[11px] font-extrabold">
              Precio unitario
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={detalle.precio_unitario}
                disabled
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold opacity-90"
              />
              <button
                type="button"
                onClick={() => onOpenPreciosModal(indexOriginal)}
                disabled={!detalle.id_producto}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3b82f6] text-white shadow-sm transition hover:bg-[#2563eb] disabled:opacity-50"
                title="Ver precios del producto"
              >
                <Search size={15} />
              </button>
            </div>
          </div>

          <div className="w-23.75 shrink-0">
            <label className="mb-1 block text-[11px] font-extrabold">
              Descuento
            </label>
            <input
              ref={(el) => setCellRef(indexOriginal, "descuento", el)}
              type="number"
              min="0"
              step="0.01"
              value={detalle.descuento}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) =>
                updateField("descuento", Number(e.target.value || 0))
              }
              onBlur={(e) =>
                normalizeNumericBlur(
                  indexOriginal,
                  "descuento",
                  e.currentTarget.value,
                )
              }
              onKeyDown={(e) =>
                handleEditableKeyDown(indexOriginal, "descuento", e)
              }
              disabled={readOnly}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
            />
          </div>

          <div className="w-22 shrink-0">
            <label className="mb-1 block text-[11px] font-extrabold">
              IVA %
            </label>
            <input
              ref={(el) => setCellRef(indexOriginal, "iva_tasa", el)}
              type="number"
              min="0"
              step="0.01"
              value={detalle.iva_tasa}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) =>
                updateField("iva_tasa", Number(e.target.value || 0))
              }
              onBlur={(e) =>
                normalizeNumericBlur(
                  indexOriginal,
                  "iva_tasa",
                  e.currentTarget.value,
                )
              }
              onKeyDown={(e) =>
                handleEditableKeyDown(indexOriginal, "iva_tasa", e)
              }
              disabled={readOnly}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-90"
            />
          </div>

          <div className="min-w-37.5 flex-1">
            <label className="mb-1 block text-[11px] font-extrabold">
              Importe
            </label>
            <div className="rounded-xl border border-[#b8e6b8] bg-[#eafbea] px-3 py-2 text-sm font-extrabold text-[#2f5f2f]">
              {formatMoney(calcDetalleImporte(detalle))}
            </div>
          </div>

          {!readOnly ? (
            <div className="w-22.5 shrink-0">
              <label className="mb-1 block text-[11px] font-extrabold opacity-0">
                Acción
              </label>
              <button
                type="button"
                onClick={() => onEliminarDetalle(indexOriginal)}
                disabled={detallesLength <= 1}
                className="w-full rounded-xl bg-[#d96c76]/85 px-3 py-2 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#cb5965]/90 disabled:opacity-50"
              >
                Quitar
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
