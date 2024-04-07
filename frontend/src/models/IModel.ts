import { FileTree } from "@/types/FileTree";
import { Coverages } from "@/types/Coverages";
import { PdfInfo } from "@/types/PdfInfo";
import { AppSettings } from "@/types/AppSettings";

export default interface IModel {
  getFileTree(): Promise<FileTree>;

  getCoverages(): Promise<Coverages>;
  putCoverages(progress: Coverages): Promise<void>;

  getPdfInfo(id: string): Promise<PdfInfo | null>;
  putPdfInfo(id: string, pdfInfo: PdfInfo): Promise<void>;

  getPageImage(id: string, page: number, width: number): string;

  getAppSettings(): Promise<AppSettings>;
  putAppSettings(appSettings: AppSettings): Promise<void>;
}
