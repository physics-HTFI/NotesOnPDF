import type PdfNotes from "@/types/PdfNotes";

export default interface IModel {
  getFileHandleFromPath(path?: string): FileSystemFileHandle | undefined;

  getPdfNotes(path: string): Promise<ResultGetPdfNotes>;
  putPdfNotes(path: string, pdfNotes: PdfNotes): Promise<void>;
}

export interface ResultGetPdfNotes {
  name: string;
  pages?: number;
  pdfNotes?: PdfNotes;
}
