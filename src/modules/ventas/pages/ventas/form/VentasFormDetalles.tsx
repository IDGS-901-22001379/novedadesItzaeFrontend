// src/modules/ventas/pages/ventas/form/VentasFormDetalles.tsx

import { useMemo, useRef, useState } from "react";
import type { VentaProductoOption } from "../../../types";
import {
  VentasFormDetalleSearch,
  VentasFormDetalleRow,
  VentasFormDetalleCajaModal,
  VentasFormDetallePreciosModal,
  VentasFormDetalleBuscadorModal,
  type ModalBuscadorState,
  type ModalCajaState,
  type ModalPreciosState,
  type VentasFormDetallesProps,
  resolveProductoFromDetalle,
  useVentasFormDetalleNavigation,
} from "./ventasFromdetalle";

export default function VentasFormDetalles({
  detalles,
  readOnly,
  productoQuery,
  setProductoQuery,
  productosEncontrados,
  loadingProductos,
  onSelectProducto,
  onUpdateDetalle,
  onEliminarDetalle,
  calcDetalleImporte,
  productosInfoMap,
}: VentasFormDetallesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const [modalCaja, setModalCaja] = useState<ModalCajaState>({
    open: false,
    detalleIndex: null,
  });

  const [modalPrecios, setModalPrecios] = useState<ModalPreciosState>({
    open: false,
    detalleIndex: null,
  });

  const [modalBuscador, setModalBuscador] = useState<ModalBuscadorState>({
    open: false,
  });

  const [paginaModal, setPaginaModal] = useState(1);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const modalSearchInputRef = useRef<HTMLInputElement | null>(null);

  const detallesOrdenados = useMemo(() => {
    return detalles
      .map((detalle, indexOriginal) => ({
        detalle,
        indexOriginal,
      }))
      .reverse();
  }, [detalles]);

  const posicionVisiblePorIndexOriginal = useMemo(() => {
    const map = new Map<number, number>();
    detallesOrdenados.forEach(({ indexOriginal }, visibleIndex) => {
      map.set(indexOriginal, visibleIndex);
    });
    return map;
  }, [detallesOrdenados]);

  const productosPaginados = useMemo(() => {
    const pageSize = 10;
    const start = (paginaModal - 1) * pageSize;
    return productosEncontrados.slice(start, start + pageSize);
  }, [productosEncontrados, paginaModal]);

  const totalPaginasModal = useMemo(() => {
    const pageSize = 10;
    return Math.max(1, Math.ceil(productosEncontrados.length / pageSize));
  }, [productosEncontrados]);

  const { setCellRef, normalizeNumericBlur, handleEditableKeyDown } =
    useVentasFormDetalleNavigation({
      detalles,
      detallesOrdenados,
      posicionVisiblePorIndexOriginal,
      readOnly,
      setModalBuscador,
      setPaginaModal,
      modalSearchInputRef,
      onUpdateDetalle,
    });

  const detalleCaja =
    modalCaja.detalleIndex != null ? detalles[modalCaja.detalleIndex] : null;
  const productoCaja = resolveProductoFromDetalle(
    detalleCaja,
    productosInfoMap,
  );

  const detallePrecios =
    modalPrecios.detalleIndex != null
      ? detalles[modalPrecios.detalleIndex]
      : null;
  const productoPrecios = resolveProductoFromDetalle(
    detallePrecios,
    productosInfoMap,
  );

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const showDropdown =
      !readOnly && productoQuery.trim().length > 0 && !modalBuscador.open;

    if (!showDropdown) return;
    if (!productosEncontrados.length) return;

    const maxIndex = productosEncontrados.length - 1;
    const currentIndex = Math.min(activeIndex, maxIndex);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const producto = productosEncontrados[currentIndex];
      if (producto) {
        onSelectProducto(producto);
        setProductoQuery("");
        setActiveIndex(0);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setProductoQuery("");
      setActiveIndex(0);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-black/10 bg-white p-4">
        <div className="mb-3 text-sm font-extrabold text-black/70">
          Productos de la venta
        </div>

        <VentasFormDetalleSearch
          readOnly={readOnly}
          productoQuery={productoQuery}
          setProductoQuery={setProductoQuery}
          productosEncontrados={productosEncontrados}
          loadingProductos={loadingProductos}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          onSelectProducto={onSelectProducto}
          onKeyDown={handleSearchKeyDown}
          searchInputRef={searchInputRef}
          modalBuscadorOpen={modalBuscador.open}
          setPaginaModal={setPaginaModal}
        />

        <div className="space-y-3">
          {detallesOrdenados.map(({ detalle, indexOriginal }) => {
            const producto = resolveProductoFromDetalle(
              detalle,
              productosInfoMap,
            );

            return (
              <VentasFormDetalleRow
                key={`detalle-${indexOriginal}-${detalle.id_producto ?? "nuevo"}`}
                detalle={detalle}
                indexOriginal={indexOriginal}
                readOnly={readOnly}
                producto={producto as VentaProductoOption | null}
                detallesLength={detalles.length}
                calcDetalleImporte={calcDetalleImporte}
                onUpdateDetalle={onUpdateDetalle}
                onEliminarDetalle={onEliminarDetalle}
                onOpenCajaModal={(index) =>
                  setModalCaja({ open: true, detalleIndex: index })
                }
                onOpenPreciosModal={(index) =>
                  setModalPrecios({ open: true, detalleIndex: index })
                }
                setCellRef={setCellRef}
                handleEditableKeyDown={handleEditableKeyDown}
                normalizeNumericBlur={normalizeNumericBlur}
              />
            );
          })}

          {detalles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 px-4 py-6 text-center text-sm font-semibold text-slate-500">
              Aún no hay productos agregados.
            </div>
          ) : null}
        </div>
      </div>

      <VentasFormDetalleCajaModal
        open={modalCaja.open}
        producto={productoCaja}
        onClose={() => setModalCaja({ open: false, detalleIndex: null })}
      />

      <VentasFormDetallePreciosModal
        open={modalPrecios.open}
        producto={productoPrecios}
        onClose={() => setModalPrecios({ open: false, detalleIndex: null })}
      />

      <VentasFormDetalleBuscadorModal
        open={modalBuscador.open}
        productoQuery={productoQuery}
        setProductoQuery={setProductoQuery}
        productosPaginados={productosPaginados}
        loadingProductos={loadingProductos}
        paginaModal={paginaModal}
        totalPaginasModal={totalPaginasModal}
        modalSearchInputRef={modalSearchInputRef}
        onClose={() => setModalBuscador({ open: false })}
        onSelectProducto={(producto) => {
          onSelectProducto(producto);
          setModalBuscador({ open: false });
          setProductoQuery("");
          setActiveIndex(0);
        }}
        onPrevPage={() => setPaginaModal((prev) => Math.max(1, prev - 1))}
        onNextPage={() =>
          setPaginaModal((prev) => Math.min(totalPaginasModal, prev + 1))
        }
      />
    </>
  );
}
