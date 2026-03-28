// src/modules/ventas/pages/ventas/VentasList.tsx
// Vista principal del módulo Ventas.
// Responsabilidades:
// - Mostrar listado administrativo.
// - Permitir abrir varias ventas al mismo tiempo.
// - Mantener vivas las ventanas minimizadas sin perder datos.
// - Abrir múltiples capturas y múltiples detalles de venta.
// - Permitir abrir nueva venta con tecla F2.

import { useEffect, useState } from "react";
import { ventasService } from "../../services/ventas.service";

import VentasForm from "./VentasForm";
import VentasDetail from "./VentasDetail";

import { useVentasTheme } from "../../theme/useVentasTheme";

import VentasHeader from "../../components/ventas/VentasHeader";
import VentasFilters from "../../components/ventas/VentasFilters";
import VentasTable from "../../components/ventas/VentasTable";
import VentasPagination from "../../components/ventas/VentasPagination";
import VentasAlert from "../../components/ventas/VentasAlert";
import VentasDesktopWindow from "../../components/ventas/VentasDesktopWindow";

import { useVentasList } from "./list/useVentasList";
import type { VentaListItem, VentaObtenerResponse } from "../../types";

type VentaWindow =
  | {
      id: string;
      tipo: "CREAR";
      title: string;
      minimized: boolean;
      zIndex: number;
      dirty: boolean;
      createdAt: number;
    }
  | {
      id: string;
      tipo: "VER";
      title: string;
      minimized: boolean;
      zIndex: number;
      dirty: boolean;
      createdAt: number;
      venta: VentaObtenerResponse;
    };

function buildWindowId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function VentasList() {
  const theme = useVentasTheme();
  const vm = useVentasList();

  const [windows, setWindows] = useState<VentaWindow[]>([]);

  // Trae una ventana al frente aumentando su zIndex.
  function bringToFront(id: string) {
    setWindows((prev) => {
      const nextZ = Math.max(70, ...prev.map((w) => w.zIndex)) + 1;
      return prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ } : w));
    });
  }

  // Minimiza una ventana sin destruir su contenido.
  function minimizeWindow(id: string) {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
  }

  // Restaura una ventana minimizada y la trae al frente.
  function restoreWindow(id: string) {
    setWindows((prev) => {
      const nextZ = Math.max(70, ...prev.map((w) => w.zIndex)) + 1;
      return prev.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w,
      );
    });
  }

  // Cierra completamente una ventana.
  function closeWindow(id: string) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }

  // Abre una nueva ventana de captura, sin cerrar las demás.
  function openCreateWindow() {
    setWindows((prev) => {
      const nextZ = Math.max(70, ...prev.map((w) => w.zIndex), 70) + 1;
      const count = prev.filter((w) => w.tipo === "CREAR").length + 1;

      return [
        ...prev,
        {
          id: buildWindowId("venta"),
          tipo: "CREAR",
          title: count === 1 ? "Nueva venta" : `Nueva venta ${count}`,
          minimized: false,
          zIndex: nextZ,
          dirty: false,
          createdAt: Date.now(),
        },
      ];
    });
  }

  // Abre una ventana de detalle para la venta seleccionada.
  async function openDetailWindow(item: VentaListItem) {
    try {
      const detalle = await ventasService.obtener(item.id_venta);

      setWindows((prev) => {
        const nextZ = Math.max(70, ...prev.map((w) => w.zIndex), 70) + 1;

        return [
          ...prev,
          {
            id: buildWindowId(`venta-${item.id_venta}`),
            tipo: "VER",
            title: item.folio || `Venta #${item.id_venta}`,
            minimized: false,
            zIndex: nextZ,
            dirty: false,
            createdAt: Date.now(),
            venta: detalle,
          },
        ];
      });
    } catch (error: unknown) {
      console.error(error);
    }
  }

  // Atajo global: F2 abre una nueva venta.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "F2") {
        event.preventDefault();
        openCreateWindow();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const minimizedWindows = windows.filter((w) => w.minimized);

  return (
    <div className="p-4">
      <div
        className={`rounded-3xl border p-4 shadow-sm ${theme.cardBorder} ${theme.headerBg} ${theme.headerText}`}
      >
        <VentasHeader
          theme={theme}
          resumen={vm.resumen}
          loading={vm.state === "loading"}
          onNuevo={openCreateWindow}
        />

        <div
          className={[
            "mt-4 rounded-2xl border border-white/25 bg-white p-4 shadow-sm",
            "text-slate-900",
            "[&_label]:text-slate-900 [&_input]:text-slate-900 [&_select]:text-slate-900",
            "[&_input::placeholder]:text-slate-400",
          ].join(" ")}
        >
          <VentasFilters
            theme={theme}
            filters={vm.filters}
            clientesDisponibles={vm.clientesDisponibles}
            onChange={vm.updateFilters}
          />

          {vm.state === "error" ? (
            <div className="mt-3">
              <VentasAlert type="error" message={vm.errorMsg} />
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <VentasTable
          theme={theme}
          items={vm.itemsPagina}
          onVer={openDetailWindow}
        />

        <VentasPagination
          theme={theme}
          page={vm.page}
          totalPages={vm.totalPages}
          from={vm.from}
          to={vm.to}
          total={vm.total}
          onPrev={() => vm.setPage((p) => Math.max(0, p - 1))}
          onNext={() => vm.setPage((p) => Math.min(vm.totalPages - 1, p + 1))}
        />
      </div>

      {windows.map((win) => {
        const initialRect =
          typeof window !== "undefined"
            ? {
                x: Math.max(
                  20,
                  Math.round(
                    (window.innerWidth - (window.innerWidth - 48)) / 2,
                  ),
                ),
                y: 18,
                width: Math.max(1100, window.innerWidth - 48),
                height: Math.max(700, window.innerHeight - 36),
              }
            : {
                x: 24,
                y: 18,
                width: 1400,
                height: 840,
              };

        if (win.tipo === "CREAR") {
          return (
            <VentasDesktopWindow
              key={win.id}
              id={win.id}
              title={win.title}
              theme={theme}
              minimized={win.minimized}
              zIndex={win.zIndex}
              initialRect={initialRect}
              dirty={win.dirty}
              onFocus={bringToFront}
              onMinimize={minimizeWindow}
              onClose={closeWindow}
            >
              <VentasForm
                key={win.id}
                modo="CREAR"
                initialVenta={null}
                onSuccess={() => {
                  closeWindow(win.id);
                  void vm.cargar();
                }}
                onCancel={() => closeWindow(win.id)}
              />
            </VentasDesktopWindow>
          );
        }

        return (
          <VentasDesktopWindow
            key={win.id}
            id={win.id}
            title={`Visualizar: ${win.title}`}
            theme={theme}
            minimized={win.minimized}
            zIndex={win.zIndex}
            initialRect={initialRect}
            dirty={false}
            onFocus={bringToFront}
            onMinimize={minimizeWindow}
            onClose={closeWindow}
          >
            <VentasDetail item={win.venta} />
          </VentasDesktopWindow>
        );
      })}

      {minimizedWindows.length > 0 ? (
        <div className="fixed bottom-3 left-[max(1rem,260px)] right-3 z-120 flex flex-wrap gap-2 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-xl backdrop-blur-sm">
          {minimizedWindows.map((win) => (
            <button
              key={`tray-${win.id}`}
              type="button"
              onClick={() => restoreWindow(win.id)}
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-extrabold text-slate-800 hover:bg-slate-50"
            >
              {win.tipo === "CREAR" ? "Venta en captura" : "Venta visualizada"}{" "}
              · {win.title}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
