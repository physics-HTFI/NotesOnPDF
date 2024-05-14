import FileTree from "@/types/FileTree";
import Coverages from "@/types/Coverages";
import PdfNotes from "@/types/PdfNotes";
import AppSettings from "@/types/AppSettings";
import History from "@/types/History";

export default interface IModel {
  getFileTree(): Promise<FileTree>;
  getHistory(): Promise<History>;
  getIdFromExternalFile(): Promise<string>;
  getIdFromUrl(url: string): Promise<string>;

  getCoverages(): Promise<Coverages>;
  putCoverages(progress: Coverages): Promise<void>;

  getPdfNotes(id: string): Promise<ResultGetPdfNotes>;
  putPdfNotes(id: string, pdfNotes: PdfNotes): Promise<void>;

  getPageImageUrl(
    id: string,
    page: number,
    width: number,
    height: number
  ): string;

  getAppSettings(): Promise<AppSettings>;
  putAppSettings(appSettings: AppSettings): Promise<void>;
}

export interface ResultGetPdfNotes {
  name: string;
  sizes: { width: number; height: number }[];
  notes?: PdfNotes;
}
