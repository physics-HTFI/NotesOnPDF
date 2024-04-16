import { FileTree } from "@/types/FileTree";
import { Coverages } from "@/types/Coverages";
import { PdfNotes, PdfInfo } from "@/types/PdfNotes";
import { AppSettings } from "@/types/AppSettings";
import { History } from "@/types/History";

export default interface IModel {
  getFileTree(): Promise<FileTree>;
  getHistory(): Promise<History>;
  getIdFromExternalFile(): Promise<string>;
  getIdFromUrl(url: string): Promise<string>;

  getCoverages(): Promise<Coverages>;
  putCoverages(progress: Coverages): Promise<void>;

  getPdfNotes(id: string): Promise<PdfInfo>;
  putPdfNotes(id: string, pdfNotes: PdfNotes): Promise<void>;

  getPageImage(id: string, page: number, width: number): string;

  getAppSettings(): Promise<AppSettings>;
  putAppSettings(appSettings: AppSettings): Promise<void>;
}
