import { PdfInfo } from "@/types/PdfInfo";
import { createContext } from "react";

interface PdfInfoContextType {
  pdfInfo?: PdfInfo;
  setPdfInfo?: (pdfInfo: PdfInfo) => void;
  pdfPath?: string;
}

export const PdfInfoContext = createContext<PdfInfoContextType>({});
