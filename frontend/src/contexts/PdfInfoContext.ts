import { PdfInfo } from "@/types/PdfInfo";
import { createContext } from "react";

interface PdfInfoContextType {
  pdfinfo?: PdfInfo;
  setPdfInfo?: (pdfinfo: PdfInfo) => void;
  pdfPath?: string;
}

export const PdfInfoContext = createContext<PdfInfoContextType>({});
