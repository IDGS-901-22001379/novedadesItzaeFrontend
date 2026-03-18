import type { Compra } from "../../../types/compras.types";

type Props = {
  compra: Compra | null;
};

export default function ComprasFormExtraInfo({ compra }: Props) {
  if (!compra) return null;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 text-sm font-extrabold text-black/70">
        Información adicional
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="text-xs font-extrabold text-black/50">ID compra</div>
        <div className="text-sm font-semibold text-black/80">
          {compra.id_compra}
        </div>

        <div className="text-xs font-extrabold text-black/50">Fecha</div>
        <div className="text-sm font-semibold text-black/80">
          {compra.fecha ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Usuario registra
        </div>
        <div className="text-sm font-semibold text-black/80">
          {compra.id_usuario_registra ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">Creado en</div>
        <div className="text-sm font-semibold text-black/80">
          {compra.creado_en ?? "-"}
        </div>

        <div className="text-xs font-extrabold text-black/50">
          Actualizado en
        </div>
        <div className="text-sm font-semibold text-black/80">
          {compra.actualizado_en ?? "-"}
        </div>
      </div>
    </div>
  );
}
