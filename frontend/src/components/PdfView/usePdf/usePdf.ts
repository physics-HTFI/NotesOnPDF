import { useState, useSyncExternalStore } from "react";
import { getSnapshotPdf, subscribePdf } from "./PdfJs.store";
import type { Resizer } from "@/types/PageRect";
import { calPageRect } from "./calPageRect";

export function usePdf(
  canvasId: string,
  pdfHandle: FileSystemFileHandle | undefined,
  onFinishRead: () => void,
  currentPageNum: number | undefined,
  containerId: string,
  offset: { top: number; bottom: number } | undefined,
) {
  const { totalPages, pageRect, setCanvasId, setPdfHandle, queueRenderPage } =
    useSyncExternalStore(subscribePdf, getSnapshotPdf);
  const [id, setId] = useState<string>();
  const [handle, setHandle] = useState<FileSystemFileHandle>();
  const [pageNum, setPageNum] = useState<number>();

  const resizer: Resizer = (size) => {
    const elem = document.getElementById(containerId);
    if (!elem) return;
    const rect = elem.getBoundingClientRect();
    return calPageRect(rect, size, offset);
  };

  const rerender = () => {
    if (currentPageNum === undefined) return;
    queueRenderPage(currentPageNum, resizer);
  };

  // canvasId
  if (id !== canvasId) {
    setCanvasId(canvasId);
    setId(canvasId);
  }

  // handle
  if (handle !== pdfHandle) {
    setHandle(pdfHandle);
    setPageNum(undefined);
    if (pdfHandle)
      setPdfHandle(pdfHandle, () => {
        onFinishRead();
        rerender();
      });
  }

  // currentPageNum
  if (offset && pageNum !== currentPageNum) {
    setPageNum(currentPageNum);
    rerender();
  }

  return {
    totalPages,
    pageRect,
    rerender,
  };
}
