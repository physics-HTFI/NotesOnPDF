import { FileTree } from "@/types/FileTree";
import { Progresses } from "@/types/Progresses";
import { PdfInfo } from "@/types/PdfInfo";
import { AppSettings } from "@/types/AppSettings";

export default interface IModel {
  getFileTree(): Promise<FileTree>;

  getProgresses(): Promise<Progresses>;
  putProgresses(progress: Progresses): Promise<void>;

  getPdfInfo(id: string): Promise<PdfInfo | null>;
  putPdfInfo(id: string, pdfInfo: PdfInfo): Promise<void>;

  getAppSettings(): Promise<AppSettings>;
  putAppSettings(appSettings: AppSettings): Promise<void>;
}
