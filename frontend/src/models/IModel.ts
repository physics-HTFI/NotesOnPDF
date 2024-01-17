import { FileTree } from "@/types/FileTree";
import { Progresses } from "@/types/Progresses";
import { PdfInfo } from "@/types/PdfInfo";
import { AppSettings } from "@/types/AppSettings";

export default interface IModel {
  getFileTree(rootPath: string): Promise<FileTree>;

  getProgresses(): Promise<Progresses>;
  putProgresses(progress: Progresses): Promise<void>;

  getPdfInfo(path: string): Promise<PdfInfo | null>;
  putPdfInfo(path: string, pdfInfo: PdfInfo): Promise<void>;

  getAppSettings(): Promise<AppSettings>;
  putAppSettings(appSettings: AppSettings): Promise<void>;
}
