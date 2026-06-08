import { Box } from "@mui/material";
import { type ReactNode, createContext, useContext, useState } from "react";
import PdfNotesContext from "./PdfNotesContext/PdfNotesContext";
import { ID_PDF_CONTAINER } from "@/types/CONSTANTS";
import { useAtomValue, useSetAtom } from "jotai";
import { modelUI } from "@/models/modelUI";
import { modelファイル } from "@/models/modelファイル";
import { usePdf } from "@/models/utils/usePdf/PdfJs.store";

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
  const { pdfNotes } = useContext(PdfNotesContext);
  const [mouse, setMouse] = useState({ pageX: 0, pageY: 0 });
  const { pageRect } = usePdf();

  const offset = pdfNotes?.settings
    ? {
        top: pdfNotes?.settings.offsetTop,
        bottom: pdfNotes?.settings.offsetBottom,
      }
    : undefined;

  const scale =
    !pdfNotes || !pageRect?.rect
      ? 100
      : (pdfNotes.settings.fontSize * pageRect.rect.width) / 600;

  return (
    <MouseContext.Provider
      value={{
        mouse,
        setMouse,
        pageRect: pageRect?.rect,
        scale,
        top: pageRect?.top,
        bottom: pageRect?.bottom,
      }}
    >
      <Box id={ID_PDF_CONTAINER}>{children}</Box>
    </MouseContext.Provider>
  );
}
