import { Box } from "@mui/material";
import { type ReactNode, createContext, useContext, useState } from "react";
import PdfNotesContext from "./PdfNotesContext/PdfNotesContext";
import { ID_PDF_CANVAS, ID_PDF_CONTAINER } from "@/types/CONSTANTS";
import { useAtomValue, useSetAtom } from "jotai";
import { modelUi } from "@/components/global/modelUi";
import { usePdf } from "@/components/statePDF閲覧/PdfView/usePdf/usePdf";
import { modelPDFファイル } from "@/models/modelPDFファイル";

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
  const setWaiting = useSetAtom(modelUi.waiting.atom);
  const setOpenDrawer = useSetAtom(modelUi.openDrawer.pdfFileTree.atom);

  const offset = pdfNotes?.settings
    ? {
        top: pdfNotes?.settings.offsetTop,
        bottom: pdfNotes?.settings.offsetBottom,
      }
    : undefined;
  const handle = useAtomValue(modelPDFファイル.handle.atomValue);
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
