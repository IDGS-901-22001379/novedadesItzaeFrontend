// src/modules/inventario_existencias/pages/inventario_existencias/form/InventarioExistenciasFormInfo.tsx

import type { ExistenciaDetalle } from "../../../types/inventarioExistencias.types";

import InventarioExistenciasFormField from "./InventarioExistenciasFormField";
import {
  getProductoCodigoBarras,
  getProductoModelo,
  getProductoNombre,
  getProductoSku,
  getSucursalNombre,
  getUbicacionNombre,
  getUbicacionTipo,
} from "./inventarioExistenciasForm.utils";

type Props = {
  item: ExistenciaDetalle | null;
};

export default function InventarioExistenciasFormInfo({ item }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <InventarioExistenciasFormField
        label="Producto"
        value={getProductoNombre(item)}
      />

      <InventarioExistenciasFormField
        label="SKU"
        value={getProductoSku(item) || "-"}
      />

      <InventarioExistenciasFormField
        label="Modelo"
        value={getProductoModelo(item) || "-"}
      />

      <InventarioExistenciasFormField
        label="Código de barras"
        value={getProductoCodigoBarras(item) || "-"}
      />

      <InventarioExistenciasFormField
        label="Sucursal"
        value={getSucursalNombre(item)}
      />

      <InventarioExistenciasFormField
        label="Ubicación"
        value={getUbicacionNombre(item)}
      />

      <InventarioExistenciasFormField
        label="Tipo de ubicación"
        value={getUbicacionTipo(item)}
      />

      <InventarioExistenciasFormField
        label="Existencia actual"
        value={String(item?.existencia ?? 0)}
      />
    </div>
  );
}
