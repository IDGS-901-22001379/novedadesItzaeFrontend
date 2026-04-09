// src/modules/ventas/pages/ventas/form/tiket/TiketPreviewModal.tsx
// Modal de vista previa del ticket.
// Responsabilidades:
// - Mostrar una vista previa clara del ticket.
// - Permitir imprimir desde la misma vista.
// - Permitir confirmar la venta desde la misma vista.
// - Reutilizarse desde cobro y desde ver venta.

import type { TiketData } from "./tiket.types";
import TiketPrintable from "./TiketPrintable";

type Props = {
  open: boolean;
  data: TiketData | null;
  title?: string;
  saving?: boolean;
  onClose: () => void;
  onConfirmar?: () => void;
};

function printCurrentTicket() {
  window.print();
}

export default function TiketPreviewModal({
  open,
  data,
  title = "Vista previa del ticket",
  saving = false,
  onClose,
  onConfirmar,
}: Props) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-[#f7f7f7] shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <div>
            <div className="text-2xl font-extrabold text-black/80">{title}</div>
            <div className="text-sm font-semibold text-black/50">
              Revisa el ticket antes de imprimir o confirmar.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-black/70 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cerrar
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_360px]">
          <div className="overflow-auto bg-white px-6 py-6">
            <div className="mx-auto max-w-[420px]">
              <TiketPrintable data={data} />
            </div>
          </div>

          <div className="border-l border-black/10 bg-[#f5f7fb] p-6">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <div className="text-sm font-extrabold text-blue-900">
                Listo para continuar
              </div>
              <div className="mt-1 text-sm font-semibold text-blue-800">
                Esta vista previa muestra cómo quedará el ticket. Puedes
                imprimirlo o confirmar la venta desde aquí.
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={printCurrentTicket}
                disabled={saving}
                className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-extrabold text-blue-800 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Imprimir ticket
              </button>

              {onConfirmar ? (
                <button
                  type="button"
                  onClick={onConfirmar}
                  disabled={saving}
                  className="rounded-xl bg-[#34f334] px-4 py-3 text-sm font-extrabold text-[#0b2b0b] hover:bg-[#2fe72f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Registrando..." : "Confirmar cobro"}
                </button>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-extrabold text-black/70 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #ventas-ticket-printable,
          #ventas-ticket-printable * {
            visibility: visible !important;
          }

          #ventas-ticket-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            max-width: 80mm;
            margin: 0;
            padding: 8px;
            border-radius: 0;
            box-shadow: none;
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
