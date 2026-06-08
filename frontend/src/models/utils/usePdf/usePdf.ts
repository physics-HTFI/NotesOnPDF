import { useState, useSyncExternalStore } from "react";
import { getSnapshotPdf, subscribePdf } from "./PdfJs.store";
import type { Resizer } from "@/types/PageRect";
import { calPageRect } from "./calPageRect";
import { ID_PDF_CONTAINER } from "@/types/CONSTANTS";

export function usePdf(
  pdfHandle: FileSystemFileHandle | undefined,
  onFinishRead: () => void,
  currentPageNum: number | undefined,
  offset: { top: number; bottom: number } | undefined,
) {
  const { totalPages, pageRect, setPdfHandle, queueRenderPage } =
    useSyncExternalStore(subscribePdf, getSnapshotPdf);
  const [handle, setHandle] = useState<FileSystemFileHandle>();
  const [pageNum, setPageNum] = useState<number>();

  const resizer: Resizer = (size) => {
    const elem = document.getElementById(ID_PDF_CONTAINER);
    if (!elem) return;
    const rect = elem.getBoundingClientRect();
    return calPageRect(rect, size, offset);
  };

  const rerender = () => {
    if (currentPageNum === undefined) return;
    queueRenderPage(currentPageNum, resizer);
  };

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
