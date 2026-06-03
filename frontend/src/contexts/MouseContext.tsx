import type PdfNotes from "@/types/PdfNotes";
import { Box } from "@mui/material";
import { type ReactNode, createContext, useContext, useState } from "react";
import PdfNotesContext, {
  type PageSize,
} from "./PdfNotesContext/PdfNotesContext";
import { usePdf } from "@/components/PdfView/usePdf/usePdf";
import { ID_PDF_CANVAS, ID_PDF_CONTAINER } from "@/types/CONSTANTS";
import ModelContext from "./ModelContext/ModelContext";
import UiContext from "./UiContext";

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
  const { model } = useContext(ModelContext);
  const { id, pdfNotes, imageNum } = useContext(PdfNotesContext);
  const [mouse, setMouse] = useState({ pageX: 0, pageY: 0 });
  const { setWaiting, setOpenFileTreeDrawer } = useContext(UiContext);

  const offset = pdfNotes?.settings
    ? {
        top: pdfNotes?.settings.offsetTop,
        bottom: pdfNotes?.settings.offsetBottom,
      }
    : undefined;
  const handle = model.getFileHandleFromPath(id);
  const onFinishRead = () => {
    setWaiting(false);
    setOpenFileTreeDrawer(false);
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
