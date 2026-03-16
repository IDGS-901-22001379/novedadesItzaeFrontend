// src/modules/movimientos_inventario/pages/movimientos_inventario/Movimientos_inventarioForm.tsx
// Formulario principal de movimientos de inventario.
// Responsabilidades:
// - conectar el hook del formulario
// - renderizar secciones
// - mantener el mismo patrón modular que ProductosForm

import { useMovimientosInventarioTheme } from "../../theme/useMovimientosInventarioTheme";

import MovimientosSection from "../../components/movimientos_inventario/form/MovimientosSection";
import MovimientosGeneralFields from "../../components/movimientos_inventario/form/MovimientosGeneralFields";
import MovimientosDetalleTable from "../../components/movimientos_inventario/form/MovimientosDetalleTable";

import type { MovimientosFormProps } from "../../components/movimientos_inventario/form/movimientosForm.types";
import { useMovimientosForm } from "../../components/movimientos_inventario/form/useMovimientosForm";

export default function Movimientos_inventarioForm({
  modo,
  initialMovimiento,
  onSuccess,
  onCancel,
  usuariosMap,
  productosMap,
  ubicacionesMap,
}: MovimientosFormProps) {
  const theme = useMovimientosInventarioTheme();

  const {
    subtitulo,
    movimiento,
    detalle,
    totalDetalle,
    openGeneral,
    setOpenGeneral,
    openDetalle,
    setOpenDetalle,
  } = useMovimientosForm({
    modo,
    initialMovimiento,
    onSuccess,
  });

  if (!movimiento) {
    return (
      <div className="space-y-4">
        <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

        <div className="rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          No se encontró la información del movimiento.
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-extrabold text-black/70">{subtitulo}</div>

      <MovimientosSection
        theme={theme}
        title="Datos generales"
        open={openGeneral}
        onToggle={() => setOpenGeneral((v) => !v)}
      >
        <MovimientosGeneralFields
          movimiento={movimiento}
          usuariosMap={usuariosMap}
          ubicacionesMap={ubicacionesMap}
        />
      </MovimientosSection>

      <MovimientosSection
        theme={theme}
        title="Detalle del movimiento"
        open={openDetalle}
        onToggle={() => setOpenDetalle((v) => !v)}
        rightSlot={
          <div className={`text-sm font-semibold ${theme.headerText}`}>
            Productos: <span className="font-extrabold">{detalle.length}</span>
            <span className="mx-2">·</span>
            Total: <span className="font-extrabold">{totalDetalle}</span>
          </div>
        }
      >
        <MovimientosDetalleTable
          theme={theme}
          detalle={detalle}
          productosMap={productosMap}
        />
      </MovimientosSection>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
