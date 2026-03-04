// src/modules/clientes_fiscales/components/clientes_fiscales/form/ClientesFiscalesReadOnly.tsx
// Bloque extra de visualización (modo VER) igual estilo que UsuariosForm.

import type { ClienteFiscal } from "../../types/clientes_fiscales.types";

export default function ClientesFiscalesReadOnly({
  item,
}: {
  item: ClienteFiscal;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="text-xs font-extrabold text-black/50">
          ID Cliente fiscal
        </div>
        <div className="text-sm font-semibold text-black/80">
          {item.id_cliente_fiscal}
        </div>

        <div className="text-xs font-extrabold text-black/50">Estatus</div>
        <div className="text-sm font-semibold text-black/80">
          {item.estatus}
        </div>

        <div className="text-xs font-extrabold text-black/50">Creado en</div>
        <div className="text-sm font-semibold text-black/80">
          {item.creado_en ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Actualizado en
        </div>
        <div className="text-sm font-semibold text-black/80">
          {item.actualizado_en ?? "-"}
        </div>
      </div>
    </div>
  );
}
