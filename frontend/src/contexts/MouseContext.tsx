import { Box } from "@mui/material";
import { type ReactNode, createContext, useContext, useState } from "react";
import PdfNotesContext from "./PdfNotesContext/PdfNotesContext";
import { ID_PDF_CANVAS, ID_PDF_CONTAINER } from "@/types/CONSTANTS";
import { useAtomValue, useSetAtom } from "jotai";
import { modelUI } from "@/models/modelUI";
import { usePdf } from "@/components/statePDF閲覧/PdfView/usePdf/usePdf";
import { modelファイル } from "@/models/modelファイル";

export interface Mouse {
  pageX: number;
  pageY: number;
}

const MouseContext = createContext<{
  mouse?: Mouse;
  setMouse: (m: Mouse) => void;
  pageRect?: DOMRect;
  scale: number; // %単位
  top?: number;
  bottom?: number;
}>({
  setMouse: () => undefined,
  scale: 100,
});

export default MouseContext;

/**
 * `MouseContext`のプロバイダー
 */
export function MouseContextProvider({ children }: { children: ReactNode }) {
  const { pdfNotes, imageNum } = useContext(PdfNotesContext);
  const [mouse, setMouse] = useState({ pageX: 0, pageY: 0 });
  const setWaiting = useSetAtom(modelUI.waiting.atom);
  const setOpenDrawer = useSetAtom(modelUI.openDrawer.pdfFileTree.atom);

  const offset = pdfNotes?.settings
    ? {
        top: pdfNotes?.settings.offsetTop,
        bottom: pdfNotes?.settings.offsetBottom,
      }
    : undefined;
  const handle = useAtomValue(modelファイル.pdf.atomHandleValue);
  const onFinishRead = () => {
    setWaiting(false);
    setOpenDrawer(false);
  };
  const pdf = usePdf(
    ID_PDF_CANVAS,
    handle,
    onFinishRead,
    imageNum,
    ID_PDF_CONTAINER,
    offset,
  );

  const scale =
    !pdfNotes || !pdf?.pageRect?.rect
      ? 100
      : (pdfNotes.settings.fontSize * pdf.pageRect.rect.width) / 600;

  return (
    <MouseContext.Provider
      value={{
        mouse,
        setMouse,
        pageRect: pdf?.pageRect?.rect,
        scale,
        top: pdf?.pageRect?.top,
        bottom: pdf?.pageRect?.bottom,
      }}
    >
      <Box id={ID_PDF_CONTAINER}>{children}</Box>
    </MouseContext.Provider>
  );
}
