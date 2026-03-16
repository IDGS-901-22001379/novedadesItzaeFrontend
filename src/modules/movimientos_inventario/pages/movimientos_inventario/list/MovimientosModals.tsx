// src/modules/movimientos_inventario/pages/movimientos_inventario/list/MovimientosModals.tsx
// Contenedor de modales del listado de Movimientos de Inventario.
// Responsabilidades:
// - centralizar el modal de visualización
// - conectar el formulario en modo VER

import type { MovimientoInventario } from "../../../types/movimientos_inventario.types";
import type { MovimientosInventarioTheme } from "../../../theme/movimientosInventarioTheme";

import Movimientos_inventarioModalForm from "../../../components/movimientos_inventario/Movimientos_inventarioModalForm";
import Movimientos_inventarioForm from "../Movimientos_inventarioForm";

type Props = {
  theme: MovimientosInventarioTheme;

  openVer: boolean;
  selectedMovimiento: MovimientoInventario | null;

  usuariosMap: Record<number, string>;
  productosMap: Record<number, string>;
  ubicacionesMap: Record<number, string>;

  onCloseVer: () => void;
};

export default function MovimientosModals({
  theme,
  openVer,
  selectedMovimiento,
  usuariosMap,
  productosMap,
  ubicacionesMap,
  onCloseVer,
}: Props) {
  return (
    <Movimientos_inventarioModalForm
      open={openVer}
      title="Visualizar movimiento"
      theme={theme}
      onClose={onCloseVer}
    >
      <Movimientos_inventarioForm
        key={selectedMovimiento?.id_movimiento ?? "ver"}
        modo="VER"
        initialMovimiento={selectedMovimiento}
        onSuccess={() => {}}
        onCancel={onCloseVer}
        usuariosMap={usuariosMap}
        productosMap={productosMap}
        ubicacionesMap={ubicacionesMap}
      />
    </Movimientos_inventarioModalForm>
  );
}
