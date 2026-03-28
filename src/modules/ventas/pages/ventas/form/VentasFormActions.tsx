// src/modules/ventas/pages/ventas/form/VentasFormActions.tsx
// Bloque de acciones de la venta.
// Responsabilidades:
// - Mostrar acciones disponibles en modo visualización.
// - Dejar visibles funciones futuras como imprimir, facturar y crédito.
// - Informar al usuario que esas funciones aún están en desarrollo.

type Props = {
  onImprimir: () => void;
  onFacturar: () => void;
  onCredito: () => void;
};

export default function VentasFormActions({
  onImprimir,
  onFacturar,
  onCredito,
}: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="mb-3 text-sm font-extrabold text-black/70">
        Acciones de la venta
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onImprimir}
          className="rounded-xl bg-[#2B6CB0] px-4 py-2 text-sm font-extrabold text-white hover:opacity-90"
        >
          Imprimir ticket
        </button>

        <button
          type="button"
          onClick={onFacturar}
          className="rounded-xl bg-[#ECC94B] px-4 py-2 text-sm font-extrabold text-[#1A202C] hover:opacity-90"
        >
          Mandar a facturar
        </button>

        <button
          type="button"
          onClick={onCredito}
          className="rounded-xl bg-[#34f334] px-4 py-2 text-sm font-extrabold text-[#0b2b0b] hover:bg-[#2fe72f]"
        >
          Mandar a crédito
        </button>
      </div>

      <div className="mt-3 rounded-2xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-800">
        Estas funciones aún se están trabajando. Por ahora solo se muestran como
        vista previa del flujo que tendrá la venta.
      </div>
    </div>
  );
}
